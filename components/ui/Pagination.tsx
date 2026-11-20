"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  page,
  totalPages,
  totalElements,
  size,
  onPage,
  onSize,
  sizes = [10, 20, 50, 100],
  unit = "bản ghi",
  disabled = false,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPage: (page: number) => void;
  onSize?: (size: number) => void;
  sizes?: number[];
  unit?: string;
  disabled?: boolean;
}) {
  const pages: number[] = [];
  if (totalPages > 0) {
    const count = Math.min(5, totalPages);
    let start = Math.max(0, page - 2);
    if (start + count > totalPages) start = totalPages - count;
    for (let i = 0; i < count; i++) pages.push(start + i);
  }
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to = Math.min(totalElements, (page + 1) * size);

  return (
    <div className="flex flex-col gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted">
        {totalElements > 0 ? (
          <>
            Hiển thị <span className="num font-semibold text-fg">{from}</span>–
            <span className="num font-semibold text-fg">{to}</span> / <span className="num">{totalElements}</span> {unit}
          </>
        ) : (
          "Không có dữ liệu"
        )}
      </p>
      <div className="flex items-center gap-1">
        {onSize && (
          <select
            value={size}
            disabled={disabled}
            onChange={(e) => onSize(Number(e.target.value))}
            className="mr-2 h-8 rounded-lg border border-line bg-card px-2 text-xs text-muted outline-none"
          >
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s} / trang
              </option>
            ))}
          </select>
        )}
        <button
          type="button"
          disabled={disabled || page <= 0}
          onClick={() => onPage(page - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-elev disabled:opacity-40"
          aria-label="Trang trước"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            disabled={disabled}
            onClick={() => onPage(p)}
            className={cn(
              "num h-8 min-w-8 rounded-lg px-2.5 text-xs transition",
              p === page ? "bg-gold-gradient font-semibold text-[#1a1204]" : "border border-line text-muted hover:bg-elev"
            )}
          >
            {p + 1}
          </button>
        ))}
        <button
          type="button"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPage(page + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:bg-elev disabled:opacity-40"
          aria-label="Trang sau"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
