"use client";

import type { AnalyzeResponse } from "@/lib/types";
import { RiskBadge } from "./RiskBadge";

export function RiskReport({ report }: { report: AnalyzeResponse }) {
  async function copyReport() {
    await navigator.clipboard.writeText(report.markdownReport);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.3em] text-emerald-300">Risk Report</div>
          <h2 className="mt-2 text-3xl font-black">{report.riskScore}/100</h2>
        </div>
        <RiskBadge level={report.riskLevel} />
      </div>
      <p className="mt-4 text-slate-300">{report.summary}</p>
      <div className="mt-5 rounded-2xl bg-black/30 p-4 font-mono text-xs text-slate-400 break-all">{report.chain} · {report.address}</div>

      <div className="mt-6 grid gap-4">
        {report.findings.map((finding, index) => (
          <div key={`${finding.title}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold">{finding.title}</h3>
              <RiskBadge level={finding.severity} />
            </div>
            <p className="mt-2 text-sm text-slate-300">{finding.description}</p>
            <p className="mt-2 text-sm text-emerald-200">Recommendation: {finding.recommendation}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <h3 className="font-bold">Recommended Manual Checks</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          {report.recommendedChecks.map((check) => <li key={check}>{check}</li>)}
        </ul>
      </div>

      <button onClick={copyReport} className="mt-6 rounded-2xl border border-emerald-400/40 px-5 py-3 font-semibold text-emerald-200 hover:bg-emerald-400/10">Copy Markdown Report</button>
    </section>
  );
}
