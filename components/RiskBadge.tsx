import type { RiskLevel } from "@/lib/types";

const styles: Record<RiskLevel, string> = {
  Low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200",
  Medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-200",
  High: "border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-200",
  Critical: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-200",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <span className={`rounded-full border px-3 py-1 text-sm font-semibold ${styles[level]}`}>{level}</span>;
}
