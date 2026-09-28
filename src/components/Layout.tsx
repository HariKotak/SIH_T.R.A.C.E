/**
 * Layout.tsx
 * ------------------------------------------------------------------
 * The chrome around every screen:
 *   - BrandHeader → T.R.A.C.E. branding, department name, current role, logout
 *   - Sidebar     → Government Officer navigation (6 items)
 *   - PipelineStrip → MONITOR → DETECT → VERIFY → INSPECT → REPORT,
 *                     highlighting where in the story the current screen sits
 */
import { ReactNode } from "react";
import { BarChart3, BellRing, ClipboardCheck, FolderKanban, LayoutDashboard, LogOut, MonitorPlay, ShieldCheck } from "lucide-react";

/** Every page the officer can navigate to. */
export type Page = "dashboard" | "live" | "inspections" | "projects" | "alerts" | "reports" | "project" | "inspectorApp";

export const NAV: { id: Page; label: string; icon: ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { id: "live", label: "Live Monitoring", icon: <MonitorPlay size={17} /> },
  { id: "inspections", label: "Inspections", icon: <ClipboardCheck size={17} /> },
  { id: "projects", label: "Projects", icon: <FolderKanban size={17} /> },
  { id: "alerts", label: "AI Alerts", icon: <BellRing size={17} /> },
  { id: "reports", label: "Reports", icon: <BarChart3 size={17} /> },
];

/* ------------------------------ Branding ----------------------------- */

/** The logo block. `compact` hides the department line (used in phone mock-ups). */
export function Brand({ light = true }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-teal-500 text-white">
        <ShieldCheck size={20} />
      </div>
      <div className="leading-tight">
        <div className={`font-mono text-[15px] font-semibold tracking-[0.18em] ${light ? "text-white" : "text-navy-950"}`}>T.R.A.C.E.</div>
        <div className={`text-[11px] ${light ? "text-white/70" : "text-ink-600"}`}>Transparent Resource &amp; Audit Compliance Ecosystem</div>
      </div>
    </div>
  );
}

export function BrandHeader({ roleLabel, onLogout }: { roleLabel: string; onLogout: () => void }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 bg-navy-950 px-4 py-3 md:px-6">
      <Brand />
      <div className="hidden text-right text-[11px] leading-tight text-white/60 lg:block">
        Department of Social Justice &amp; Empowerment
        <br />
        Government of India
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded bg-white/10 px-2 py-1 text-xs font-medium text-white">{roleLabel}</span>
        <button onClick={onLogout} className="flex items-center gap-1 text-xs text-white/70 hover:text-white">
          <LogOut size={14} /> Switch role
        </button>
      </div>
    </header>
  );
}

/* ------------------------------- Sidebar ----------------------------- */

export function Sidebar({ page, onNavigate, openAlerts }: { page: Page; onNavigate: (p: Page) => void; openAlerts: number }) {
  // Project details & inspector app are "inside" other sections, so keep a parent highlighted.
  const active: Page = page === "project" ? "projects" : page === "inspectorApp" ? "inspections" : page;

  return (
    <nav
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-navy-800 bg-navy-900 p-2 md:w-56 md:flex-col md:overflow-visible md:border-b-0 md:p-3"
      aria-label="Main"
    >
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
            active === item.id ? "bg-teal-600 font-semibold text-white" : "text-white/75 hover:bg-white/5 hover:text-white"
          }`}
        >
          {item.icon}
          <span className="whitespace-nowrap">{item.label}</span>
          {/* Alert count bubble on the AI Alerts item */}
          {item.id === "alerts" && (
            <span className="ml-auto rounded-full bg-crit px-1.5 text-[10px] font-bold text-white tabular">{openAlerts}</span>
          )}
        </button>
      ))}
    </nav>
  );
}

/* ---------------------------- Pipeline strip ------------------------- */

const STAGES = ["MONITOR", "DETECT", "VERIFY", "INSPECT", "REPORT"] as const;
export type Stage = (typeof STAGES)[number];

/** Shows the product story and which stage the current screen demonstrates. */
export function PipelineStrip({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  return (
    <ol className="flex flex-wrap items-center gap-1 text-[11px] font-semibold tracking-[0.08em]" aria-label="T.R.A.C.E. workflow">
      {STAGES.map((s, i) => (
        <li key={s} className="flex items-center gap-1">
          <span
            className={`rounded px-2 py-1 ${
              i === idx ? "bg-navy-900 text-white" : i < idx ? "bg-teal-50 text-teal-700" : "bg-white text-ink-400 border border-surface-line"
            }`}
          >
            {s}
          </span>
          {i < STAGES.length - 1 && <span className="text-ink-400">→</span>}
        </li>
      ))}
    </ol>
  );
}

/** Page title row with optional breadcrumb + right-side actions. */
export function PageTitle({ title, sub, stage, actions }: { title: string; sub?: string; stage: Stage; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="text-xl font-semibold text-ink-900 [text-wrap:balance]">{title}</h1>
        {sub && <p className="mt-0.5 text-sm text-ink-600">{sub}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <PipelineStrip current={stage} />
        {actions}
      </div>
    </div>
  );
}
