"use client";

import { CalendarDays } from "lucide-react";
import { RANGE_PRESETS, presetRange, type RangePreset } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function DateRange({
  from,
  to,
  onChange,
  className,
}: {
  from: string;
  to: string;
  onChange: (range: { from: string; to: string }) => void;
  className?: string;
}) {
  const active = RANGE_PRESETS.find((p) => {
    const r = presetRange(p.key);
    return r.from === from && r.to === to;
  })?.key;

  return (
    <div className={cn("flex flex-col gap-2 xl:flex-row xl:items-center", className)}>
      <div className="flex flex-wrap gap-1">
        {RANGE_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onChange(presetRange(p.key as RangePreset))}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition",
              active === p.key ? "bg-gold-soft text-gold ring-1 ring-gold/30" : "text-muted hover:bg-elev hover:text-fg"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line bg-card px-3">
        <CalendarDays size={15} className="shrink-0 text-subtle" />
        <input
          type="date"
          value={from}
          max={to || undefined}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="h-10 w-[128px] bg-transparent text-sm outline-none"
          aria-label="Từ ngày"
        />
        <span className="text-subtle">→</span>
        <input
          type="date"
          value={to}
          min={from || undefined}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="h-10 w-[128px] bg-transparent text-sm outline-none"
          aria-label="Đến ngày"
        />
      </div>
    </div>
  );
}
