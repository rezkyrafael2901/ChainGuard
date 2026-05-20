export type Chain = "ethereum" | "solana";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface AnalyzeRequest {
  chain: Chain;
  address: string;
  sourceCode?: string;
  notes?: string;
}

export interface Finding {
  title: string;
  severity: RiskLevel;
  description: string;
  recommendation: string;
}

export interface AnalyzeResponse {
  chain: Chain;
  address: string;
  addressType: string;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  findings: Finding[];
  recommendedChecks: string[];
  markdownReport: string;
  signals: string[];
}
