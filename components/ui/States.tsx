import { TriangleAlert, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "Chưa có dữ liệu",
  description,
  icon,
  className,
  action,
}: {
  title?: string;
  description?: ReactNode;
  icon?: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-elev text-subtle">
        {icon ?? <Inbox size={22} />}
      </div>
      <p className="text-sm font-semibold text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-xs text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <div className="fade-up mb-4 flex items-start gap-3 rounded-xl border border-down/25 bg-down-soft px-4 py-3 text-sm text-down">
      <TriangleAlert size={17} className="mt-0.5 shrink-0" />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button type="button" onClick={onClose} className="text-xs font-semibold opacity-70 hover:opacity-100">
          Đóng
        </button>
      )}
    </div>
  );
}

export function LoadingRow({ colSpan, text = "Đang tải dữ liệu..." }: { colSpan: number; text?: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14">
        <div className="flex items-center justify-center gap-2 text-sm text-muted">
          <Loader2 size={17} className="animate-spin text-gold" />
          {text}
        </div>
      </td>
    </tr>
  );
}

export function SkeletonRows({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c} className="px-5 py-4">
              <div className="skeleton h-4" style={{ width: `${50 + ((r * 7 + c * 13) % 45)}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
