/**
 * Screen 4b — Inspector Mobile App
 * ------------------------------------------------------------------
 * A step machine rendered inside a phone frame:
 *
 *   home ─▶ gps ─▶ camera ─▶ checklist ─▶ done
 *
 *   home      "Today's Inspection" + START INSPECTION
 *   gps       simulated GPS lock (1.5 s) → VERIFIED + timestamp
 *   camera    fake viewfinder → shutter → evidence preview with metadata
 *   checklist tap an item to cycle ✓ / ⚠ / ○ → SUBMIT INSPECTION
 *   done      "Inspection Submitted Successfully"
 *
 * `onSubmit` tells App.tsx the inspection is complete, so the officer's
 * Inspections page shows SUBMITTED.
 */
import { useEffect, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowLeft, Camera, CheckCircle2, Circle, Clock, MapPin, Navigation, ShieldCheck } from "lucide-react";
import { ASSIGNED_INSPECTOR, DEMO_PROJECT_ID, EVIDENCE_ID, INITIAL_CHECKLIST, PROJECT_BY_ID, type CheckState } from "../data/mockData";
import { PhoneFrame, Spinner, StatusPill } from "../components/ui";
import { PipelineStrip } from "../components/Layout";

type Step = "home" | "gps" | "camera" | "checklist" | "done";

/** Next state when an inspector taps a checklist row. */
const NEXT_STATE: Record<CheckState, CheckState> = { todo: "done", done: "warn", warn: "todo" };

