import type { LucideIcon } from "lucide-react";

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  positive?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
          {sub && (
            <p
              className={`mt-1 text-xs ${
                positive === true
                  ? "text-emerald-600"
                  : positive === false
                    ? "text-red-500"
                    : "text-slate-400"
              }`}
            >
              {sub}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}
