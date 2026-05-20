# ChainGuard AI

ChainGuard AI is a Vercel-ready Ethereum and Solana risk analyzer for smart contracts, tokens, and wallet/program addresses.

It is designed as a multi-agent blockchain analysis workflow:

1. **Chain Router Agent** — routes Ethereum vs Solana inputs.
2. **Ethereum Contract Agent** — scans Solidity source code for risky patterns such as owner privileges, blacklist logic, mint functions, proxy upgrades, and unsafe calls.
3. **Solana Token Agent** — generates authority, liquidity, metadata, and holder-risk checks for Solana assets.
4. **Risk Reasoning Agent** — converts technical signals into a risk score and severity.
5. **Report Generator Agent** — creates a human-readable audit-style Markdown report.

> This MVP is a pre-audit signal tool. It is not financial advice and does not replace a professional security audit.

## Features

- Ethereum + Solana chain selector
- Address validation
- Solidity source-code risk pattern scanning
- Solana authority/liquidity checklist
- Risk score and severity badges
- Copyable Markdown risk report
- Vercel-ready Next.js app

## Tech Stack

- Next.js 15
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

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local`.

```env
LLM_API_KEY=
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
ETHERSCAN_API_KEY=
HELIUS_API_KEY=
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

The current MVP works without API keys using deterministic rule-based analysis. Explorer and LLM enrichment can be added in the next phase.

## Roadmap

- Fetch verified Ethereum source code from Etherscan
- Fetch Solana token metadata and authorities via Helius/RPC
- Add DexScreener/Birdeye liquidity enrichment
- Add holder concentration checks
- Add AI JSON report refinement via OpenAI-compatible API
- Add PDF export and shareable reports

## Xiaomi MiMo Grant Description

ChainGuard AI is a web-based Ethereum and Solana risk analysis platform. It helps developers, traders, auditors, and crypto users evaluate smart contract and token risks before interacting with blockchain assets. The project uses an AI-driven multi-agent workflow combining chain routing, Solidity pattern scanning, Solana token investigation, risk reasoning, and audit-style report generation.
