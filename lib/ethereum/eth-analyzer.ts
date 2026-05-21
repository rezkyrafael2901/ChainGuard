import { isAddress } from "ethers";
import type { AnalyzeRequest, AnalyzeResponse, Finding, RiskSection } from "../types";
import { clampScore, levelFromScore, severityWeight } from "../risk";
import { ethereumFindings } from "./eth-rules";
import { buildMarkdownReport } from "../report";
import { chainInfo, getChainName } from "../chains";
import { analyzeSocialPresence } from "../social";
import { analyzeMarketSignals } from "../market";

function modeFindings(input: AnalyzeRequest): Finding[] {
  const notes = `${input.notes ?? ""} ${input.sourceCode ?? ""}`.toLowerCase();
  const findings: Finding[] = [];
  if (input.scanMode === "meme" || ["bsc", "base", "pumpfun"].includes(input.chain)) {
    findings.push({
      title: "Meme-token launch risk profile",
      severity: "High",
      evidence: "Meme/pump-style scan mode enabled or high-meme-volume chain selected.",
      description: "Fresh meme tokens often combine low liquidity, concentrated holders, mutable trading rules, hidden taxes, and aggressive social momentum. These require stricter checks than normal blue-chip contracts.",
      recommendation: "Verify liquidity lock/burn, owner renouncement, tax limits, top holders, deployer history, and whether trading can be paused or restricted.",
      specialistPrompt: "Act as a meme-token security analyst. Review this contract for honeypot behavior, hidden sell restrictions, mutable taxes, blacklist logic, max wallet rules, liquidity rug paths, and deployer privilege abuse.",
    });
  }
  if (/pump|bonding|migration|raydium|jupiter|meteora|moonshot/i.test(notes)) {
    findings.push({
      title: "Launchpad / bonding-curve context detected",
      severity: "Medium",
      evidence: "Notes/source mention pump, bonding, migration, Raydium, Jupiter, Meteora, or similar launch terms.",
      description: "Launchpad tokens can change risk after liquidity migration. Early holder distribution, migration timing, and authority status are critical.",
      recommendation: "Check migration status, pool creation wallet, post-migration liquidity depth, creator holdings, and freeze/mint authority state.",
    });
  }
  return findings;
}

export async function analyzeEvm(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const valid = isAddress(input.address);
  const findings: Finding[] = [];
  const signals: string[] = [];
  const info = chainInfo[input.chain];

  if (!valid) {
    findings.push({
      title: `Invalid ${getChainName(input.chain)} address format`,
      severity: "High",
      evidence: "Address validation failed for EVM 0x format.",
      description: "The submitted value does not match a standard EVM address format.",
      recommendation: "Verify the contract/token address and retry with a 0x-prefixed address.",
    });
  } else {
    signals.push(`Valid EVM address format for ${getChainName(input.chain)}`);
  }

  if (input.sourceCode?.trim()) {
    const sourceFindings = ethereumFindings(input.sourceCode);
    findings.push(...sourceFindings);
    signals.push(`Scanned Solidity source code and matched ${sourceFindings.length} risk pattern(s)`);
  } else {
    findings.push({
      title: "No verified Solidity source code provided",
      severity: "Medium",
      evidence: `No source code was pasted. Explorer enrichment for ${info.explorer} is listed as a roadmap feature.`,
      description: "Without verified source code, the analysis cannot inspect privileged functions, proxy behavior, token transfer controls, or honeypot logic with high confidence.",
      recommendation: `Paste verified source code from ${info.explorer} or connect explorer API enrichment before making a final decision.`,
    });
  }

  findings.push(...modeFindings(input));

  const score = clampScore(12 + findings.reduce((sum, f) => sum + severityWeight(f.severity), 0));
  const riskLevel = levelFromScore(score);
  const recommendedChecks = [
    "Confirm owner/admin privileges: renounced, multisig-protected, timelocked, or still externally controlled.",
    "Review transfer restrictions: blacklist, whitelist, max transaction, max wallet, cooldown, trading enable switches, and sell blockers.",
    "Inspect token economics: mint ability, burn logic, taxes/fees, fee recipients, supply changes, and owner-adjustable limits.",
    "Validate liquidity safety: LP lock/burn, liquidity depth, deployer LP ownership, and suspicious liquidity removal paths.",
    "Check deployer behavior: previous token deployments, failed launches, same bytecode clones, funding source, and high-risk wallet interactions.",
    "For L2 chains, verify bridge assumptions, canonical token mapping, proxy admin, and cross-chain governance risk.",
  ];
  const riskSections: RiskSection[] = [
    { title: "Contract Control", items: ["Owner-only functions", "Proxy upgrade authority", "Pause/trading toggles", "Tax and fee mutability"] },
    { title: "Token Trading Safety", items: ["Blacklist/whitelist behavior", "Sell path restrictions", "Max wallet/transaction rules", "Honeypot-like modifiers"] },
    { title: "Market & Liquidity", items: ["LP lock/burn status", "Liquidity depth", "Pool ownership", "Tax wallet sell pressure"] },
    { title: "Deployer Reputation", items: ["Previous launches", "Clone contracts", "Funding source", "Suspicious privileged transfers"] },
  ];
  const executiveSummary = `${getChainName(input.chain)} scan completed in ${input.scanMode ?? "standard"} mode. ChainGuard AI found ${findings.length} issue(s) and produced a ${riskLevel} pre-audit risk rating. This report should be used as a triage layer before manual review, not as final audit approval.`;
  const socialReport = analyzeSocialPresence(input.socialLinks, input.notes);
  const marketReport = analyzeMarketSignals(input.address, input.notes, input.socialLinks);
  const finalVerdict = (() => {
    const combined = Math.round((100 - score + socialReport.score + marketReport.score) / 3);
    if (score >= 85 || socialReport.label === "Scam" || marketReport.label === "Critical") return { label: "Scam" as const, summary: "Critical technical, social, or market risk detected.", recommendation: "Do not interact until verified by a professional audit and live on-chain checks." };
    if (score >= 65 || socialReport.label === "Risk" || marketReport.label === "Weak") return { label: "Risk" as const, summary: "Multiple risk signals require manual verification.", recommendation: "Treat as high-risk and verify ownership, liquidity, deployer, and official links before any action." };
    if (combined >= 70) return { label: "Safe" as const, summary: "No critical signals from submitted data, with acceptable social/market context.", recommendation: "Safe for research only; still verify live on-chain data before interacting with funds." };
    return { label: "Watchlist" as const, summary: "Mixed or incomplete signals detected.", recommendation: "Add to watchlist and collect more verified source, liquidity, holder, and social evidence." };
  })();
  const summary = `${getChainName(input.chain)} analysis completed with ${findings.length} finding(s). The current risk score is ${score}/100 (${riskLevel}). Social media trust rating: ${socialReport.score}/100 (${socialReport.label}). Market rating: ${marketReport.score}/100 (${marketReport.label}). Final verdict: ${finalVerdict.label}.`;

  const response: AnalyzeResponse = {
    chain: input.chain,
    chainName: getChainName(input.chain),
    address: input.address,
    addressType: valid ? `${getChainName(input.chain)} contract/token address` : "Unknown",
    scanMode: input.scanMode ?? "standard",
    riskScore: score,
    riskLevel,
    summary,
    executiveSummary,
    findings,
    recommendedChecks,
    riskSections,
    socialReport,
    marketReport,
    finalVerdict,
    signals,
    markdownReport: "",
  };
  response.markdownReport = buildMarkdownReport(response);
  return response;
}

export const analyzeEthereum = analyzeEvm;