export default function InspectorApp({ onSubmit, onExit }: { onSubmit: () => void; onExit?: () => void }) {
  const project = PROJECT_BY_ID[DEMO_PROJECT_ID];

  const [step, setStep] = useState<Step>("home");
  const [gpsLocked, setGpsLocked] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [captured, setCaptured] = useState(false);
  const [flash, setFlash] = useState(false); // brief white "shutter" flash
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  // Simulate acquiring a GPS fix when the GPS step opens.
  useEffect(() => {
    if (step !== "gps") return;
    setGpsLocked(false);
    const t = setTimeout(() => {
      setGpsLocked(true);
      setTimestamp(new Date().toLocaleTimeString("en-GB", { hour12: false })); // e.g. 14:42:31
    }, 1500);
    return () => clearTimeout(t);
  }, [step]);

  /** Take the (fake) photo: flash for 250 ms, then show the evidence metadata. */
  const capture = () => {
    setFlash(true);
    setCaptured(true);
    setTimeout(() => setFlash(false), 250);
  };

  const toggleItem = (i: number) =>
    setChecklist((list) => list.map((c, idx) => (idx === i ? { ...c, state: NEXT_STATE[c.state] } : c)));

  const submit = () => {
    setStep("done");
    onSubmit();
  };

  const restart = () => {
    setStep("home");
    setCaptured(false);
    setChecklist(INITIAL_CHECKLIST);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {onExit && (
        <div className="flex w-full max-w-[360px] items-center justify-between">
          <button onClick={onExit} className="flex items-center gap-1 text-sm text-teal-700 hover:underline">
            <ArrowLeft size={15} /> Back to officer view
          </button>
        </div>
      )}
      <PipelineStrip current={step === "done" ? "REPORT" : step === "home" ? "INSPECT" : "VERIFY"} />

      <PhoneFrame>
        {/* App bar */}
        <div className="flex items-center justify-between bg-navy-900 px-4 py-3 text-white">
          <div className="font-mono text-sm font-semibold tracking-[0.15em]">T.R.A.C.E.</div>
          <div className="text-[11px] text-white/70">Inspector · {ASSIGNED_INSPECTOR}</div>
        </div>

        <div className="p-4">
          {/* ---------- HOME ---------- */}
          {step === "home" && (
            <>
              <div className="label">Today's Inspection</div>
              <div className="card mt-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-base font-semibold">{project.name}</div>
                  <StatusPill tone="info">ASSIGNED</StatusPill>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-ink-600">
                  <MapPin size={12} /> {project.city}, {project.state}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded bg-surface p-2"><span className="text-ink-400">Type</span><br /><b>Surprise</b></div>
                  <div className="rounded bg-surface p-2"><span className="text-ink-400">Scheme</span><br /><b>{project.scheme}</b></div>
                </div>
                <p className="mt-3 text-xs text-ink-600">Focus: verify headcount (claimed 86, CCTV shows 54) and nutrition stock.</p>
              </div>
              <button onClick={() => setStep("gps")} className="btn-primary mt-4 w-full py-3 text-base">
                <Navigation size={18} /> START INSPECTION
              </button>
            </>
          )}

          {/* ---------- GPS ---------- */}
          {step === "gps" && (
            <>
              <div className="label">Step 1 of 3 · Location check</div>
              <div className="card mt-2 flex flex-col items-center p-6 text-center">
                {!gpsLocked ? (
                  <>
                    <div className="text-teal-600"><Spinner size={36} /></div>
                    <div className="mt-3 text-sm font-semibold">Acquiring GPS…</div>
                    <div className="text-xs text-ink-400">Matching with registered site boundary</div>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok"><MapPin size={28} /></div>
                    <div className="label mt-3">GPS Location</div>
                    <div className="text-xl font-semibold text-ok">VERIFIED</div>
                    <div className="mt-1 font-mono text-[11px] text-ink-600">23.0225° N, 72.5714° E · ±6 m · 18 m from site</div>
                    <div className="mt-4 w-full border-t border-surface-line pt-3">
                      <div className="label">Timestamp</div>
                      <div className="font-mono text-2xl font-semibold tabular">{timestamp}</div>
                    </div>
                  </>
                )}
              </div>
              <button disabled={!gpsLocked} onClick={() => setStep("camera")} className="btn-primary mt-4 w-full py-3 text-base">
                <Camera size={18} /> CAPTURE EVIDENCE
              </button>
            </>
          )}

          {/* ---------- CAMERA / EVIDENCE ---------- */}
          {step === "camera" && (
            <>
              <div className="label">Step 2 of 3 · Evidence</div>
              {/* Fake viewfinder */}
              <div className="cctv-feed relative mt-2 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-md">
                {/* Framing guides */}
                <div className="absolute inset-6 rounded border border-dashed border-white/30" />
                <div className="flex flex-col items-center text-white/40">
                  <div className="h-10 w-24 rounded-t-md bg-white/10" />
                  <div className="h-16 w-36 bg-white/10" />
                  <div className="mt-1 text-[10px]">Dining hall · meal service</div>
                </div>
                {/* Watermark burned into every evidence photo */}
                <div className="absolute bottom-2 left-2 right-2 rounded bg-navy-950/80 p-2 font-mono text-[10px] leading-relaxed text-white">
                  {EVIDENCE_ID} · {timestamp}
                  <br />
                  23.0225N 72.5714E · {ASSIGNED_INSPECTOR}
                </div>
                {flash && <div className="absolute inset-0 bg-white/70" aria-hidden />}
              </div>

              {!captured ? (
                <button onClick={capture} className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-navy-900 bg-white hover:bg-surface" aria-label="Take photo">
                  <Camera size={24} className="text-navy-900" />
                </button>
              ) : (
                <>
                  {/* Evidence metadata */}
                  <div className="card mt-3 divide-y divide-surface-line text-sm">
                    <Row icon={<MapPin size={14} />} label="GPS" value={<StatusPill tone="ok">VERIFIED</StatusPill>} />
                    <Row icon={<Clock size={14} />} label="Timestamp" value={<StatusPill tone="ok">VERIFIED</StatusPill>} />
                    <Row icon={<ShieldCheck size={14} />} label="Evidence ID" value={<span className="font-mono font-semibold">{EVIDENCE_ID}</span>} />
                  </div>
                  <button onClick={() => setStep("checklist")} className="btn-primary mt-4 w-full py-3 text-base">
                    Continue to checklist
                  </button>
                </>
              )}
            </>
          )}

          {/* ---------- CHECKLIST ---------- */}
          {step === "checklist" && (
            <>
              <div className="label">Step 3 of 3 · Checklist</div>
              <p className="mt-1 text-xs text-ink-400">Tap an item to change its status.</p>
              <ul className="card mt-2 divide-y divide-surface-line">
                {checklist.map((c, i) => (
                  <li key={c.item}>
                    <button onClick={() => toggleItem(i)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-surface">
                      <span className="text-sm font-medium">{c.item}</span>
                      <CheckIcon state={c.state} />
                    </button>
                  </li>
                ))}
              </ul>
              <label htmlFor="remarks" className="label mt-4 block">Remarks</label>
              <textarea
                id="remarks"
                rows={3}
                defaultValue="Headcount at 14:40 was 55. Dry ration stock lower than register entry."
                className="mt-1 w-full rounded-md border border-surface-line bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button onClick={submit} className="btn-navy mt-4 w-full py-3 text-base">
                SUBMIT INSPECTION
              </button>
            </>
          )}

          {/* ---------- DONE ---------- */}
          {step === "done" && (
            <div className="flex flex-col items-center pt-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ok/10 text-ok">
                <CheckCircle2 size={44} />
              </div>
              <div className="mt-4 text-lg font-semibold">Inspection Submitted Successfully</div>
              <p className="mt-1 text-sm text-ink-600">Report sent to the District Officer with evidence {EVIDENCE_ID}.</p>
              <div className="card mt-6 w-full p-3 text-left text-xs text-ink-600">
                <div className="flex justify-between"><span>Checklist</span><span className="font-semibold text-ink-900">{checklist.filter((c) => c.state === "done").length}/{checklist.length} passed</span></div>
                <div className="mt-1 flex justify-between"><span>Warnings</span><span className="font-semibold text-warn">{checklist.filter((c) => c.state === "warn").length}</span></div>
              </div>
              <button onClick={restart} className="btn-ghost mt-6">Start over</button>
            </div>
          )}
        </div>
      </PhoneFrame>
    </div>
  );
}

/* ------------------------------- Helpers ----------------------------- */

function Row({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <span className="flex items-center gap-2 text-ink-600">{icon} {label}</span>
      {value}
    </div>
  );
}

/** ✓ done (green) · ⚠ warning (orange) · ○ not checked (grey) — icon + word, not colour alone. */
function CheckIcon({ state }: { state: CheckState }) {
  if (state === "done") return <span className="flex items-center gap-1 text-xs font-semibold text-ok"><CheckCircle2 size={18} /> OK</span>;
  if (state === "warn") return <span className="flex items-center gap-1 text-xs font-semibold text-warn"><AlertTriangle size={18} /> Issue</span>;
  return <span className="flex items-center gap-1 text-xs font-semibold text-ink-400"><Circle size={18} /> Pending</span>;
}
