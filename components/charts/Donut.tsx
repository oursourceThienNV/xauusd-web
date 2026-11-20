import type { ReactNode } from "react";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export default function Donut({
  slices,
  size = 150,
  thickness = 16,
  center,
}: {
  slices: DonutSlice[];
  size?: number;
  thickness?: number;
  center?: ReactNode;
}) {
  const total = slices.reduce((s, x) => s + Math.max(0, x.value), 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--elev)" strokeWidth={thickness} />
        {total > 0 &&
          slices.map((s) => {
            const len = (Math.max(0, s.value) / total) * c;
            const el = (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += len;
            return el;
          })}
      </svg>
      {center && <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{center}</div>}
    </div>
  );
}
