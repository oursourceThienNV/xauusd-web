import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  positive,
  accent = false,
  loading = false,
  footer,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: LucideIcon;
  positive?: boolean;
  accent?: boolean;
  loading?: boolean;
  footer?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "card relative overflow-hidden p-5 transition hover:-translate-y-0.5",
        accent && "gold-ring"
      )}
    >
      {accent && (
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-subtle">{label}</p>
          {loading ? (
            <div className="skeleton mt-3 h-7 w-32" />
          ) : (
            <p className={cn("num mt-2 truncate text-[26px] font-semibold leading-tight", accent ? "text-gold-gradient" : "text-fg")}>
              {value}
            </p>
          )}
          {sub && !loading && (
            <p
              className={cn(
                "mt-1.5 text-xs",
                positive === true ? "text-up" : positive === false ? "text-down" : "text-muted"
              )}
            >
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              accent ? "bg-gold-gradient text-[#1a1204]" : "bg-elev text-muted"
            )}
          >
            <Icon size={19} />
          </div>
        )}
      </div>
      {footer && <div className="relative mt-4">{footer}</div>}
    </div>
  );
}
