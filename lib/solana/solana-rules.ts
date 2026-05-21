import type { Finding } from "../types";

export function solanaBaselineFindings(hasNotes: boolean): Finding[] {
  const findings: Finding[] = [
    {
      title: "Authority status requires verification",
      severity: "High",
      evidence: "Solana authority data requires RPC/indexer enrichment in the next phase.",
      description: "Solana token risk depends heavily on mint authority, freeze authority, and metadata mutability. These signals require RPC or indexer enrichment for full confidence.",
      recommendation: "Verify mint authority and freeze authority are disabled or controlled by a transparent governance process.",
      specialistPrompt: "Check this Solana token mint for mint authority, freeze authority, metadata mutability, update authority, token program version, and whether authorities are disabled or controlled by risky wallets.",
    },
    {
      title: "Liquidity and holder concentration not yet enriched",
      severity: "Medium",
      evidence: "No live DexScreener/Birdeye/Helius enrichment is connected in MVP mode.",
      description: "A token can be risky if liquidity is low, controlled by one wallet, or if holder concentration is extreme.",
      recommendation: "Cross-check DexScreener/Birdeye liquidity, top holder concentration, and recent liquidity movements.",
      specialistPrompt: "Investigate liquidity and holder concentration for this Solana token. Identify top holders, LP depth, migration status, bundled buys, and creator wallet exposure.",
    },
  ];

  if (hasNotes) {
    findings.push({
      title: "User-provided context included",
      severity: "Low",
      evidence: "Additional notes were submitted with the scan.",
      description: "Additional notes were included and should be used by the AI reasoning layer to refine the final report.",
      recommendation: "Compare user notes with on-chain evidence before making a final decision.",
    });
  }

  return findings;
}
