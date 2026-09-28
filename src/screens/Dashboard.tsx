/**
 * Screen 2 — Government Officer Dashboard
 * ------------------------------------------------------------------
 * Sections (top → bottom):
 *   KPI cards  → A. Critical alerts + B. Project map
 *              → C. Scheme overview + D. Two small analytics charts
 *
 * Clicking an alert or a map marker opens Project Details.
 */
import { ArrowRight, FileWarning, IndianRupee, Users, VideoOff } from "lucide-react";
import {
  ALERTS,
  ATTENDANCE_ANOMALIES,
  INSPECTION_COMPLETION,
  KPIS,
  MONTHS,
  PROJECT_BY_ID,
  SCHEMES,
  type Alert,
} from "../data/mockData";
import { RiskBadge, SectionHeader } from "../components/ui";
import { BarChart, LineChart } from "../components/Charts";
import GujaratMap from "../components/GujaratMap";
import { PageTitle } from "../components/Layout";

/* ------------------------------ Alert card --------------------------- */

const ALERT_ICON: Record<Alert["type"], JSX.Element> = {
  attendance: <Users size={16} />,
  invoice: <IndianRupee size={16} />,
  cctv: <VideoOff size={16} />,
  fund: <FileWarning size={16} />,
};

/** One clickable AI alert. Exported so the AI Alerts page can reuse it. */
export function AlertCard({ alert, onOpen }: { alert: Alert; onOpen: (projectId: string) => void }) {
  const project = PROJECT_BY_ID[alert.projectId];
  const stripe = alert.risk === "HIGH" ? "bg-crit" : alert.risk === "MEDIUM" ? "bg-warn" : "bg-ok";

  return (
    <button
      onClick={() => onOpen(alert.projectId)}
      className="group relative flex w-full gap-3 overflow-hidden rounded-md border border-surface-line bg-white p-3 pl-4 text-left transition hover:border-teal-500 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
    >
      {/* Severity stripe on the left edge */}
      <span className={`absolute inset-y-0 left-0 w-1 ${stripe}`} aria-hidden />
      <span className="mt-0.5 text-ink-600">{ALERT_ICON[alert.type]}</span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-900">{alert.title}</span>
          <RiskBadge risk={alert.risk} />
        </span>
        <span className="mt-0.5 block text-xs text-ink-600">
          {project.name} · {project.city}
        </span>
        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {alert.facts.map((f) => (
            <span key={f.label}>
              <span className="text-ink-400">{f.label}: </span>
              <span className="font-mono font-semibold text-ink-900 tabular">{f.value}</span>
            </span>
          ))}
        </span>
      </span>
      <span className="flex flex-col items-end justify-between text-[11px] text-ink-400">
        {alert.time}
        <ArrowRight size={15} className="text-teal-600 opacity-0 transition group-hover:opacity-100" />
      </span>
    </button>
  );
}

/* ------------------------------ Dashboard ---------------------------- */

export default function Dashboard({ onOpenProject }: { onOpenProject: (id: string) => void }) {
  return (
    <>
      <PageTitle title="Monitoring Dashboard" sub="Gujarat region · data refreshed 2 min ago" stage="MONITOR" />

      {/* KPI row */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="card p-4">
            <div className="label">{k.label}</div>
            <div
              className={`mt-1 font-mono text-3xl font-semibold tabular ${
                "tone" in k && k.tone === "crit" ? "text-crit" : "tone" in k && k.tone === "warn" ? "text-warn" : "text-navy-950"
              }`}
            >
              {k.value}
            </div>
            <div className="mt-1 text-xs text-ink-600">{k.note}</div>
          </div>
        ))}
      </section>

      {/* A. Alerts + B. Map */}
      <section className="mt-4 grid gap-4 xl:grid-cols-5">
        <div className="card xl:col-span-2">
          <SectionHeader title="Critical Alerts" action={<span className="text-xs text-ink-400">AI-detected · click to investigate</span>} />
          <div className="flex flex-col gap-2 p-3">
            {ALERTS.map((a) => (
              <AlertCard key={a.id} alert={a} onOpen={onOpenProject} />
            ))}
          </div>
        </div>

        <div className="card xl:col-span-3">
          <SectionHeader title="Project Monitoring Map" action={<span className="text-xs text-ink-400">8 of 248 projects shown</span>} />
          <div className="p-4">
            <GujaratMap onOpen={onOpenProject} />
          </div>
        </div>
      </section>

      {/* C. Schemes + D. Charts */}
      <section className="mt-4 grid gap-4 xl:grid-cols-5">
        <div className="card xl:col-span-3">
          <SectionHeader title="Scheme Overview" />
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
            {SCHEMES.map((s) => {
              // Compliance colour: green ≥ 90, orange 80–89, red < 80
              const tone = s.compliance >= 90 ? "bg-ok" : s.compliance >= 80 ? "bg-warn" : "bg-crit";
              return (
                <div key={s.code} className="rounded-md border border-surface-line p-3">
                  <div className="font-mono text-sm font-semibold tracking-wide text-navy-900">{s.code}</div>
                  <div className="text-[11px] text-ink-400">{s.full}</div>
                  <div className="mt-3 flex items-baseline justify-between text-xs">
                    <span className="text-ink-600">
                      <span className="font-mono font-semibold text-ink-900 tabular">{s.projects}</span> projects
                    </span>
                    <span className="font-mono font-semibold text-ink-900 tabular">{s.compliance}%</span>
                  </div>
                  {/* Compliance bar */}
                  <div className="mt-1.5 h-1.5 rounded-full bg-surface" aria-label={`Compliance ${s.compliance}%`}>
                    <div className={`h-1.5 rounded-full ${tone}`} style={{ width: `${s.compliance}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card xl:col-span-2">
          <SectionHeader title="Analytics · last 6 months" />
          <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-1">
            <div>
              <div className="text-xs font-semibold text-ink-600">Inspection completion (%)</div>
              <BarChart labels={MONTHS} values={INSPECTION_COMPLETION} max={100} ticks={[0, 50, 100]} unit="%" color="#0E9F97" />
            </div>
            <div>
              <div className="text-xs font-semibold text-ink-600">Attendance anomalies flagged</div>
              <LineChart labels={MONTHS} values={ATTENDANCE_ANOMALIES} max={25} ticks={[0, 10, 20]} color="#17315A" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
