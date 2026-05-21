import type { SocialLabel, SocialReport } from "./types";

function labelFromScore(score: number): SocialLabel {
  if (score >= 85) return "Authorized";
  if (score >= 70) return "Safe";
  if (score >= 45) return "Watchlist";
  if (score >= 20) return "Risk";
  return "Scam";
}

function extractLinks(text: string) {
  return text.match(/https?:\/\/[^\s,]+|@[a-zA-Z0-9_]{3,}/g) ?? [];
}

export function analyzeSocialPresence(socialLinks = "", notes = ""): SocialReport {
  const raw = `${socialLinks}\n${notes}`;
  const lower = raw.toLowerCase();
  const links = extractLinks(raw);
  let score = 50;
  const positives: string[] = [];
  const warnings: string[] = [];
  const checkedSignals: string[] = [];

  const hasTwitter = /x\.com|twitter\.com|@[a-z0-9_]{3,}/i.test(raw);
  const hasTelegram = /t\.me|telegram/i.test(raw);
  const hasDiscord = /discord\.gg|discord\.com/i.test(raw);
  const hasWebsite = /https?:\/\/(?!x\.com|twitter\.com|t\.me|discord\.gg|discord\.com|github\.com)[^\s]+/i.test(raw);
  const hasGithub = /github\.com/i.test(raw);
  const hasDocs = /docs|gitbook|whitepaper|medium\.com|mirror\.xyz/i.test(raw);
  const hasAudit = /audit|certik|solidproof|coinsult|assure|halborn|trail of bits|openzeppelin/i.test(lower);
  const hasKyc = /kyc|doxxed|verified team|known team/i.test(lower);
  const hasOfficial = /official|verified|blue check|authorized|partner|foundation/i.test(lower);
  const hasRiskWords = /fake|impersonat|scam|rug|honeypot|blacklist|cannot sell|stolen|phishing|airdrop claim|urgent|guaranteed|100x|private sale|presale/i.test(lower);
  const hasNoSocial = links.length === 0 && !raw.trim();

  checkedSignals.push(`Links/handles detected: ${links.length}`);
  checkedSignals.push(`Twitter/X: ${hasTwitter ? "present" : "missing"}`);
  checkedSignals.push(`Telegram: ${hasTelegram ? "present" : "missing"}`);
  checkedSignals.push(`Discord: ${hasDiscord ? "present" : "missing"}`);
  checkedSignals.push(`Website/docs/GitHub/audit mentions checked from submitted text`);

  if (hasNoSocial) {
    score -= 25;
    warnings.push("No social media or official community links were provided. This makes deployer/supporter verification weak.");
  }
  if (hasTwitter) { score += 8; positives.push("Twitter/X presence provided for public communication checks."); }
  if (hasTelegram || hasDiscord) { score += 8; positives.push("Community channel provided for activity and moderation review."); }
  if (hasWebsite) { score += 8; positives.push("Project website provided for branding, docs, and official-link verification."); }
  if (hasGithub) { score += 10; positives.push("GitHub link provided; code transparency can improve trust if repository activity is real."); }
  if (hasDocs) { score += 8; positives.push("Documentation/whitepaper-style reference detected."); }
  if (hasAudit) { score += 12; positives.push("Audit/security review reference detected. Verify the report URL and scope manually."); }
  if (hasKyc) { score += 8; positives.push("KYC/doxxed/verified-team claim detected. Verify with the named provider."); }
  if (hasOfficial) { score += 6; positives.push("Official/authorized wording detected. Cross-check links from the official website and explorer metadata."); }
  if (hasRiskWords) {
    score -= 30;
    warnings.push("High-risk language detected: fake/scam/rug/honeypot/phishing/guaranteed returns/presale-style wording may indicate impersonation or fraud risk.");
  }
  if (links.length === 1) {
    score -= 8;
    warnings.push("Only one social link/handle was provided. Legitimate projects usually have multiple cross-linked channels.");
  }
  if (!hasWebsite && (hasTelegram || hasTwitter || hasDiscord)) {
    score -= 8;
    warnings.push("Social channel exists but no official website was provided for cross-verification.");
  }
  if (/bit\.ly|tinyurl|shorturl|linktr\.ee|beacons\.ai/i.test(raw)) {
    score -= 12;
    warnings.push("Shortlink/link aggregator detected. Verify final destination carefully to avoid phishing or fake token pages.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = labelFromScore(score);
  const summary = label === "Authorized"
    ? "Social profile looks strong based on submitted signals, but official-link and audit verification are still required."
    : label === "Safe"
      ? "Social profile has several positive trust signals, but it is not fully authorized without manual cross-checks."
      : label === "Watchlist"
        ? "Social profile is incomplete or mixed. Treat as watchlist until official channels, deployer identity, and community history are verified."
        : label === "Risk"
          ? "Social profile contains weak or suspicious signals. Treat as high risk until proven otherwise."
          : "Social profile appears highly suspicious from submitted signals and should be treated as possible scam/impersonation risk.";

  return {
    score,
    label,
    summary,
    positives: positives.length ? positives : ["No strong positive social trust signals were detected from submitted text."],
    warnings: warnings.length ? warnings : ["No major social red flags detected from submitted text. Manual verification is still required."],
    checkedSignals,
    manualChecks: [
      "Verify all social links from the official website and block explorer token metadata, not from random posts.",
      "Check whether deployer/supporter accounts are old, active, and consistently linked to the same project.",
      "Look for impersonation: similar usernames, fake blue checks, copied websites, and recently created Telegram groups.",
      "Review pinned posts, contract address announcements, deleted posts, admin behavior, and community complaints.",
      "Confirm audit/KYC claims with the original provider URL and verify the audited contract address matches this token.",
    ],
  };
}
