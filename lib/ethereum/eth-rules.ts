import type { Finding, RiskLevel } from "../types";

export const ethereumPatterns: Array<{ pattern: RegExp; title: string; severity: RiskLevel; recommendation: string; prompt: string }> = [
  { pattern: /onlyOwner|Ownable|owner\s*\(/i, title: "Centralized owner privileges", severity: "High", recommendation: "Review all owner-only functions and require multisig/timelock controls for privileged operations.", prompt: "Audit every onlyOwner/admin path. Identify whether the owner can change balances, trading rules, fees, mint supply, upgrade implementation, pause transfers, or drain funds." },
  { pattern: /blacklist|isBlacklisted|blocklist/i, title: "Blacklist or blocklist logic", severity: "High", recommendation: "Verify whether users can be arbitrarily blocked from transferring or selling tokens.", prompt: "Check whether blacklist/blocklist logic can selectively stop sells, target wallets, or create a honeypot after launch." },
  { pattern: /whitelist|allowlist/i, title: "Whitelist / allowlist transfer controls", severity: "Medium", recommendation: "Check whether trading access can be restricted after launch.", prompt: "Inspect allowlist/whitelist gates and determine whether normal users can buy but fail to sell or transfer." },
  { pattern: /\b_mint\b|\bmint\s*\(/i, title: "Mint capability detected", severity: "High", recommendation: "Confirm mint authority is capped, renounced, or controlled by transparent governance.", prompt: "Find all mint paths and determine who can inflate supply, whether caps exist, and whether mint events can be hidden through internal functions." },
  { pattern: /setTax|setFee|buyTax|sellTax|_tax|fee/i, title: "Mutable tax or fee controls", severity: "High", recommendation: "Inspect maximum fee limits and whether the owner can change taxes to abusive levels.", prompt: "Analyze all tax/fee setters. Identify maximum values, fee recipients, sell-specific taxes, and whether the owner can set 100% sell tax." },
  { pattern: /pause\s*\(|unpause\s*\(|Pausable/i, title: "Pausable transfer behavior", severity: "Medium", recommendation: "Verify pause controls cannot be abused to freeze user funds indefinitely.", prompt: "Review pause controls and whether pausing affects transfers, sells, liquidity removal, or privileged wallets differently." },
  { pattern: /delegatecall|upgradeTo|TransparentUpgradeableProxy|UUPS|implementation/i, title: "Upgradeable/proxy behavior", severity: "High", recommendation: "Review proxy admin permissions, implementation history, and upgrade timelock policy.", prompt: "Determine if this is a proxy/upgradeable contract. Identify proxy admin, upgrade function, timelock, and whether logic can be replaced after users buy." },
  { pattern: /selfdestruct|suicide/i, title: "Destructive contract opcode", severity: "Critical", recommendation: "Avoid interacting unless the destructive path is unreachable or formally justified.", prompt: "Trace selfdestruct/suicide reachability and determine who can trigger it and what funds or contract behavior are affected." },
  { pattern: /tx\.origin/i, title: "tx.origin authorization risk", severity: "High", recommendation: "Replace tx.origin checks with msg.sender based authorization.", prompt: "Review tx.origin usage for phishing-compatible authorization bypasses and unsafe privileged checks." },
  { pattern: /call\s*\{|\.call\(/i, title: "Low-level external call", severity: "Medium", recommendation: "Review reentrancy protections, return-value checks, and external call ordering.", prompt: "Inspect low-level calls for reentrancy, unchecked return values, arbitrary target control, and unsafe ordering before state updates." },
  { pattern: /maxTx|maxWallet|cooldown|tradingEnabled|enableTrading|swapEnabled/i, title: "Anti-bot / trading control logic", severity: "High", recommendation: "Verify these controls cannot become hidden sell blockers or launch-time honeypot mechanisms.", prompt: "Audit maxTx, maxWallet, cooldown, tradingEnabled, and swapEnabled logic. Determine whether buys and sells are treated differently and whether owner can trap holders." },
];

export function ethereumFindings(sourceCode: string): Finding[] {
  return ethereumPatterns
    .filter((rule) => rule.pattern.test(sourceCode))
    .map((rule) => ({
      title: rule.title,
      severity: rule.severity,
      evidence: `Matched Solidity pattern: ${rule.pattern.toString()}`,
      description: `The Solidity source contains patterns associated with ${rule.title.toLowerCase()}. This is not automatically malicious, but it requires manual review before interacting with the contract.`,
      recommendation: rule.recommendation,
      specialistPrompt: rule.prompt,
    }));
}
