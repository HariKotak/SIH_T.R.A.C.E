/**
 * Screen 1 — Login / Role selection
 * ------------------------------------------------------------------
 * No real authentication: choosing a role card drops you straight into
 * that role's view. (Aadhaar / SSO login is out of scope for the prototype.)
 */
import { ReactNode } from "react";
import { Building2, ChevronRight, ClipboardList, Landmark } from "lucide-react";
import { Brand } from "../components/Layout";

export type Role = "officer" | "inspector" | "ngo";

export const ROLE_LABEL: Record<Role, string> = {
  officer: "Government Officer",
  inspector: "PMU Inspector",
  ngo: "NGO / Institute",
};

const ROLES: { id: Role; icon: ReactNode; desc: string; lands: string }[] = [
  { id: "officer", icon: <Landmark size={22} />, desc: "Monitor projects, review AI alerts, order surprise inspections.", lands: "Monitoring dashboard" },
  { id: "inspector", icon: <ClipboardList size={22} />, desc: "Receive assignments, verify GPS, capture evidence on site.", lands: "Inspector mobile app" },
  { id: "ngo", icon: <Building2 size={22} />, desc: "Beneficiary help desk: feedback, issue reporting and SOS.", lands: "Beneficiary mobile app" },
];

export default function Login({ onSelect }: { onSelect: (r: Role) => void }) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      {/* Navy band with branding */}
      <div className="bg-navy-950 px-4 pb-24 pt-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <Brand />
          <div className="text-[11px] leading-tight text-white/60 sm:text-right">
            Department of Social Justice &amp; Empowerment
            <br />
            Ministry of Social Justice &amp; Empowerment, Government of India
          </div>
        </div>
      </div>

      {/* Role card pulled up over the band */}
      <main className="mx-auto -mt-16 w-full max-w-5xl px-4 pb-10 md:px-10">
        <div className="card p-6 shadow-sm md:p-8">
          <p className="label">Prototype · Demo sign-in</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900">Select your role</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-600">
            Real-time monitoring and inspection for DoSJE-funded projects. This demo uses mock data; no credentials are required.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelect(r.id)}
                className="group flex flex-col rounded-md border border-surface-line bg-white p-5 text-left transition hover:border-teal-500 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-teal-50 text-teal-700">{r.icon}</span>
                <span className="mt-4 text-base font-semibold text-ink-900">{ROLE_LABEL[r.id]}</span>
                <span className="mt-1 flex-1 text-sm text-ink-600">{r.desc}</span>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-teal-700">
                  Enter {r.lands} <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
                </span>
              </button>
            ))}
          </div>

          <p className="mt-6 border-t border-surface-line pt-4 text-xs text-ink-400">
            Suggested demo path: Government Officer → click the attendance alert → CCTV → Surprise VC → Random inspection → Inspector app.
          </p>
        </div>
      </main>
    </div>
  );
}
