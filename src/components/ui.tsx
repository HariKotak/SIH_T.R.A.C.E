/**
 * ui.tsx
 * ------------------------------------------------------------------
 * Small, reusable presentational building blocks:
 *   - RiskBadge / StatusPill  → coloured status labels (always icon + text,
 *                                never colour alone)
 *   - SectionHeader           → title row used on every card
 *   - Modal                   → simple overlay dialog
 *   - PhoneFrame              → mobile mock-up wrapper for the two mobile apps
 *   - CctvFeed                → simulated live camera tile with fake AI boxes
 *   - Spinner                 → loading indicator
 */
import { ReactNode, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, X } from "lucide-react";
import type { Risk } from "../data/mockData";

/* --------------------------- Status badges --------------------------- */

const RISK_STYLE: Record<Risk, string> = {
  HIGH: "bg-crit/10 text-crit border-crit/30",
  MEDIUM: "bg-warn/10 text-warn border-warn/30",
  LOW: "bg-ok/10 text-ok border-ok/30",
};

/** Risk label, e.g. "● HIGH". Used on alerts, tables and project headers. */
export function RiskBadge({ risk }: { risk: Risk }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-semibold tracking-wide ${RISK_STYLE[risk]}`}>
      <CircleDot size={11} aria-hidden />
      {risk}
    </span>
  );
}

type Tone = "ok" | "warn" | "crit" | "info";
const TONE_STYLE: Record<Tone, string> = {
  ok: "bg-ok/10 text-ok",
  warn: "bg-warn/10 text-warn",
  crit: "bg-crit/10 text-crit",
  info: "bg-teal-50 text-teal-700",
};
const TONE_ICON: Record<Tone, ReactNode> = {
  ok: <CheckCircle2 size={13} aria-hidden />,
  warn: <AlertTriangle size={13} aria-hidden />,
  crit: <AlertTriangle size={13} aria-hidden />,
  info: <CircleDot size={13} aria-hidden />,
};

/** Generic status pill, e.g. "✓ VERIFIED" or "ASSIGNED". */
export function StatusPill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${TONE_STYLE[tone]}`}>
      {TONE_ICON[tone]}
      {children}
    </span>
  );
}

/* --------------------------- Section header -------------------------- */

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-surface-line px-4 py-3">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      {action}
    </div>
  );
}

/* -------------------------------- Modal ------------------------------ */

/**
 * Minimal modal. Closes on backdrop click or Escape.
 * `dark` gives the navy video-call look used by CCTV / Surprise VC.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  dark = false,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  dark?: boolean;
  wide?: boolean;
}) {
  // Close with the Escape key while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        // Stop clicks inside the panel from reaching the backdrop.
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "max-w-4xl" : "max-w-lg"} max-h-[92vh] overflow-auto rounded-lg shadow-2xl ${
          dark ? "bg-navy-950 text-white" : "bg-white"
        }`}
      >
        <div className={`flex items-center justify-between px-5 py-3 border-b ${dark ? "border-white/10" : "border-surface-line"}`}>
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className={`rounded p-1 ${dark ? "hover:bg-white/10" : "hover:bg-surface"}`}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- Phone frame --------------------------- */

/** Wraps content in a phone-shaped frame so mobile screens read as an app. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[2.2rem] border-[10px] border-navy-950 bg-navy-950 shadow-xl">
      {/* Status bar */}
      <div className="flex items-center justify-between rounded-t-[1.6rem] bg-navy-900 px-5 pt-2 pb-1 text-[10px] font-medium text-white/80">
        <span className="tabular">{useClock().slice(0, 5)}</span>
        <span className="h-4 w-16 rounded-full bg-navy-950" aria-hidden />
        <span>4G · 82%</span>
      </div>
      <div className="h-[620px] overflow-y-auto rounded-b-[1.6rem] bg-surface">{children}</div>
    </div>
  );
}

/* ------------------------------ Clock hook --------------------------- */

/** Returns the current time as "HH:MM:SS", updating every second. */
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now.toLocaleTimeString("en-GB", { hour12: false });
}

/* ------------------------------ CCTV feed ---------------------------- */

/**
 * A simulated camera feed. Draws `count` fake "person" detection boxes
 * (up to a visual cap) at deterministic positions, plus the LIVE badge,
 * camera label, running clock and AI person count overlay.
 */
export function CctvFeed({
  camId,
  camName,
  count,
  large = false,
}: {
  camId: string;
  camName: string;
  count: number;
  large?: boolean;
}) {
  const time = useClock();
  const offline = count === 0;
  // Draw at most 14 boxes so the tile stays readable; the overlay shows the real number.
  const boxes = Array.from({ length: Math.min(count, large ? 14 : 8) }, (_, i) => ({
    // Pseudo-random but stable positions derived from the index.
    left: 6 + ((i * 37) % 82),
    top: 30 + ((i * 23) % 45),
    h: 16 + ((i * 7) % 10),
  }));

  return (
    <div className={`cctv-feed relative w-full overflow-hidden rounded-md ${large ? "aspect-video" : "aspect-[16/10]"}`}>
      {/* Detection boxes */}
      {!offline &&
        boxes.map((b, i) => (
          <div
            key={i}
            className="absolute border border-teal-500/80"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.h * 0.45}%`, height: `${b.h}%` }}
          >
            {large && <span className="absolute -top-3.5 left-0 font-mono text-[9px] text-teal-100">P{i + 1}</span>}
          </div>
        ))}

      {offline && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/50">
          NO PERSONS IN FRAME
        </div>
      )}

      {/* Top-left: LIVE + camera */}
      <div className="absolute left-2 top-2 flex items-center gap-2">
        <span className="flex items-center gap-1 rounded bg-crit px-1.5 py-0.5 text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
        </span>
        <span className="font-mono text-[10px] text-white/80">
          {camId} · {camName}
        </span>
      </div>

      {/* Top-right: clock */}
      <span className="absolute right-2 top-2 font-mono text-[10px] text-white/70 tabular">{time}</span>

      {/* Bottom-left: AI count */}
      <div className="absolute bottom-2 left-2 rounded bg-navy-950/85 px-2 py-1 font-mono text-[11px] text-teal-100">
        AI PERSON COUNT: <span className="font-semibold text-white">{count}</span>
      </div>
    </div>
  );
}

/* ------------------------------- Spinner ----------------------------- */

export function Spinner({ size = 18 }: { size?: number }) {
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Loading"
    />
  );
}
