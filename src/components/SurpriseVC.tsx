/**
 * SurpriseVC.tsx
 * ------------------------------------------------------------------
 * A fake video-call panel shown inside a modal. It simulates:
 *   1. "Calling…" for ~2 seconds
 *   2. "Connected" with a running call timer, remote tile, self-view
 *      and working mute / camera toggles
 *
 * No WebRTC — this is purely visual.
 */
import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, ShieldCheck, Video, VideoOff } from "lucide-react";
import { Spinner } from "./ui";

export default function SurpriseVC({ institute, onEnd }: { institute: string; onEnd: () => void }) {
  const [connected, setConnected] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);

  // Step 1: pretend to ring for 2 s, then "connect".
  useEffect(() => {
    const t = setTimeout(() => setConnected(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Step 2: once connected, tick the call timer every second.
  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="p-4">
      {/* Remote participant tile */}
      <div className="cctv-feed relative flex aspect-video items-center justify-center overflow-hidden rounded-md">
        {!connected ? (
          <div className="flex flex-col items-center gap-3 text-white/80">
            <Spinner size={28} />
            <div className="text-sm">Calling {institute}…</div>
            <div className="text-xs text-white/50">Unannounced call · institute has 60 s to answer</div>
          </div>
        ) : (
          <>
            {/* Placeholder person silhouette */}
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-white/15" />
              <div className="mt-1 h-24 w-40 rounded-t-full bg-white/10" />
            </div>
            <div className="absolute bottom-3 left-3 rounded bg-navy-950/85 px-2 py-1 text-xs">
              Mr. S. Joshi · Warden, {institute}
            </div>
            <div className="absolute left-3 top-3 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 rounded bg-crit px-1.5 py-0.5 font-bold">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> REC
              </span>
              <span className="font-mono tabular text-white/80">{mmss}</span>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded bg-ok/90 px-2 py-0.5 text-[11px] font-semibold">
              <ShieldCheck size={12} /> Location matches registered site
            </div>
          </>
        )}

        {/* Self-view (officer) */}
        <div className="absolute bottom-3 right-3 flex h-20 w-32 items-center justify-center rounded border border-white/20 bg-navy-800 text-[10px] text-white/60">
          {camOff ? "Camera off" : "You · District Officer"}
        </div>
      </div>

      {/* Call controls */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => setMuted((m) => !m)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button
          onClick={() => setCamOff((c) => !c)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          aria-label={camOff ? "Turn camera on" : "Turn camera off"}
        >
          {camOff ? <VideoOff size={18} /> : <Video size={18} />}
        </button>
        <button onClick={onEnd} className="flex h-11 items-center gap-2 rounded-full bg-crit px-5 text-sm font-semibold hover:brightness-95">
          <PhoneOff size={18} /> End call
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-white/50">
        Simulated call. The recording is attached to the project's evidence log when the call ends.
      </p>
    </div>
  );
}
