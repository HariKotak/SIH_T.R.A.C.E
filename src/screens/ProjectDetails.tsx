/**
 * Screen 3 — Project Details
 * ------------------------------------------------------------------
 * Header facts → 3 key cards (Attendance / CCTV / Funds) → tabs:
 *   Overview · CCTV · Inspections · Evidence
 *
 * The CCTV tab shows simulated camera tiles. Clicking a tile opens it
 * enlarged (CCTV modal). "Start Surprise VC" opens the fake video call.
 * After the call, a banner points to the next demo step: random inspection.
 */
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Camera, FileText, IndianRupee, MapPin, Users, Video } from "lucide-react";
import { DEMO_DETAIL, DEMO_PROJECT_ID, PROJECT_BY_ID } from "../data/mockData";
import { CctvFeed, Modal, RiskBadge, StatusPill } from "../components/ui";
import { PageTitle } from "../components/Layout";
import SurpriseVC from "../components/SurpriseVC";

type Tab = "Overview" | "CCTV" | "Inspections" | "Evidence";
const TABS: Tab[] = ["Overview", "CCTV", "Inspections", "Evidence"];

/**
 * The demo project has hand-written numbers. For any other project we
 * derive plausible numbers from its risk score so every marker opens
 * something sensible.
 */
function detailFor(projectId: string) {
  if (projectId === DEMO_PROJECT_ID) return DEMO_DETAIL;
  const p = PROJECT_BY_ID[projectId];
  const claimed = Math.round(p.beneficiaries * 0.7);
  const detected = Math.round(claimed * (1 - p.riskScore / 250));
  const approved = Math.round(p.beneficiaries / 6);
  return {
    ...DEMO_DETAIL,
    attendance: { claimed, detected, mismatchPct: Math.round(((claimed - detected) / claimed) * 100) },
    cctv: { ...DEMO_DETAIL.cctv, personCount: detected },
    funds: { approved, utilized: +(approved * (p.compliance / 110)).toFixed(1) },
    cameras: DEMO_DETAIL.cameras.map((c, i) => ({ ...c, count: Math.round(detected * [0.55, 0.3, 0.15, 0][i]) })),
  };
}

