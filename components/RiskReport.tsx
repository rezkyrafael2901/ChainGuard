"use client";

import { useState } from "react";
import type { AnalyzeResponse } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

export function RiskReport({ report }: { report: AnalyzeResponse }) {
  const [tab, setTab] = useState<"overview" | "social" | "technical" | "checklist">("overview");

  async function copyReport() {
    await navigator.clipboard.writeText(report.markdownReport);
  }

  function downloadReport() {
    const blob = new Blob([report.markdownReport], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chainguard-${report.chain}-risk-report.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportHtml() {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>ChainGuard AI Report</title><style>body{font-family:Inter,Arial,sans-serif;max-width:960px;margin:40px auto;line-height:1.6;color:#0f172a}pre{white-space:pre-wrap;background:#f1f5f9;padding:20px;border-radius:16px}h1{color:#059669}</style></head><body><h1>ChainGuard AI Risk Report</h1><pre>${report.markdownReport.replace(/[&<>]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c] as string))}</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chainguard-${report.chain}-risk-report.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs = [
    ["overview", "Overview"],
    ["social", "Social Report"],
    ["technical", "Technical Findings"],
    ["checklist", "Manual Checklist"],
  ] as const;

  return (
    <section id="report" className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/30 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">Risk Report</div>
          <h2 className="mt-3 text-5xl font-black text-slate-950 dark:text-white">{report.riskScore}<span className="text-2xl text-slate-500">/100</span></h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{report.chainName} · {report.addressType} · {report.scanMode} mode</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <RiskBadge level={report.riskLevel} />
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-bold text-blue-700 dark:text-blue-200">Social: {report.socialReport.label}</span>
        </div>
      </div>
      <p className="mt-5 max-w-3xl text-slate-700 dark:text-slate-300">{report.executiveSummary}</p>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs break-all text-slate-600 dark:border-white/10 dark:bg-black/30 dark:text-slate-400">{report.address}</div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20"><div className="text-2xl font-black text-slate-950 dark:text-white">{report.findings.length}</div><div className="text-sm text-slate-500">Findings</div></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20"><div className="text-2xl font-black text-slate-950 dark:text-white">{report.signals.length}</div><div className="text-sm text-slate-500">Signals</div></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20"><div className="text-2xl font-black text-slate-950 dark:text-white">{report.socialReport.score}/100</div><div className="text-sm text-slate-500">Social Score</div></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20"><div className="text-2xl font-black text-slate-950 dark:text-white">{report.socialReport.label}</div><div className="text-sm text-slate-500">Social Label</div></div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-black/20">
        {tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === id ? "bg-slate-950 text-white dark:bg-emerald-400 dark:text-slate-950" : "text-slate-600 dark:text-slate-300"}`}>{label}</button>)}
      </div>

      {tab === "overview" && <div className="mt-6 grid gap-4 md:grid-cols-2">
        {report.riskSections.map((section) => <div key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20"><h3 className="font-black text-slate-950 dark:text-white">{section.title}</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">{section.items.map((item) => <li key={item}>{item}</li>)}</ul></div>)}
      </div>}

      {tab === "social" && <div className="mt-6 grid gap-4">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5"><h3 className="font-black text-slate-950 dark:text-white">Social Media / Deployer Supporter Rating</h3><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{report.socialReport.summary}</p></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5"><h4 className="font-black text-emerald-800 dark:text-emerald-200">Positive signals</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">{report.socialReport.positives.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5"><h4 className="font-black text-orange-800 dark:text-orange-200">Warning signals</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">{report.socialReport.warnings.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20"><h4 className="font-black text-slate-950 dark:text-white">Score breakdown</h4><ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">{report.socialReport.scoreBreakdown.map((b) => <li key={`${b.label}-${b.points}`}><span className={b.points >= 0 ? "text-emerald-600" : "text-red-500"}>{b.points >= 0 ? "+" : ""}{b.points}</span> · <b>{b.label}</b> — {b.reason}</li>)}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20"><h4 className="font-black text-slate-950 dark:text-white">Official link / metadata comparison</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">{report.socialReport.metadataComparison.map((x) => <li key={x}>{x}</li>)}</ul></div>
      </div>}

      {tab === "technical" && <div className="mt-6 grid gap-4">{report.findings.map((finding, index) => <div key={`${finding.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-black/20"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-lg font-black text-slate-950 dark:text-white">{finding.title}</h3><RiskBadge level={finding.severity} /></div><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{finding.description}</p>{finding.evidence && <p className="mt-3 rounded-xl bg-slate-100 p-3 font-mono text-xs text-slate-600 dark:bg-white/5 dark:text-slate-400">Evidence: {finding.evidence}</p>}<p className="mt-3 rounded-xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">Recommendation: {finding.recommendation}</p>{finding.specialistPrompt && <p className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-800 dark:text-blue-200">Specialist prompt: {finding.specialistPrompt}</p>}</div>)}</div>}

      {tab === "checklist" && <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20"><h3 className="font-black text-slate-950 dark:text-white">Technical Manual Checks</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">{report.recommendedChecks.map((check) => <li key={check}>{check}</li>)}</ul></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20"><h3 className="font-black text-slate-950 dark:text-white">Social Manual Checks</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">{report.socialReport.manualChecks.map((check) => <li key={check}>{check}</li>)}</ul></div></div>}

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={copyReport} className="rounded-2xl border border-emerald-500/40 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-200">Copy Markdown Report</button>
        <button onClick={downloadReport} className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">Download Markdown</button>
        <button onClick={exportHtml} className="rounded-2xl border border-blue-500/40 px-5 py-3 font-bold text-blue-700 hover:bg-blue-500/10 dark:text-blue-200">Export HTML</button>
      </div>
    </section>
  );
}
