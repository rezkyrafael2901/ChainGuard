"use client";

import type { AnalyzeResponse } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

export function RiskReport({ report }: { report: AnalyzeResponse }) {
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

  return (
    <section id="report" className="rounded-[2rem] border border-slate-200 bg-white/85 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.055] dark:shadow-black/30 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.35em] text-emerald-600 dark:text-emerald-300">Risk Report</div>
          <h2 className="mt-3 text-5xl font-black text-slate-950 dark:text-white">{report.riskScore}<span className="text-2xl text-slate-500">/100</span></h2>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">{report.chainName} · {report.addressType} · {report.scanMode} mode</p>
        </div>
        <RiskBadge level={report.riskLevel} />
      </div>
      <p className="mt-5 max-w-3xl text-slate-700 dark:text-slate-300">{report.executiveSummary}</p>
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs break-all text-slate-600 dark:border-white/10 dark:bg-black/30 dark:text-slate-400">{report.address}</div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="text-2xl font-black text-slate-950 dark:text-white">{report.findings.length}</div>
          <div className="text-sm text-slate-500">Findings detected</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="text-2xl font-black text-slate-950 dark:text-white">{report.signals.length}</div>
          <div className="text-sm text-slate-500">Signals collected</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
          <div className="text-2xl font-black text-slate-950 dark:text-white">MVP</div>
          <div className="text-sm text-slate-500">Pre-audit mode</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {report.riskSections.map((section) => (
          <div key={section.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20">
            <h3 className="font-black text-slate-950 dark:text-white">{section.title}</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-400">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {report.findings.map((finding, index) => (
          <div key={`${finding.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-black text-slate-950 dark:text-white">{finding.title}</h3>
              <RiskBadge level={finding.severity} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{finding.description}</p>
            {finding.evidence && <p className="mt-3 rounded-xl bg-slate-100 p-3 font-mono text-xs text-slate-600 dark:bg-white/5 dark:text-slate-400">Evidence: {finding.evidence}</p>}
            <p className="mt-3 rounded-xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800 dark:text-emerald-200">Recommendation: {finding.recommendation}</p>
            {finding.specialistPrompt && <p className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 text-sm text-blue-800 dark:text-blue-200">Specialist prompt: {finding.specialistPrompt}</p>}
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-black/20">
        <h3 className="font-black text-slate-950 dark:text-white">Recommended Manual Checks</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
          {report.recommendedChecks.map((check) => <li key={check}>{check}</li>)}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={copyReport} className="rounded-2xl border border-emerald-500/40 px-5 py-3 font-bold text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-200">Copy Markdown Report</button>
        <button onClick={downloadReport} className="rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950">Download Report</button>
      </div>
    </section>
  );
}
