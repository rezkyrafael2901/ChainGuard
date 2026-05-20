import type { Finding } from "../types";

export function solanaBaselineFindings(hasNotes: boolean): Finding[] {
  const findings: Finding[] = [
    {
      title: "Authority status requires verification",
      severity: "High",
      description: "Solana token risk depends heavily on mint authority, freeze authority, and metadata mutability. These signals require RPC or indexer enrichment for full confidence.",
      recommendation: "Verify mint authority and freeze authority are disabled or controlled by a transparent governance process.",
    },
    {
      title: "Liquidity and holder concentration not yet enriched",
      severity: "Medium",
      description: "A token can be risky if liquidity is low, controlled by one wallet, or if holder concentration is extreme.",
      recommendation: "Cross-check DexScreener/Birdeye liquidity, top holder concentration, and recent liquidity movements.",
    },
  ];

  if (hasNotes) {
    findings.push({
      title: "User-provided context included",
      severity: "Low",
      description: "Additional notes were included and should be used by the AI reasoning layer to refine the final report.",
      recommendation: "Compare user notes with on-chain evidence before making a final decision.",
    });
  }

  return findings;
}
