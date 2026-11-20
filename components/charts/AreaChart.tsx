"use client";

import { useId, useMemo, useState } from "react";
import { useElementWidth } from "@/hooks/useElementWidth";
import { niceTicks, shortNumber } from "./scale";

export interface SeriesPoint {
  label: string;
  value: number;
  hint?: string;
}

export default function AreaChart({
  data,
  height = 240,
  format = (v: number) => v.toFixed(2),
  color = "var(--gold)",
  emptyText = "Chưa có dữ liệu",
}: {
  data: SeriesPoint[];
  height?: number;
  format?: (v: number) => string;
  color?: string;
  emptyText?: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const gid = useId().replace(/:/g, "");

  const pad = { top: 16, right: 12, bottom: 26, left: 48 };
  const w = Math.max(width, 160);
  const innerW = w - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const calc = useMemo(() => {
    if (!data.length) return null;
    const values = data.map((d) => d.value);
    const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), 4);
    const lo = ticks[0];
    const hi = ticks[ticks.length - 1];
    const x = (i: number) => pad.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = (v: number) => pad.top + innerH - ((v - lo) / (hi - lo || 1)) * innerH;
    const pts = data.map((d, i) => [x(i), y(d.value)] as const);
    let line = "";
    pts.forEach(([px, py], i) => {
      if (i === 0) {
        line = `M${px},${py}`;
        return;
      }
      const [qx, qy] = pts[i - 1];
      const cx = (qx + px) / 2;
      line += ` C${cx},${qy} ${cx},${py} ${px},${py}`;
    });
    const area = `${line} L${pts[pts.length - 1][0]},${y(lo)} L${pts[0][0]},${y(lo)} Z`;
    return { ticks, x, y, pts, line, area, zero: y(0) };
  }, [data, innerW, innerH, pad.left, pad.top]);

  if (!data.length || !calc) {
    return (
      <div ref={ref} className="flex items-center justify-center text-xs text-subtle" style={{ height }}>
        {emptyText}
      </div>
    );
  }

  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 70))));
  const lastTick = Math.floor((data.length - 1) / labelEvery) * labelEvery;
  // luôn hiện nhãn cuối, trừ khi quá sát nhãn trước -> tránh chồng chữ
  const showLabel = (i: number) =>
    (i % labelEvery === 0 && !(i === lastTick && i !== data.length - 1 && data.length - 1 - i < labelEvery * 0.6)) ||
    (i === data.length - 1);
  const hp = hover !== null ? calc.pts[hover] : null;

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      <svg
        width={w}
        height={height}
        className="block overflow-visible"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const mx = e.clientX - rect.left - pad.left;
          const idx = data.length === 1 ? 0 : Math.round((mx / innerW) * (data.length - 1));
          setHover(Math.max(0, Math.min(data.length - 1, idx)));
        }}
      >
        <defs>
          <linearGradient id={`area-${gid}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {calc.ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={w - pad.right}
              y1={calc.y(t)}
              y2={calc.y(t)}
              stroke="var(--line)"
              strokeDasharray={t === 0 ? undefined : "3 4"}
            />
            <text x={pad.left - 8} y={calc.y(t)} dy="0.32em" textAnchor="end" fontSize="10" fill="var(--subtle)" className="num">
              {shortNumber(t)}
            </text>
          </g>
        ))}
        <path d={calc.area} fill={`url(#area-${gid})`} />
        <path d={calc.line} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" pathLength={1} className="draw-line" />
        {data.map((d, i) =>
          showLabel(i) ? (
            <text key={i} x={calc.x(i)} y={height - 6} textAnchor="middle" fontSize="10" fill="var(--subtle)">
              {d.label}
            </text>
          ) : null
        )}
        {hp && (
          <g>
            <line x1={hp[0]} x2={hp[0]} y1={pad.top} y2={pad.top + innerH} stroke="var(--line-strong)" />
            <circle cx={hp[0]} cy={hp[1]} r="5" fill="var(--card)" stroke={color} strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {hover !== null && hp && (
        <div
          className="pointer-events-none absolute z-10 min-w-[120px] -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-xl"
          style={{ left: Math.min(Math.max(hp[0], 70), w - 70), top: hp[1] - 10 }}
        >
          <p className="text-subtle">{data[hover].hint ?? data[hover].label}</p>
          <p className="num mt-0.5 text-sm font-semibold text-fg">{format(data[hover].value)}</p>
        </div>
      )}
    </div>
  );
}
