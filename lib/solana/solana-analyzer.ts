import { PublicKey } from "@solana/web3.js";
import type { AnalyzeRequest, AnalyzeResponse } from "../types";
import { clampScore, levelFromScore, severityWeight } from "../risk";
import { buildMarkdownReport } from "../report";
import { solanaBaselineFindings } from "./solana-rules";

function isSolanaAddress(address: string) {
  try {
    const key = new PublicKey(address);
    return PublicKey.isOnCurve(key.toBytes()) || key.toBytes().length === 32;
  } catch {
    return false;
  }
}

export async function analyzeSolana(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const valid = isSolanaAddress(input.address);
  const findings = solanaBaselineFindings(Boolean(input.notes?.trim()));
  const signals: string[] = [];

  if (!valid) {
    findings.unshift({
      title: "Invalid Solana address format",
      severity: "High",
      description: "The submitted value does not decode to a valid 32-byte Solana public key.",
      recommendation: "Verify the token mint, wallet, or program address and retry.",
    });
  } else {
    signals.push("Valid Solana public key format");
  }

  signals.push("Solana MVP mode: baseline authority, liquidity, and holder-risk checklist generated");
  const score = clampScore(10 + findings.reduce((sum, f) => sum + severityWeight(f.severity), 0));
  const riskLevel = levelFromScore(score);
  const recommendedChecks = [
    "Check mint authority and freeze authority status.",
    "Review token metadata mutability and verified creator information.",
    "Inspect liquidity depth, lock status, and recent pool changes.",
    "Check top holder concentration and suspicious deployer transfers.",
  ];
  const summary = `Solana analysis completed in MVP checklist mode with ${findings.length} finding(s). The current risk score is ${score}/100 (${riskLevel}).`;
  const response: AnalyzeResponse = {
    chain: "solana",
    address: input.address,
    addressType: valid ? "Solana token/wallet/program address" : "Unknown",
    riskScore: score,
    riskLevel,
    summary,
    findings,
    recommendedChecks,
    signals,
    markdownReport: "",
  };
  response.markdownReport = buildMarkdownReport(response);
  return response;
}
