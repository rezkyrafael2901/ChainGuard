export type Chain = "ethereum" | "bsc" | "polygon" | "base" | "optimism" | "arbitrum" | "solana" | "pumpfun";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ScanMode = "standard" | "meme" | "audit";
export type SocialLabel = "Safe" | "Authorized" | "Watchlist" | "Risk" | "Scam" | "Unknown";

export interface AnalyzeRequest {
  chain: Chain;
  address: string;
  sourceCode?: string;
  notes?: string;
  socialLinks?: string;
  promptTemplate?: string;
  scanMode?: ScanMode;
}

export interface Finding {
  title: string;
  severity: RiskLevel;
  description: string;
  recommendation: string;
  evidence?: string;
  specialistPrompt?: string;
}

export interface RiskSection {
  title: string;
  items: string[];
}

export interface SocialReport {
  score: number;
  label: SocialLabel;
  summary: string;
  positives: string[];
  warnings: string[];
  checkedSignals: string[];
  manualChecks: string[];
}

export interface AnalyzeResponse {
  chain: Chain;
  chainName: string;
  address: string;
  addressType: string;
  scanMode: ScanMode;
  riskScore: number;
  riskLevel: RiskLevel;
  summary: string;
  executiveSummary: string;
  findings: Finding[];
  recommendedChecks: string[];
  riskSections: RiskSection[];
  socialReport: SocialReport;
  markdownReport: string;
  signals: string[];
}
