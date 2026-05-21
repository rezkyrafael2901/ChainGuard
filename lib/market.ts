import type { ScoreBreakdown } from "./types";

export interface MarketReport {
  score: number;
  label: "Strong" | "Neutral" | "Weak" | "Critical";
  summary: string;
  signals: string[];
  positives: string[];
  warnings: string[];
  verdict: string;
  scoreBreakdown: ScoreBreakdown[];
  dexPairs: string[];
  manualChecks: string[];
}

function labelFromScore(score: number): MarketReport["label"] {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Neutral";
  if (score >= 35) return "Weak";
  return "Critical";
}

function extractUrls(text: string) {
  return text.match(/https?:\/\/[^\s,]+/g) ?? [];
}

export function analyzeMarketSignals(address = "", notes = "", socialLinks = ""): MarketReport {
  const raw = `${address}\n${notes}\n${socialLinks}`;
  const lower = raw.toLowerCase();
  const urls = extractUrls(raw);
  const dexPairs = urls.filter((u) => /dexscreener|dextools|geckoterminal|birdeye|raydium|pancakeswap|uniswap|jupiter/i.test(u));
  const signals: string[] = [];
  const positives: string[] = [];
  const warnings: string[] = [];
  const scoreBreakdown: ScoreBreakdown[] = [{ label: "Base market score", points: 50, reason: "Neutral starting point before market/liquidity checks." }];
  let score = 50;

  const hasDex = dexPairs.length > 0;
  const hasLiquidity = /liquidity|lp|pool|dex|pair|volume|fdv|market cap|mc|mcap/i.test(lower);
  const hasLowLiquidityRisk = /low liquidity|thin liquidity|illiquid|barely liquid|tiny liquidity/i.test(lower);
  const hasHighVolume = /high volume|volume spike|rapid volume|pump/i.test(lower);
  const hasAgeMention = /new pair|new token|fresh launch|launched today|hours old|minutes old|brand new/i.test(lower);
  const hasRugSignals = /rug|dump|liquidity pull|removed liquidity|lp pull|honeypot|sell blocked/i.test(lower);
  const hasTopHolderConcern = /top holder|holder concentration|whale|sniper|bundle/i.test(lower);
  const hasContractAddress = /^0x[a-fA-F0-9]{40}$/.test(address.trim()) || /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(address.trim());
  const hasSocial = /x\.com|twitter\.com|t\.me|discord\.gg|discord\.com|github\.com/i.test(raw);

  signals.push(`Dex pair links detected: ${dexPairs.length}`);
  signals.push(`Liquidity/volume keywords detected: ${hasLiquidity ? "yes" : "no"}`);
  signals.push(`Social links present: ${hasSocial ? "yes" : "no"}`);
  signals.push(`Address format appears ${hasContractAddress ? "recognized" : "unverified"}`);

  if (hasDex) { score += 15; positives.push("Dex/market pair links provided; market verification can be performed faster."); scoreBreakdown.push({ label: "Dex pair links", points: 15, reason: "Market links or pair references were provided." }); }
  if (hasLiquidity) { score += 10; positives.push("Liquidity/market context detected."); scoreBreakdown.push({ label: "Liquidity context", points: 10, reason: "Liquidity or market cap context was provided in the input." }); }
  if (hasSocial) { score += 5; positives.push("Social links available for cross-verification."); scoreBreakdown.push({ label: "Social cross-checks", points: 5, reason: "Social links can be used to compare official market announcements." }); }
  if (hasHighVolume) { score += 5; positives.push("High-volume trading context detected."); scoreBreakdown.push({ label: "Volume context", points: 5, reason: "Volume context may help validate real market activity." }); }
  if (hasLowLiquidityRisk) { score -= 20; warnings.push("Low liquidity risk language detected."); scoreBreakdown.push({ label: "Low liquidity risk", points: -20, reason: "Input suggests thin liquidity or easy slippage risk." }); }
  if (hasAgeMention) { score -= 12; warnings.push("Very new token/pair mentioned."); scoreBreakdown.push({ label: "Very new launch", points: -12, reason: "New launches often have higher rug and manipulation risk." }); }
  if (hasRugSignals) { score -= 28; warnings.push("Rug / honeypot / liquidity pull signals detected."); scoreBreakdown.push({ label: "Rug signals", points: -28, reason: "Input contains rug, honeypot, or liquidity pull wording." }); }
  if (hasTopHolderConcern) { score -= 14; warnings.push("Holder concentration or sniper signals detected."); scoreBreakdown.push({ label: "Holder concentration", points: -14, reason: "Large whale, sniper, or bundle exposure can create exit risk." }); }
  if (!hasDex && !hasLiquidity) { score -= 8; warnings.push("No clear market pair or liquidity context was provided."); scoreBreakdown.push({ label: "No market context", points: -8, reason: "Missing pair/liquidity context weakens the market report." }); }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = labelFromScore(score);
  const summary = label === "Strong"
    ? "Market/liquidity context looks strong based on the provided evidence, but live pair verification is still required."
    : label === "Neutral"
      ? "Market/liquidity context is acceptable but still requires live pair and volume verification."
      : label === "Weak"
        ? "Market/liquidity context is weak or incomplete. Treat as watchlist until verified."
        : "Market/liquidity context is very weak or dangerous. Treat as critical risk until proven otherwise.";

  const verdict = label === "Strong"
    ? "SAFE / VERIFIED MARKET CONTEXT"
    : label === "Neutral"
      ? "WATCHLIST / NEEDS LIVE VERIFICATION"
      : label === "Weak"
        ? "RISK / LIMITED CONFIDENCE"
        : "SCAM / HIGH MARKET RISK";

  return {
    score,
    label,
    summary,
    signals,
    positives: positives.length ? positives : ["No strong market positives detected from the submitted context."],
    warnings: warnings.length ? warnings : ["No major market red flags detected from the submitted context."],
    verdict,
    scoreBreakdown,
    dexPairs,
    manualChecks: [
      "Open every pair URL and confirm liquidity, volume, and contract address manually.",
      "Check whether liquidity is locked/burned or controlled by the deployer wallet.",
      "Compare market announcements with official social links and explorer metadata.",
      "Inspect top holders, sniper wallets, bundle buys, and price/volume imbalance.",
      "Treat brand-new pairs or tiny liquidity pools as high-risk until proven otherwise.",
    ],
  };
}