export default function ProjectDetails({
  projectId,
  onBack,
  onGoInspections,
}: {
  projectId: string;
  onBack: () => void;
  onGoInspections: () => void;
}) {
  const project = PROJECT_BY_ID[projectId];
  const d = detailFor(projectId);

  const [tab, setTab] = useState<Tab>("Overview");
  const [cctvCam, setCctvCam] = useState<(typeof d.cameras)[number] | null>(null); // enlarged camera
  const [vcOpen, setVcOpen] = useState(false);
  const [vcDone, setVcDone] = useState(false); // shows the "next step" banner

  const mismatchTone = d.attendance.mismatchPct >= 20 ? "text-crit" : d.attendance.mismatchPct >= 10 ? "text-warn" : "text-ok";
  const utilPct = Math.round((d.funds.utilized / d.funds.approved) * 100);

  return (
    <>
      <button onClick={onBack} className="mb-3 flex items-center gap-1 text-sm text-teal-700 hover:underline">
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <PageTitle
        title={project.name}
        stage={tab === "CCTV" || vcOpen ? "VERIFY" : "DETECT"}
        actions={
          <button onClick={() => setVcOpen(true)} className="btn-navy">
            <Video size={16} /> Start Surprise VC
          </button>
        }
      />

      {/* Fact strip */}
      <div className="card mb-4 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-5">
        <Fact label="Scheme" value={<span className="font-mono">{project.scheme}</span>} />
        <Fact label="Location" value={<span className="flex items-center gap-1"><MapPin size={13} /> {project.city}, {project.state}</span>} />
        <Fact label="Beneficiaries" value={<span className="font-mono tabular">{project.beneficiaries}</span>} />
        <Fact label="Risk Score" value={<span className="flex items-center gap-2"><span className="font-mono tabular">{project.riskScore}/100</span><RiskBadge risk={project.risk} /></span>} />
        <Fact label="Compliance" value={<span className="font-mono tabular">{project.compliance}%</span>} />
      </div>

      {/* Banner after the VC — guides the demo forward */}
      {vcDone && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-teal-100 bg-teal-50 px-4 py-3">
          <div className="text-sm text-teal-700">
            <span className="font-semibold">Surprise VC recorded.</span> Attendance mismatch still unresolved; a physical inspection is recommended.
          </div>
          <button onClick={onGoInspections} className="btn-primary">
            Order random inspection <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Three key cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="label flex items-center gap-1.5"><Users size={13} /> Attendance</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Claimed" value={d.attendance.claimed} />
            <Stat label="AI Detected" value={d.attendance.detected} />
            <Stat label="Mismatch" value={`${d.attendance.mismatchPct}%`} className={mismatchTone} />
          </div>
        </div>

        <button onClick={() => setTab("CCTV")} className="card p-4 text-left transition hover:border-teal-500">
          <div className="label flex items-center gap-1.5"><Camera size={13} /> CCTV Status</div>
          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-2xl font-semibold text-ok">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-ok" /> {d.cctv.status}
            </span>
          </div>
          <div className="mt-1 text-xs text-ink-600">Last checked: {d.cctv.lastChecked} · 4 cameras · view feeds →</div>
        </button>

        <div className="card p-4">
          <div className="label flex items-center gap-1.5"><IndianRupee size={13} /> Fund Utilization</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Approved" value={`₹${d.funds.approved} L`} />
            <Stat label="Utilized" value={`₹${d.funds.utilized} L`} />
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-surface">
            <div className="h-1.5 rounded-full bg-teal-500" style={{ width: `${utilPct}%` }} />
          </div>
          <div className="mt-1 text-xs text-ink-600 tabular">{utilPct}% utilised</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card mt-4">
        <div className="flex gap-1 overflow-x-auto border-b border-surface-line px-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm ${
                tab === t ? "border-teal-600 font-semibold text-teal-700" : "border-transparent text-ink-600 hover:text-ink-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "Overview" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold">Why this project is flagged</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-600">
                  <li>AI head-count on CCTV is {d.attendance.mismatchPct}% below the attendance claimed in the monthly return.</li>
                  <li>Same mismatch pattern seen in 3 of the last 4 weeks.</li>
                  <li>Nutrition supply invoices are above the district median rate.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Recommended actions</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-600">
                  <li>Review live CCTV and run a surprise video call.</li>
                  <li>Order a random physical inspection.</li>
                  <li>Hold the next fund tranche until the inspection report is filed.</li>
                </ol>
              </div>
            </div>
          )}

          {tab === "CCTV" && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-ink-600">
                  Total AI person count across cameras: <span className="font-mono font-semibold text-ink-900">{d.cctv.personCount}</span>
                </div>
                <button onClick={() => setVcOpen(true)} className="btn-navy">
                  <Video size={16} /> Start Surprise VC
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {d.cameras.map((c) => (
                  <button key={c.id} onClick={() => setCctvCam(c)} className="rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500" aria-label={`Open ${c.name}`}>
                    <CctvFeed camId={c.id} camName={c.name} count={c.count} />
                  </button>
                ))}
              </div>
            </>
          )}

          {tab === "Inspections" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-ink-400">
                  <tr><th className="py-2 pr-4 font-semibold">Date</th><th className="py-2 pr-4 font-semibold">Inspector</th><th className="py-2 pr-4 font-semibold">Type</th><th className="py-2 font-semibold">Result</th></tr>
                </thead>
                <tbody>
                  {d.pastInspections.map((i) => (
                    <tr key={i.date} className="border-t border-surface-line">
                      <td className="py-2 pr-4 tabular">{i.date}</td>
                      <td className="py-2 pr-4">{i.inspector}</td>
                      <td className="py-2 pr-4">{i.type}</td>
                      <td className="py-2"><StatusPill tone={i.result === "Satisfactory" ? "ok" : "warn"}>{i.result}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={onGoInspections} className="btn-primary mt-4">Order random inspection <ArrowRight size={15} /></button>
            </div>
          )}

          {tab === "Evidence" && (
            <div className="grid gap-3 sm:grid-cols-3">
              {d.evidence.map((e) => (
                <div key={e.id} className="rounded-md border border-surface-line p-3">
                  <div className="flex aspect-[4/3] items-center justify-center rounded bg-surface text-ink-400">
                    {e.kind === "Photo" ? <Camera size={26} /> : <FileText size={26} />}
                  </div>
                  <div className="mt-2 font-mono text-xs font-semibold">{e.id}</div>
                  <div className="text-xs text-ink-600">{e.note}</div>
                  <div className="mt-1 text-[11px] text-ink-400">{e.date} · GPS & time stamped</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CCTV modal — one camera, enlarged */}
      <Modal open={cctvCam !== null} onClose={() => setCctvCam(null)} title={`LIVE CCTV · ${project.name}`} dark wide>
        {cctvCam && (
          <div className="p-4">
            <CctvFeed camId={cctvCam.id} camName={cctvCam.name} count={cctvCam.count} large />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-white/70">
                AI PERSON COUNT: <span className="font-mono font-semibold text-white">{cctvCam.count}</span> in this frame · {d.cctv.personCount} across all cameras
              </span>
              <button onClick={() => { setCctvCam(null); setVcOpen(true); }} className="btn-primary">
                <Video size={16} /> Start Surprise VC
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Surprise VC modal */}
      <Modal open={vcOpen} onClose={() => { setVcOpen(false); setVcDone(true); }} title="Surprise Video Call" dark wide>
        <SurpriseVC institute={project.name} onEnd={() => { setVcOpen(false); setVcDone(true); }} />
      </Modal>
    </>
  );
}

/* ------------------------------- Helpers ----------------------------- */

function Fact({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink-900">{value}</div>
    </div>
  );
}

function Stat({ label, value, className = "text-navy-950" }: { label: string; value: string | number; className?: string }) {
  return (
    <div>
      <div className="text-[11px] text-ink-400">{label}</div>
      <div className={`font-mono text-xl font-semibold tabular ${className}`}>{value}</div>
    </div>
  );
}
