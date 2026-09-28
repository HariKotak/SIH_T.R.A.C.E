/**
 * GujaratMap.tsx
 * ------------------------------------------------------------------
 * A schematic (not to scale) outline of Gujarat with one marker per
 * project, coloured by risk: green = low, orange = medium, red = high.
 * Hover a marker for its name; click it to open the project.
 *
 * No map API is used — the outline is a hand-drawn SVG polygon.
 */
import { useState } from "react";
import { PROJECTS, type Risk } from "../data/mockData";

const MARKER: Record<Risk, string> = { LOW: "#1E8E4E", MEDIUM: "#D9730D", HIGH: "#C8322B" };

// Rough outline: Kutch (NW) → mainland (E) → south coast → Saurashtra peninsula (SW).
const OUTLINE =
  "M40,70 L80,50 L150,45 L200,60 L230,75 L270,70 L300,85 L320,110 L315,150 L330,190 L310,230 L295,270 L270,290 L255,280 L250,250 L245,220 L230,195 L215,190 L205,205 L215,230 L195,250 L160,262 L120,245 L85,215 L65,185 L60,160 L80,140 L120,130 L90,120 L60,120 L30,105 Z";

export default function GujaratMap({ onOpen }: { onOpen: (projectId: string) => void }) {
  const [hover, setHover] = useState<string | null>(null);
  const hovered = PROJECTS.find((p) => p.id === hover);

  return (
    <div className="relative">
      <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="Project locations in Gujarat">
        {/* Sea tint + state outline */}
        <rect width="400" height="300" fill="#EEF3F8" rx="6" />
        <path d={OUTLINE} fill="#FFFFFF" stroke="#B9C6D6" strokeWidth={1.5} strokeLinejoin="round" />

        {/* Region labels (muted) */}
        <text x="70" y="82" fontSize="9" fill="#8793A1" letterSpacing="1.5">KUTCH</text>
        <text x="110" y="205" fontSize="9" fill="#8793A1" letterSpacing="1.5">SAURASHTRA</text>

        {PROJECTS.map((p) => (
          <g
            key={p.id}
            className="cursor-pointer"
            onMouseEnter={() => setHover(p.id)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onOpen(p.id)}
          >
            {/* Pulsing halo on high-risk markers draws the eye */}
            {p.risk === "HIGH" && (
              <circle cx={p.map.x} cy={p.map.y} r={11} fill={MARKER.HIGH} opacity={0.18}>
                <animate attributeName="r" values="8;14;8" dur="2.4s" repeatCount="indefinite" />
              </circle>
            )}
            {/* Large invisible hit target */}
            <circle cx={p.map.x} cy={p.map.y} r={12} fill="transparent" />
            <circle cx={p.map.x} cy={p.map.y} r={hover === p.id ? 7 : 5.5} fill={MARKER[p.risk]} stroke="#fff" strokeWidth={2} />
            <text x={p.map.x + 9} y={p.map.y + 3} fontSize="9" fill="#4A5868">
              {p.city}
            </text>
          </g>
        ))}
      </svg>

      {/* Hover card */}
      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 rounded bg-navy-950 px-3 py-2 text-xs text-white shadow">
          <div className="font-semibold">{hovered.name}</div>
          <div className="text-white/70">
            {hovered.scheme} · Risk {hovered.riskScore}/100 · Click to open
          </div>
        </div>
      )}

      {/* Legend: colour + text, so it never relies on colour alone */}
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-600">
        {(["LOW", "MEDIUM", "HIGH"] as Risk[]).map((r) => (
          <span key={r} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: MARKER[r] }} />
            {r === "LOW" ? "Compliant" : r === "MEDIUM" ? "Watch" : "High risk"}
          </span>
        ))}
        <span className="ml-auto text-ink-400">Schematic, not to scale</span>
      </div>
    </div>
  );
}
