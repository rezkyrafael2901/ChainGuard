export type Chain = "ethereum" | "bsc" | "polygon" | "base" | "optimism" | "arbitrum" | "solana" | "pumpfun";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ScanMode = "standard" | "meme" | "audit";
export type SocialLabel = "Safe" | "Authorized" | "Watchlist" | "Risk" | "Scam" | "Unknown";
export type MarketLabel = "Strong" | "Neutral" | "Weak" | "Critical";

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

export interface ScoreBreakdown {
  label: string;
  points: number;
  reason: string;
}

export interface SocialReport {
  score: number;
  label: SocialLabel;
  summary: string;
  positives: string[];
  warnings: string[];
  checkedSignals: string[];
  manualChecks: string[];
  officialLinks: string[];
  metadataComparison: string[];
  scoreBreakdown: ScoreBreakdown[];
}

export interface MarketReport {
  score: number;
  label: MarketLabel;
  summary: string;
  signals: string[];
  positives: string[];
  warnings: string[];
  verdict: string;
  scoreBreakdown: ScoreBreakdown[];
  dexPairs: string[];
  manualChecks: string[];
}

export interface FinalVerdict {
  label: "Safe" | "Watchlist" | "Risk" | "Scam";
  summary: string;
  recommendation: string;
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
  marketReport: MarketReport;
  finalVerdict: FinalVerdict;
  markdownReport: string;
  signals: string[];
}
