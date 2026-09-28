/**
 * Screen 4a — Random Inspection (Government Officer side)
 * ------------------------------------------------------------------
 * Flow:  PENDING → [Run Random Assignment] → RUNNING (≈2 s shuffle)
 *        → ASSIGNED → [View Inspector App] → … → SUBMITTED
 *
 * The status lives in App.tsx so the officer screen and the inspector
 * app stay in sync (submitting on the phone flips this page to SUBMITTED).
 */
import { useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, Dices, Shuffle, Smartphone } from "lucide-react";
import { ASSIGNED_INSPECTOR, DEMO_PROJECT_ID, INSPECTOR_POOL, PROJECT_BY_ID } from "../data/mockData";
import { RiskBadge, SectionHeader, Spinner, StatusPill } from "../components/ui";
import { PageTitle } from "../components/Layout";

export type InspectionStatus = "PENDING" | "RUNNING" | "ASSIGNED" | "SUBMITTED";

const OTHER_PENDING = [
  { name: "Vayo Senior Citizen Home", city: "Bhavnagar", risk: "HIGH" as const, due: "02 Oct" },
  { name: "Sagar Shelter Home", city: "Jamnagar", risk: "MEDIUM" as const, due: "05 Oct" },
  { name: "Kaushal Skill Hub", city: "Rajkot", risk: "MEDIUM" as const, due: "09 Oct" },
];

export default function Inspections({
  status,
  setStatus,
  onOpenInspectorApp,
}: {
  status: InspectionStatus;
  setStatus: (s: InspectionStatus) => void;
  onOpenInspectorApp: () => void;
}) {
  const project = PROJECT_BY_ID[DEMO_PROJECT_ID];
  const [shuffleName, setShuffleName] = useState(INSPECTOR_POOL[0]);

  // While RUNNING: cycle through inspector names, then settle on the assigned one.
  useEffect(() => {
    if (status !== "RUNNING") return;
    let i = 0;
    const tick = setInterval(() => setShuffleName(INSPECTOR_POOL[i++ % INSPECTOR_POOL.length]), 120);
    const done = setTimeout(() => setStatus("ASSIGNED"), 2000);
    return () => {
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [status, setStatus]);

  return (
    <>
      <PageTitle
        title="Random Inspection"
        sub="Inspectors are assigned by lottery so no institute can predict who will visit or when."
        stage={status === "SUBMITTED" ? "REPORT" : "INSPECT"}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {/* Main card: the demo inspection */}
        <div className="card xl:col-span-2">
          <SectionHeader title="Pending Inspection" action={<StatusPill tone={status === "SUBMITTED" ? "ok" : status === "ASSIGNED" ? "info" : "warn"}>{status === "RUNNING" ? "ASSIGNING" : status}</StatusPill>} />

          <div className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">{project.name}</div>
                <div className="text-sm text-ink-600">{project.city} · {project.scheme}</div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                Risk: <RiskBadge risk={project.risk} />
              </div>
            </div>

            {/* Step 1 — before assignment */}
            {status === "PENDING" && (
              <button onClick={() => setStatus("RUNNING")} className="btn-navy mt-6 w-full py-3 sm:w-auto">
                <Dices size={18} /> Run Random Assignment
              </button>
            )}

            {/* Step 2 — shuffle animation */}
            {status === "RUNNING" && (
              <div className="mt-6 flex items-center gap-4 rounded-md border border-surface-line bg-surface p-4">
                <Spinner size={22} />
                <div>
                  <div className="text-xs text-ink-400">Selecting from 5 eligible inspectors (no conflict of interest, &gt; 50 km from home district)…</div>
                  <div className="mt-1 flex items-center gap-2 font-mono text-lg font-semibold text-navy-900">
                    <Shuffle size={16} /> {shuffleName}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — assignment generated (and later, submitted) */}
            {(status === "ASSIGNED" || status === "SUBMITTED") && (
              <div className="mt-6 rounded-md border border-teal-100 bg-teal-50/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                  <CheckCircle2 size={17} /> {status === "SUBMITTED" ? "INSPECTION REPORT RECEIVED" : "ASSIGNMENT GENERATED"}
                </div>
                <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Field label="Inspector" value={ASSIGNED_INSPECTOR} />
                  <Field label="Inspection Type" value="Surprise Inspection" />
                  <Field label="Status" value={<StatusPill tone={status === "SUBMITTED" ? "ok" : "info"}>{status}</StatusPill>} />
                </dl>
                {status === "SUBMITTED" && (
                  <p className="mt-3 text-sm text-ink-600">
                    Evidence TRC-00184 attached · 1 warning (Food / Nutrition) · Documents pending. Fund tranche kept on hold.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={onOpenInspectorApp} className="btn-primary">
                    <Smartphone size={16} /> View Inspector App
                  </button>
                  {status === "SUBMITTED" && (
                    <button onClick={() => setStatus("PENDING")} className="btn-ghost">Reset demo</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side: other pending inspections (static) */}
        <div className="card">
          <SectionHeader title="Also pending" action={<span className="text-xs text-ink-400">36 more</span>} />
          <ul className="divide-y divide-surface-line">
            {OTHER_PENDING.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-ink-600">{p.city} · due {p.due}</div>
                </div>
                <RiskBadge risk={p.risk} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
