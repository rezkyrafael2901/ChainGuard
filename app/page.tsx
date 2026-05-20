"use client";

import { useState } from "react";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { RiskReport } from "@/components/RiskReport";
import type { AnalyzeResponse } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <nav className="flex items-center justify-between">
        <div className="font-black tracking-tight text-white">ChainGuard<span className="text-emerald-300"> AI</span></div>
        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300">Ethereum + Solana MVP</div>
      </nav>

      <section className="grid gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-5 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">Multi-agent blockchain risk analyzer</div>
          <h1 className="text-5xl font-black leading-tight text-white md:text-7xl">Analyze Ethereum & Solana risks before you interact.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">ChainGuard AI is a Vercel-ready web app that scores smart contract, token, and wallet risk signals using an agent-style workflow: chain routing, pattern scanning, risk reasoning, and report generation.</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Owner, mint, blacklist & proxy checks</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Solana authority & liquidity checklist</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">Markdown audit-style reports</div>
          </div>
        </div>
        <AnalyzeForm onResult={setResult} />
      </section>

      {result && <RiskReport report={result} />}

      <section className="py-16">
        <h2 className="text-3xl font-black">Agent Workflow</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-5">
          {["Chain Router", "ETH Contract Agent", "SOL Token Agent", "Risk Reasoning", "Report Generator"].map((step, i) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-emerald-300">0{i + 1}</div>
              <div className="mt-2 font-bold">{step}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
