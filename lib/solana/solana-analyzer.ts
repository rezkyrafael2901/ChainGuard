import { PublicKey } from "@solana/web3.js";
import type { AnalyzeRequest, AnalyzeResponse, Finding, RiskSection } from "../types";
import { clampScore, levelFromScore, severityWeight } from "../risk";
import { buildMarkdownReport } from "../report";
import { solanaBaselineFindings } from "./solana-rules";
import { getChainName } from "../chains";

function isSolanaAddress(address: string) {
  try {
    const key = new PublicKey(address);
    return key.toBytes().length === 32;
  } catch {
    return false;
  }
}

function pumpFunFindings(input: AnalyzeRequest): Finding[] {
  if (input.chain !== "pumpfun" && input.scanMode !== "meme") return [];
  return [
    {
      title: "Pump.fun / meme launch risk mode",
      severity: "High",
      evidence: "Pump.fun or meme-token scan mode selected.",
      description: "Pump.fun-style launches can move quickly from bonding curve to DEX liquidity. Risk depends on creator holdings, snipers, migration status, authority state, and post-migration liquidity depth.",
      recommendation: "Check creator wallet holdings, top holders, bundled buys, bonding curve progress, Raydium/Meteora migration, mint/freeze authority, and whether liquidity is deep enough for exits.",
      specialistPrompt: "Act as a Solana meme coin investigator. Review this token for pump.fun launch risks: creator holdings, sniper wallets, bundled buys, bonding curve status, migration to Raydium/Meteora, mint/freeze authority, metadata mutability, liquidity depth, and rug-pull indicators.",
    },
    {
      title: "Social momentum vs on-chain safety gap",
      severity: "Medium",
      evidence: "Meme token launches often rely on social velocity before on-chain safety is verified.",
      description: "High volume and viral marketing do not prove contract or token safety. A detailed holder/liquidity review is still required.",
      recommendation: "Compare social claims with on-chain facts: creator balance, LP migration, authority state, top-holder concentration, and transaction distribution.",
    },
  ];
}

export async function analyzeSolana(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const valid = isSolanaAddress(input.address);
  const findings: Finding[] = [...solanaBaselineFindings(Boolean(input.notes?.trim())), ...pumpFunFindings(input)];
  const signals: string[] = [];

  if (!valid) {
    findings.unshift({
      title: "Invalid Solana address format",
      severity: "High",
      evidence: "PublicKey decoding failed.",
      description: "The submitted value does not decode to a valid 32-byte Solana public key.",
      recommendation: "Verify the token mint, wallet, or program address and retry.",
    });
  } else {
    signals.push(`Valid ${getChainName(input.chain)} public key format`);
  }

  signals.push(`${getChainName(input.chain)} MVP mode: authority, liquidity, metadata, holder concentration, and launch-risk checklist generated`);
  const score = clampScore(10 + findings.reduce((sum, f) => sum + severityWeight(f.severity), 0));
  const riskLevel = levelFromScore(score);
  const recommendedChecks = [
    "Check mint authority and freeze authority status.",
    "Review token metadata mutability and verified creator information.",
    "Inspect liquidity depth, lock/migration status, and recent pool changes.",
    "Check top holder concentration, bundled buys, sniper wallets, and creator wallet balance.",
    "For Pump.fun-style tokens, verify bonding curve progress and post-migration DEX pool health.",
  ];
  const riskSections: RiskSection[] = [
    { title: "Authority & Metadata", items: ["Mint authority", "Freeze authority", "Metadata mutability", "Creator verification"] },
    { title: "Launch Structure", items: ["Bonding curve status", "DEX migration", "Creator allocation", "Initial sniper wallets"] },
    { title: "Liquidity & Market", items: ["Pool depth", "Liquidity migration", "Slippage risk", "Volume quality"] },
    { title: "Holder Behavior", items: ["Top holder concentration", "Bundled buys", "Wallet clustering", "Abnormal transfers"] },
  ];
  const executiveSummary = `${getChainName(input.chain)} scan completed in ${input.scanMode ?? "standard"} mode. ChainGuard AI generated ${findings.length} investigation finding(s) focused on token authorities, liquidity, metadata, holder concentration, and launch mechanics.`;
  const summary = `${getChainName(input.chain)} analysis completed in MVP checklist mode with ${findings.length} finding(s). The current risk score is ${score}/100 (${riskLevel}).`;
  const response: AnalyzeResponse = {
    chain: input.chain,
    chainName: getChainName(input.chain),
    address: input.address,
    addressType: valid ? `${getChainName(input.chain)} token/wallet/program address` : "Unknown",
    scanMode: input.scanMode ?? (input.chain === "pumpfun" ? "meme" : "standard"),
    riskScore: score,
    riskLevel,
    summary,
    executiveSummary,
    findings,
    recommendedChecks,
    riskSections,
    signals,
    markdownReport: "",
  };
  response.markdownReport = buildMarkdownReport(response);
  return response;
}
