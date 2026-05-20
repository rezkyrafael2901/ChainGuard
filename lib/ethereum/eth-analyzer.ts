import { isAddress } from "ethers";
import type { AnalyzeRequest, AnalyzeResponse, Finding } from "../types";
import { clampScore, levelFromScore, severityWeight } from "../risk";
import { ethereumFindings } from "./eth-rules";
import { buildMarkdownReport } from "../report";

export async function analyzeEthereum(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const valid = isAddress(input.address);
  const findings: Finding[] = [];
  const signals: string[] = [];

  if (!valid) {
    findings.push({
      title: "Invalid Ethereum address format",
      severity: "High",
      description: "The submitted value does not match a standard EVM address format.",
      recommendation: "Verify the contract/token address and retry with a 0x-prefixed address.",
    });
  } else {
    signals.push("Valid EVM address format");
  }

  if (input.sourceCode?.trim()) {
    const sourceFindings = ethereumFindings(input.sourceCode);
    findings.push(...sourceFindings);
    signals.push(`Scanned Solidity source code and matched ${sourceFindings.length} risk pattern(s)`);
  } else {
    findings.push({
      title: "No Solidity source code provided",
      severity: "Medium",
      description: "Without verified source code, the analysis cannot inspect privileged functions, proxy behavior, or token controls.",
      recommendation: "Paste verified source code or connect an explorer API such as Etherscan for automatic enrichment.",
    });
  }

  const score = clampScore(15 + findings.reduce((sum, f) => sum + severityWeight(f.severity), 0));
  const riskLevel = levelFromScore(score);
  const recommendedChecks = [
    "Verify whether ownership is renounced, multisig-protected, or timelocked.",
    "Check token taxes, blacklist logic, mint authority, and proxy admin permissions.",
    "Review liquidity lock status and deployer wallet behavior before trading.",
    "Run a manual audit for any High or Critical finding before interacting with funds.",
  ];
  const summary = `Ethereum analysis completed with ${findings.length} finding(s). The current risk score is ${score}/100 (${riskLevel}).`;

  const response: AnalyzeResponse = {
    chain: "ethereum",
    address: input.address,
    addressType: valid ? "EVM contract/token address" : "Unknown",
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
