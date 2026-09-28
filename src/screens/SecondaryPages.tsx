/**
 * SecondaryPages.tsx
 * ------------------------------------------------------------------
 * Lightweight pages behind the remaining sidebar items. They exist so
 * sidebar navigation works end-to-end; they reuse existing components
 * and mock data rather than adding new features.
 *
 *   LiveMonitoring → grid of simulated CCTV feeds across projects
 *   ProjectsList   → sortable-looking table of all projects
 *   AlertsPage     → full list of AI alerts
 *   Reports        → headline numbers + the two dashboard charts
 */
import { ALERTS, ATTENDANCE_ANOMALIES, INSPECTION_COMPLETION, MONTHS, PROJECTS } from "../data/mockData";
import { CctvFeed, RiskBadge, SectionHeader } from "../components/ui";
import { BarChart, LineChart } from "../components/Charts";
import { PageTitle } from "../components/Layout";
import { AlertCard } from "./Dashboard";

type OpenFn = { onOpenProject: (id: string) => void };

/* ---------------------------- Live Monitoring ------------------------ */

export function LiveMonitoring({ onOpenProject }: OpenFn) {
  // One "main hall" camera per project; headcount scales with beneficiaries.
  return (
    <>
      <PageTitle title="Live Monitoring" sub="Main-hall camera for each project · AI head-count refreshes every 60 s" stage="MONITOR" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((p) => (
          <button key={p.id} onClick={() => onOpenProject(p.id)} className="card overflow-hidden p-2 text-left transition hover:border-teal-500">
            <CctvFeed camId="CAM-01" camName="Main Hall" count={Math.round(p.beneficiaries * 0.4 * (1 - p.riskScore / 250))} />
            <div className="flex items-center justify-between gap-2 px-1 pb-1 pt-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.name}</div>
                <div className="text-xs text-ink-600">{p.city} · {p.scheme}</div>
              </div>
              <RiskBadge risk={p.risk} />
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

/* ------------------------------- Projects ---------------------------- */

export function ProjectsList({ onOpenProject }: OpenFn) {
  return (
    <>
      <PageTitle title="Projects" sub="8 of 248 projects shown (Gujarat sample)" stage="MONITOR" />
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface text-left text-xs text-ink-400">
            <tr>
              {["Project", "Scheme", "Location", "Beneficiaries", "Risk score", "Compliance", "Risk"].map((h) => (
                <th key={h} className="px-4 py-2.5 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...PROJECTS].sort((a, b) => b.riskScore - a.riskScore).map((p) => (
              <tr key={p.id} onClick={() => onOpenProject(p.id)} className="cursor-pointer border-t border-surface-line hover:bg-teal-50/50">
                <td className="px-4 py-2.5 font-medium text-teal-700">{p.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs">{p.scheme}</td>
                <td className="px-4 py-2.5">{p.city}</td>
                <td className="px-4 py-2.5 font-mono tabular">{p.beneficiaries}</td>
                <td className="px-4 py-2.5 font-mono tabular">{p.riskScore}/100</td>
                <td className="px-4 py-2.5 font-mono tabular">{p.compliance}%</td>
                <td className="px-4 py-2.5"><RiskBadge risk={p.risk} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* -------------------------------- Alerts ----------------------------- */

export function AlertsPage({ onOpenProject }: OpenFn) {
  return (
    <>
      <PageTitle title="AI Alerts" sub="Anomalies detected from CCTV head-counts, invoices and fund flows" stage="DETECT" />
      <div className="grid gap-3 lg:grid-cols-2">
        {ALERTS.map((a) => (
          <AlertCard key={a.id} alert={a} onOpen={onOpenProject} />
        ))}
      </div>
    </>
  );
}

/* -------------------------------- Reports ---------------------------- */

export function Reports() {
  const headline = [
    { label: "Inspections filed (Sep)", value: "142" },
    { label: "Avg. attendance mismatch", value: "8.4%" },
    { label: "Funds on hold", value: "₹1.9 Cr" },
    { label: "SOS resolved < 24 h", value: "91%" },
  ];
  return (
    <>
      <PageTitle title="Reports" sub="Monthly compliance summary · September 2026" stage="REPORT" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {headline.map((h) => (
          <div key={h.label} className="card p-4">
            <div className="label">{h.label}</div>
            <div className="mt-1 font-mono text-2xl font-semibold text-navy-950 tabular">{h.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <SectionHeader title="Inspection completion (%)" />
          <div className="p-4"><BarChart labels={MONTHS} values={INSPECTION_COMPLETION} max={100} ticks={[0, 50, 100]} unit="%" color="#0E9F97" /></div>
        </div>
        <div className="card">
          <SectionHeader title="Attendance anomalies flagged" />
          <div className="p-4"><LineChart labels={MONTHS} values={ATTENDANCE_ANOMALIES} max={25} ticks={[0, 10, 20]} color="#17315A" /></div>
        </div>
      </div>
    </>
  );
}
