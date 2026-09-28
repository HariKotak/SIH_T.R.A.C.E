/**
 * Charts.tsx
 * ------------------------------------------------------------------
 * Two tiny hand-drawn SVG charts (no chart library needed):
 *   - BarChart  → e.g. inspection completion % per month
 *   - LineChart → e.g. attendance anomalies per month
 *
 * Both are single-series, so no legend box — the card title names the
 * series. Hovering a bar/point shows a tooltip with the exact value.
 */
import { useState } from "react";

// Shared drawing area (SVG units). Padding leaves room for axis labels.
const W = 320;
const H = 160;
const PAD = { top: 16, right: 8, bottom: 22, left: 30 };
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

interface ChartProps {
  labels: string[];
  values: number[];
  max: number; // top of the y-scale
  ticks: number[]; // y-axis tick values to draw
  unit?: string; // appended in the tooltip, e.g. "%"
  color: string; // mark colour (hex)
}

/** Maps a data value to a y pixel inside the chart area. */
const yScale = (v: number, max: number) => PAD.top + innerH - (v / max) * innerH;

/** Horizontal gridlines + y-axis labels, shared by both charts. */
function Grid({ ticks, max }: { ticks: number[]; max: number }) {
  return (
    <>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={yScale(t, max)} y2={yScale(t, max)} stroke="#E1E6EC" strokeWidth={1} />
          <text x={PAD.left - 6} y={yScale(t, max) + 3} textAnchor="end" fontSize={9} fill="#8793A1" className="tabular">
            {t}
          </text>
        </g>
      ))}
    </>
  );
}

/** Small floating tooltip rendered inside the SVG. */
function Tip({ x, y, text }: { x: number; y: number; text: string }) {
  const w = text.length * 6 + 12;
  // Keep the tooltip inside the chart bounds.
  const left = Math.min(Math.max(x - w / 2, 2), W - w - 2);
  return (
    <g pointerEvents="none">
      <rect x={left} y={y - 24} width={w} height={18} rx={3} fill="#0A1628" />
      <text x={left + w / 2} y={y - 12} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={600}>
        {text}
      </text>
    </g>
  );
}

export function BarChart({ labels, values, max, ticks, unit = "", color }: ChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const slot = innerW / values.length; // width available per bar
  const barW = Math.min(22, slot * 0.5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Bar chart">
      <Grid ticks={ticks} max={max} />
      {values.map((v, i) => {
        const cx = PAD.left + slot * i + slot / 2;
        const y = yScale(v, max);
        const h = PAD.top + innerH - y;
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            {/* Invisible, wider hit target so hovering is easy */}
            <rect x={cx - slot / 2} y={PAD.top} width={slot} height={innerH} fill="transparent" />
            {/* Bar with rounded top only: path draws a 3px radius on the data end */}
            <path
              d={`M${cx - barW / 2},${y + h} V${y + 3} Q${cx - barW / 2},${y} ${cx - barW / 2 + 3},${y} H${cx + barW / 2 - 3} Q${cx + barW / 2},${y} ${cx + barW / 2},${y + 3} V${y + h} Z`}
              fill={color}
              opacity={hover === null || hover === i ? 1 : 0.45}
            />
            <text x={cx} y={H - 6} textAnchor="middle" fontSize={9} fill="#8793A1">
              {labels[i]}
            </text>
          </g>
        );
      })}
      {/* Direct label on the latest value only */}
      {hover === null && (
        <text
          x={PAD.left + slot * (values.length - 0.5)}
          y={yScale(values[values.length - 1], max) - 5}
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill="#14202E"
        >
          {values[values.length - 1]}
          {unit}
        </text>
      )}
      {hover !== null && (
        <Tip x={PAD.left + slot * hover + slot / 2} y={yScale(values[hover], max)} text={`${labels[hover]}: ${values[hover]}${unit}`} />
      )}
    </svg>
  );
}

export function LineChart({ labels, values, max, ticks, unit = "", color }: ChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const step = innerW / (values.length - 1);
  const pts = values.map((v, i) => ({ x: PAD.left + step * i, y: yScale(v, max) }));
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" ");
  // Soft area fill under the line, closed down to the baseline.
  const area = `${line} L${pts[pts.length - 1].x},${PAD.top + innerH} L${pts[0].x},${PAD.top + innerH} Z`;
  const last = pts.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Line chart">
      <Grid ticks={ticks} max={max} />
      <path d={area} fill={color} opacity={0.08} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />

      {/* Crosshair on hover */}
      {hover !== null && <line x1={pts[hover].x} x2={pts[hover].x} y1={PAD.top} y2={PAD.top + innerH} stroke="#8793A1" strokeDasharray="3 3" />}

      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <rect x={p.x - step / 2} y={PAD.top} width={step} height={innerH} fill="transparent" />
          {/* Emphasise the endpoint (and the hovered point) with a ringed marker */}
          {(i === last || i === hover) && <circle cx={p.x} cy={p.y} r={4.5} fill={color} stroke="#fff" strokeWidth={2} />}
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize={9} fill="#8793A1">
            {labels[i]}
          </text>
        </g>
      ))}

      {hover === null && (
        <text x={pts[last].x - 8} y={pts[last].y - 9} textAnchor="end" fontSize={10} fontWeight={600} fill="#14202E">
          {values[last]}
          {unit}
        </text>
      )}
      {hover !== null && <Tip x={pts[hover].x} y={pts[hover].y} text={`${labels[hover]}: ${values[hover]}${unit}`} />}
    </svg>
  );
}
