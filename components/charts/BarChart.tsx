"use client";

import { useMemo, useState } from "react";
import { useElementWidth } from "@/hooks/useElementWidth";
import { niceTicks, shortNumber } from "./scale";

export interface BarPoint {
  label: string;
  value: number;
  hint?: string;
  extra?: string;
}

export default function BarChart({
  data,
  height = 220,
  format = (v: number) => v.toFixed(2),
  emptyText = "Chưa có dữ liệu",
}: {
  data: BarPoint[];
  height?: number;
  format?: (v: number) => string;
  emptyText?: string;
}) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { top: 12, right: 8, bottom: 26, left: 48 };
  const w = Math.max(width, 160);
  const innerW = w - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const calc = useMemo(() => {
    if (!data.length) return null;
    const values = data.map((d) => d.value);
    const ticks = niceTicks(Math.min(0, ...values), Math.max(0, ...values), 4);
    const lo = ticks[0];
    const hi = ticks[ticks.length - 1];
    const y = (v: number) => pad.top + innerH - ((v - lo) / (hi - lo || 1)) * innerH;
    const slot = innerW / data.length;
    const bw = Math.max(2, Math.min(26, slot * 0.62));
    return { ticks, y, slot, bw };
  }, [data, innerW, innerH, pad.top]);

  if (!data.length || !calc) {
    return (
      <div ref={ref} className="flex items-center justify-center text-xs text-subtle" style={{ height }}>
        {emptyText}
      </div>
    );
  }

  const zero = calc.y(0);
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 64))));
  const lastTick = Math.floor((data.length - 1) / labelEvery) * labelEvery;
  // luôn hiện nhãn cuối, trừ khi quá sát nhãn trước -> tránh chồng chữ
  const showLabel = (i: number) =>
    (i % labelEvery === 0 && !(i === lastTick && i !== data.length - 1 && data.length - 1 - i < labelEvery * 0.6)) ||
    (i === data.length - 1);

  return (
    <div ref={ref} className="relative w-full select-none" style={{ height }}>
      <svg width={w} height={height} className="block overflow-visible" onMouseLeave={() => setHover(null)}>
        {calc.ticks.map((t) => (
          <g key={t}>
            <line
              x1={pad.left}
              x2={w - pad.right}
              y1={calc.y(t)}
              y2={calc.y(t)}
              stroke={t === 0 ? "var(--line-strong)" : "var(--line)"}
              strokeDasharray={t === 0 ? undefined : "3 4"}
            />
            <text x={pad.left - 8} y={calc.y(t)} dy="0.32em" textAnchor="end" fontSize="10" fill="var(--subtle)" className="num">
              {shortNumber(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = pad.left + calc.slot * i + calc.slot / 2;
          const top = d.value >= 0 ? calc.y(d.value) : zero;
          const h = Math.max(d.value === 0 ? 0 : 1.5, Math.abs(calc.y(d.value) - zero));
          const fill = d.value >= 0 ? "var(--up)" : "var(--down)";
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={pad.left + calc.slot * i} y={pad.top} width={calc.slot} height={innerH} fill="transparent" />
              <rect
                x={cx - calc.bw / 2}
                y={top}
                width={calc.bw}
                height={h}
                rx={Math.min(4, calc.bw / 3)}
                fill={fill}
                opacity={hover === null || hover === i ? 0.9 : 0.35}
              />
              {(showLabel(i)) && (
                <text x={cx} y={height - 6} textAnchor="middle" fontSize="10" fill="var(--subtle)">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute z-10 min-w-[120px] -translate-x-1/2 rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-xl"
          style={{
            left: Math.min(Math.max(pad.left + calc.slot * hover + calc.slot / 2, 70), w - 70),
            top: 0,
          }}
        >
          <p className="text-subtle">{data[hover].hint ?? data[hover].label}</p>
          <p className={`num mt-0.5 text-sm font-semibold ${data[hover].value >= 0 ? "text-up" : "text-down"}`}>
            {format(data[hover].value)}
          </p>
          {data[hover].extra && <p className="mt-0.5 text-[11px] text-muted">{data[hover].extra}</p>}
        </div>
      )}
    </div>
  );
}
