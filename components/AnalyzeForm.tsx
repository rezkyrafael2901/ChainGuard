"use client";

import { useState } from "react";
import type { AnalyzeResponse, Chain } from "@/lib/types";

export function AnalyzeForm({ onResult }: { onResult: (result: AnalyzeResponse) => void }) {
  const [chain, setChain] = useState<Chain>("ethereum");
  const [address, setAddress] = useState("");
  const [sourceCode, setSourceCode] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain, address, sourceCode, notes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      onResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={() => setChain("ethereum")} className={`rounded-2xl border p-4 text-left ${chain === "ethereum" ? "border-emerald-400 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}>
          <div className="font-bold">Ethereum</div>
          <div className="text-sm text-slate-400">Solidity contracts, ERC-20 tokens, proxy and owner risks.</div>
        </button>
        <button onClick={() => setChain("solana")} className={`rounded-2xl border p-4 text-left ${chain === "solana" ? "border-emerald-400 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}>
          <div className="font-bold">Solana</div>
          <div className="text-sm text-slate-400">Token mint, authority, liquidity, and wallet-risk checklist.</div>
        </button>
      </div>

      <label className="mt-6 block text-sm font-semibold text-slate-300">Address</label>
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={chain === "ethereum" ? "0x..." : "Solana token / wallet / program address"} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono outline-none focus:border-emerald-400" />

      {chain === "ethereum" && (
        <>
          <label className="mt-4 block text-sm font-semibold text-slate-300">Optional Solidity source code</label>
          <textarea value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} rows={7} placeholder="Paste verified Solidity source code to improve analysis..." className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-400" />
        </>
      )}

      <label className="mt-4 block text-sm font-semibold text-slate-300">Optional notes</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add context: token name, suspicious behavior, liquidity pool, deployer info..." className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-emerald-400" />

      {error && <div className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-red-200">{error}</div>}
      <button onClick={submit} disabled={loading || !address.trim()} className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? "Agents are analyzing risk signals..." : "Run AI Risk Analysis"}
      </button>
    </div>
  );
}
