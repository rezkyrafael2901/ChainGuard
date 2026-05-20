"use client";

import { useState } from "react";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { RiskReport } from "@/components/RiskReport";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { AnalyzeResponse } from "@/lib/types";

const stats = [
  ["2", "chains covered"],
  ["5", "agent workflow stages"],
  ["10+", "risk signals"],
];

const features = [
  "Ethereum Solidity pattern scanning for owner, mint, blacklist, proxy, tax, and low-level call risks.",
  "Solana token investigation checklist for mint authority, freeze authority, liquidity, metadata, and holders.",
  "Structured risk score, severity labels, recommendations, and copy/download Markdown reports.",
];

const workflow = [
  ["01", "Chain Router", "Routes every address into the correct Ethereum or Solana analysis pipeline."],
  ["02", "Contract Agent", "Scans Solidity code and detects privileged or dangerous contract patterns."],
  ["03", "Token Agent", "Builds Solana authority, liquidity, metadata, and holder-risk checklists."],
  ["04", "Risk Reasoning", "Combines signals into an explainable risk score and severity level."],
  ["05", "Report Generator", "Produces a concise audit-style report for humans and teams."],
];

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-6 md:px-8">
      <nav className="sticky top-4 z-20 flex items-center justify-between rounded-full border border-slate-200 bg-white/70 px-5 py-3 shadow-lg shadow-slate-200/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 dark:shadow-black/20">
        <a href="#top" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-xl font-black text-emerald-300 shadow-glow dark:bg-emerald-400 dark:text-slate-950">CG</div>
          <div className="leading-none">
            <div className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">ChainGuard <span className="text-emerald-500">AI</span></div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Ethereum + Solana MVP</div>
          </div>
        </a>
        <div className="flex items-center gap-3">
          <a href="#workflow" className="hidden text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 md:block">Workflow</a>
          <a href="#report" className="hidden text-sm font-semibold text-slate-600 hover:text-emerald-600 dark:text-slate-300 md:block">Report</a>
          <ThemeToggle />
        </div>
      </nav>

      <section id="top" className="grid gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-20">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-200">Multi-agent blockchain risk analyzer</div>
          <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-slate-950 dark:text-white md:text-7xl">
            Professional risk intelligence for Ethereum & Solana.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
            ChainGuard AI scores smart contract, token, and wallet risk signals using an agent-style workflow: chain routing, pattern scanning, authority checks, risk reasoning, and report generation.
          </p>
          <div className="mt-8 grid max-w-2xl gap-3 md:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="text-3xl font-black text-slate-950 dark:text-white">{value}</div>
                <div className="mt-1 text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {features.map((feature) => (
              <div key={feature} className="flex gap-3 rounded-2xl border border-slate-200 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        <AnalyzeForm onResult={setResult} />
      </section>

      {result && <RiskReport report={result} />}

      <section id="workflow" className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-600 dark:text-emerald-300">Methodology</p>
            <h2 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">Agent Workflow</h2>
          </div>
          <p className="max-w-2xl text-slate-600 dark:text-slate-400">Designed to look beyond a single indicator and combine code, authority, liquidity, metadata, and behavioral signals into a clear pre-audit report.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {workflow.map(([num, title, desc]) => (
            <div key={title} className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/5">
              <div className="text-sm font-black text-emerald-600 dark:text-emerald-300">{num}</div>
              <div className="mt-3 font-black text-slate-950 dark:text-white">{title}</div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white/70 p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/20 md:grid-cols-3 md:p-8">
        <div>
          <h3 className="text-2xl font-black text-slate-950 dark:text-white">Roadmap</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Next phase upgrades for real on-chain intelligence.</p>
        </div>
        <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 md:col-span-2">
          <li>• Etherscan verified source fetching and proxy implementation detection.</li>
          <li>• Helius/RPC Solana mint authority, freeze authority, and metadata enrichment.</li>
          <li>• DexScreener/Birdeye liquidity and holder concentration scoring.</li>
          <li>• LLM-powered JSON report refinement via OpenAI-compatible APIs.</li>
        </ul>
      </section>

      <footer className="mt-14 border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <div className="font-semibold">© {new Date().getFullYear()} ChainGuard AI. All rights reserved.</div>
        <div className="mt-1">Built by <span className="font-black text-emerald-600 dark:text-emerald-300">@rezkyrafael</span> · Blockchain risk intelligence for builders.</div>
      </footer>
    </main>
  );
}
