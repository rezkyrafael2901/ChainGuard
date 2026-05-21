"use client";

const prompts = [
  {
    title: "Full smart-contract security audit",
    text: "Act as a senior smart contract auditor. Review this token contract for owner privilege abuse, mint paths, blacklist/whitelist logic, hidden sell restrictions, upgradeability, pause controls, unsafe external calls, reentrancy, fee/tax manipulation, and liquidity rug vectors. Return severity, evidence, exploit scenario, and recommended fix for each issue.",
  },
  {
    title: "Honeypot and meme-token check",
    text: "Act as a blockchain honeypot investigator. Determine whether this token allows users to buy but prevents or penalizes selling. Inspect blacklist logic, max transaction/wallet rules, cooldowns, tradingEnabled flags, dynamic sell tax, router restrictions, owner-only transfer controls, and fake renounce patterns.",
  },
  {
    title: "Deployer and liquidity risk review",
    text: "Act as an on-chain risk analyst. Review deployer wallet history, funding source, previous token launches, LP lock/burn status, liquidity ownership, tax wallet behavior, top holder concentration, and suspicious transfers. Explain whether this looks like a high-risk launch or potential rug setup.",
  },
  {
    title: "Solana / Pump.fun token investigation",
    text: "Act as a Solana meme coin specialist. Check mint authority, freeze authority, metadata mutability, creator wallet balance, bonding curve progress, migration to Raydium/Meteora, bundled buys, sniper wallets, top holders, liquidity depth, and abnormal transfers. Produce a risk score and what to verify manually.",
  },
  {
    title: "L2 bridge and proxy review",
    text: "Act as an L2 security researcher. Review this Base/Optimism/Arbitrum/Polygon contract for proxy admin risk, bridge/canonical token assumptions, upgrade timelocks, cross-chain governance controls, privileged roles, and whether users depend on off-chain or cross-chain trust assumptions.",
  },
];

export function PromptLibrary({ onUse }: { onUse: (prompt: string) => void }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/20 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-300">Prompt templates</p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Blockchain specialist prompts</h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">Klik salah satu contoh prompt untuk mengisi investigation notes. Cocok untuk user yang bingung harus menanyakan apa saat audit token.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {prompts.map((prompt) => (
          <button key={prompt.title} onClick={() => onUse(prompt.text)} className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg dark:border-white/10 dark:bg-black/20 dark:hover:border-emerald-400/60">
            <div className="font-black text-slate-950 dark:text-white">{prompt.title}</div>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{prompt.text}</p>
            <div className="mt-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">Use this prompt →</div>
          </button>
        ))}
      </div>
    </section>
  );
}

export { prompts };
