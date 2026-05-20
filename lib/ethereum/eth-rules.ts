import type { Finding, RiskLevel } from "../types";

export const ethereumPatterns: Array<{ pattern: RegExp; title: string; severity: RiskLevel; recommendation: string }> = [
  { pattern: /onlyOwner|Ownable|owner\s*\(/i, title: "Centralized owner privileges", severity: "High", recommendation: "Review all owner-only functions and require multisig/timelock controls for privileged operations." },
  { pattern: /blacklist|isBlacklisted|blocklist/i, title: "Blacklist or blocklist logic", severity: "High", recommendation: "Verify whether users can be arbitrarily blocked from transferring or selling tokens." },
  { pattern: /whitelist|allowlist/i, title: "Whitelist / allowlist transfer controls", severity: "Medium", recommendation: "Check whether trading access can be restricted after launch." },
  { pattern: /\b_mint\b|\bmint\s*\(/i, title: "Mint capability detected", severity: "High", recommendation: "Confirm mint authority is capped, renounced, or controlled by transparent governance." },
  { pattern: /setTax|setFee|buyTax|sellTax|_tax/i, title: "Mutable tax or fee controls", severity: "High", recommendation: "Inspect maximum fee limits and whether the owner can change taxes to abusive levels." },
  { pattern: /pause\s*\(|unpause\s*\(|Pausable/i, title: "Pausable transfer behavior", severity: "Medium", recommendation: "Verify pause controls cannot be abused to freeze user funds indefinitely." },
  { pattern: /delegatecall|upgradeTo|TransparentUpgradeableProxy|UUPS/i, title: "Upgradeable/proxy behavior", severity: "High", recommendation: "Review proxy admin permissions, implementation history, and upgrade timelock policy." },
  { pattern: /selfdestruct|suicide/i, title: "Destructive contract opcode", severity: "Critical", recommendation: "Avoid interacting unless the destructive path is unreachable or formally justified." },
  { pattern: /tx\.origin/i, title: "tx.origin authorization risk", severity: "High", recommendation: "Replace tx.origin checks with msg.sender based authorization." },
  { pattern: /call\s*\{|\.call\(/i, title: "Low-level external call", severity: "Medium", recommendation: "Review reentrancy protections, return-value checks, and external call ordering." },
];

export function ethereumFindings(sourceCode: string): Finding[] {
  return ethereumPatterns
    .filter((rule) => rule.pattern.test(sourceCode))
    .map((rule) => ({
      title: rule.title,
      severity: rule.severity,
      description: `The Solidity source contains patterns associated with ${rule.title.toLowerCase()}. This is not automatically malicious, but it requires manual review before interacting with the contract.`,
      recommendation: rule.recommendation,
    }));
}
