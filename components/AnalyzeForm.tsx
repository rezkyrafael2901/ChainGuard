"use client";

import { useEffect, useState } from "react";
import type { AnalyzeResponse, Chain, ScanMode } from "@/lib/types";
import { chainInfo } from "@/lib/chains";
import { prompts } from "./PromptLibrary";

const sampleEth = `contract RiskyToken {
  address public owner;
  mapping(address => bool) public blacklist;
  modifier onlyOwner(){ require(msg.sender == owner); _; }
  function mint(address to, uint amount) public onlyOwner {}
  function setTax(uint value) external onlyOwner {}
  function upgradeTo(address impl) external onlyOwner {}
}`;

const chains = Object.entries(chainInfo) as Array<[Chain, (typeof chainInfo)[Chain]]>;

export function AnalyzeForm({ onResult, presetNotes }: { onResult: (result: AnalyzeResponse) => void; presetNotes?: string }) {
  const [chain, setChain] = useState<Chain>("ethereum");
  const [scanMode, setScanMode] = useState<ScanMode>("standard");
  const [address, setAddress] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [notes, setNotes] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (presetNotes) setNotes(presetNotes);
  }, [presetNotes]);

  function selectChain(next: Chain) {
    setChain(next);
    if (next === "pumpfun") setScanMode("meme");
  }

  function loadSample() {
    if (chainInfo[chain].family === "evm") {
      setAddress("0x0000000000000000000000000000000000000000");
      setSourceCode(sampleEth);
      setNotes("Demo token with owner controls, minting, blacklist, tax changes, max wallet restrictions, and upgrade behavior.");
    } else {
      setAddress("So11111111111111111111111111111111111111112");
      setNotes("Demo Solana/Pump.fun token analysis: check mint authority, freeze authority, creator allocation, bonding curve, migration, liquidity, sniper wallets, and holder concentration.");
    }
  }

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain, address, sourceCode, notes, socialLinks, scanMode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      onResult(json);
      setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/30">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-300">Multi-chain analyzer</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">Run a detailed pre-audit scan</h2>
        </div>
        <button onClick={loadSample} className="rounded-full border border-emerald-500/40 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-500/10 dark:text-emerald-200">Load sample</button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {chains.map(([key, info]) => (
          <button key={key} onClick={() => selectChain(key)} className={`rounded-2xl border p-4 text-left transition ${chain === key ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"}`}>
            <div className="font-black text-slate-950 dark:text-white">{info.family === "evm" ? "◆" : "◎"} {info.name}</div>
            <div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{info.specialty}</div>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {(["standard", "meme", "audit"] as ScanMode[]).map((mode) => (
          <button key={mode} onClick={() => setScanMode(mode)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${scanMode === mode ? "bg-slate-950 text-white dark:bg-emerald-400 dark:text-slate-950" : "border border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300"}`}>{mode} mode</button>
        ))}
      </div>

      <label className="mt-6 block text-sm font-bold text-slate-700 dark:text-slate-300">Contract / token / wallet address</label>
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={chainInfo[chain].family === "evm" ? "0x..." : "Solana token / wallet / program address"} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-black/30 dark:text-white" />

      {chainInfo[chain].family === "evm" && (
        <>
          <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-300">Optional verified Solidity source code</label>
          <textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} rows={7} placeholder={`Paste verified source code from ${chainInfo[chain].explorer}...`} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-black/30 dark:text-white" />
        </>
      )}

      <label className="mt-4 block text-sm font-bold text-slate-700 dark:text-slate-300">Social media / deployer supporter links</label>
      <textarea value={socialLinks} onChange={(e) => setSocialLinks(e.target.value)} rows={3} placeholder="Paste official website, X/Twitter, Telegram, Discord, GitHub, audit/KYC links, deployer/supporter handles..." className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-black/30 dark:text-white" />
      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">ChainGuard will rate social trust as Safe / Authorized / Watchlist / Risk / Scam based on provided links and warning signals.</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Investigation notes / manual prompt</label>
        <select onChange={(e) => e.target.value && setNotes(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 dark:border-white/10 dark:bg-slate-950 dark:text-white" defaultValue="">
          <option value="">Use specialist prompt template...</option>
          {prompts.map((prompt) => <option key={prompt.title} value={prompt.text}>{prompt.title}</option>)}
        </select>
      </div>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add context or choose a specialist prompt template..." className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-white/10 dark:bg-black/30 dark:text-white" />

      {error && <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-red-700 dark:text-red-200">{error}</div>}
      <button onClick={submit} disabled={loading || !address.trim()} className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-4 font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300">
        {loading ? "Agents are generating detailed risk report..." : "Run Detailed Security Analysis"}
      </button>
    </div>
  );
}
