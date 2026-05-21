# ChainGuard AI

ChainGuard AI is a Vercel-ready multi-chain blockchain risk analyzer for smart contracts, meme tokens, Solana/Pump.fun launches, deployer behavior, and social-media trust signals.

Live demo: https://chain-guard-sepia.vercel.app/

Repository: https://github.com/rezkyrafael2901/ChainGuard

> ChainGuard AI is a pre-audit triage tool. It is not financial advice and does not replace a professional security audit.

## Supported Chains & Modes

ChainGuard AI currently supports:

- Ethereum
- BNB Smart Chain / BSC
- Polygon
- Base
- Optimism
- Arbitrum
- Solana
- Pump.fun / Solana meme-token mode

Scan modes:

- **Standard mode** — general contract/token pre-audit review
- **Meme mode** — token micin, honeypot, pump, tax, liquidity, sniper, holder-risk checks
- **Audit mode** — deeper smart-contract checklist and manual verification prompts

## Core Features

### Multi-chain smart contract risk analysis

For EVM chains, ChainGuard AI can scan pasted Solidity source code and detect risky patterns such as:

- owner/admin privilege abuse
- blacklist/blocklist logic
- whitelist/allowlist transfer gates
- hidden or unrestricted mint functions
- mutable buy/sell tax
- pause/unpause controls
- proxy/upgradeability risk
- `selfdestruct`
- `tx.origin` authorization risk
- low-level external calls
- max transaction / max wallet / cooldown / trading-enabled honeypot controls

### Solana & Pump.fun token checker

For Solana and Pump.fun-style launches, the app generates a detailed investigation checklist for:

- mint authority
- freeze authority
- metadata mutability
- creator wallet balance
- bonding curve progress
- migration to Raydium/Meteora
- sniper wallets
- bundled buys
- top holder concentration
- liquidity depth
- abnormal transfers

### Meme-token / token micin checker

Dedicated meme mode highlights risks commonly found in token micin launches:

- hidden sell restrictions
- high or mutable taxes
- fake renounce patterns
- owner-controlled trading switches
- blacklist and cooldown traps
- liquidity rug paths
- deployer clone contracts
- social hype vs on-chain safety mismatch

### Social media / deployer supporter report

Users can paste official links, deployer/supporter handles, Telegram, Discord, X/Twitter, GitHub, audit/KYC links, or docs. ChainGuard AI produces a social trust report with labels:

- **Authorized**
- **Safe**
- **Watchlist**
- **Risk**
- **Scam**

The social report includes:

- social score out of 100
- positive social signals
- warning signals
- score breakdown
- official-link candidates
- metadata comparison guidance
- deployer/supporter verification checklist

### Prompt templates for blockchain specialists

The app includes ready-to-use prompt templates for users who do not know how to ask for an audit:

- Full smart-contract security audit
- Honeypot and meme-token check
- Deployer and liquidity risk review
- Solana / Pump.fun token investigation
- L2 bridge and proxy review

Users can click a template and immediately use it as an investigation prompt.

### Detailed report export

Reports include:

- executive summary
- final verdict: Safe / Watchlist / Risk / Scam
- technical summary
- risk score and risk level
- social trust score and label
- market/liquidity score and label
- risk domains reviewed
- technical findings
- evidence and recommendations
- specialist prompts per finding
- manual technical checklist
- manual social checklist
- manual market checklist
- Markdown export
- HTML export
- shareable report link helper
- local browser watchlist/history

### Market / liquidity intelligence

ChainGuard AI includes a market-risk layer for meme tokens and new launches. It detects market context from submitted notes/social links and Dex-style pair URLs, then scores:

- DexScreener / DEXTools / GeckoTerminal / Birdeye links
- liquidity context
- volume spike language
- new-pair / fresh-launch risk
- low-liquidity warnings
- rug / honeypot / liquidity-pull wording
- whale, sniper, bundle, and holder-concentration risk

The market report gives a market verdict such as:

- SAFE / VERIFIED MARKET CONTEXT
- WATCHLIST / NEEDS LIVE VERIFICATION
- RISK / LIMITED CONFIDENCE
- SCAM / HIGH MARKET RISK

## Agent Workflow

ChainGuard AI is designed as an AI-driven multi-agent workflow:

1. **Chain Router Agent** — routes the input to the correct EVM, Solana, or Pump.fun analysis path.
2. **Contract Analyzer Agent** — reviews Solidity code and detects risky contract patterns.
3. **Token / Launch Investigator Agent** — evaluates Solana, Pump.fun, meme-token, liquidity, and authority risks.
4. **Social Intelligence Agent** — rates social media, deployer/supporter channels, official links, and scam indicators.
5. **Risk Reasoning Agent** — combines technical and social signals into structured ratings.
6. **Report Generator Agent** — produces a detailed human-readable report with Markdown and HTML exports.

## Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- ethers.js
- @solana/web3.js
- Vercel Serverless API Routes

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Environment Variables

The current MVP works without API keys using deterministic rule-based analysis and user-submitted data.

Optional future integrations:

```env
LLM_API_KEY=
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
ETHERSCAN_API_KEY=
BSCSCAN_API_KEY=
POLYGONSCAN_API_KEY=
BASESCAN_API_KEY=
OPTIMISM_API_KEY=
ARBISCAN_API_KEY=
HELIUS_API_KEY=
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
BIRDEYE_API_KEY=
DEXSCREENER_API_KEY=
```

## Roadmap

- Automatic verified source fetching from Etherscan/BscScan/PolygonScan/BaseScan/Optimistic Etherscan/Arbiscan
- Helius/RPC Solana authority and metadata enrichment
- DexScreener/Birdeye liquidity and holder concentration checks
- Contract metadata vs social-link cross-verification
- Deployer wallet history and clone-contract detection
- X/Twitter, Telegram, Discord, GitHub activity scoring
- PDF export
- LLM-powered JSON report refinement via OpenAI-compatible APIs
- Shareable report URLs

## Xiaomi MiMo Grant Description

ChainGuard AI is a multi-chain blockchain risk analysis platform deployed on Vercel. It helps developers, traders, auditors, and crypto users evaluate smart contract, token, meme-launch, deployer, and social-media risks before interacting with blockchain assets.

The system uses an AI-driven multi-agent workflow covering EVM contract scanning, Solana/Pump.fun token investigation, meme-token honeypot checks, social media trust scoring, risk reasoning, and detailed audit-style report generation.

## Disclaimer

ChainGuard AI is a pre-audit risk signal tool. It does not guarantee that a contract or token is safe. Always verify findings against live on-chain data, official sources, audited code, and professional security review before making financial decisions.

## Credit

© 2026 ChainGuard AI. All rights reserved.

Built by **@rezkyrafael**.
