import type { RiskLevel } from "@/lib/types";

const styles: Record<RiskLevel, string> = {
  Low: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  Medium: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  High: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  Critical: "border-red-400/40 bg-red-400/10 text-red-200",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${styles[level]}`}>{level}</span>;
}
