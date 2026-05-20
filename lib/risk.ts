import type { RiskLevel } from "./types";

export function levelFromScore(score: number): RiskLevel {
  if (score >= 85) return "Critical";
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function severityWeight(level: RiskLevel) {
  return { Low: 8, Medium: 16, High: 26, Critical: 36 }[level];
}
