// =========================================================
// Định dạng số / tiền / ngày giờ (vi-VN)
// =========================================================

const nf2 = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nf0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function num(value: number | string | null | undefined, digits = 2): string {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return "0";
  if (digits === 2) return nf2.format(n);
  if (digits === 0) return nf0.format(n);
  return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** 1,234.56 */
export function money(value: number | null | undefined): string {
  return num(value, 2);
}

/** +1,234.56 / -1,234.56 */
export function signed(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  if (n > 0) return `+${nf2.format(n)}`;
  if (n < 0) return `-${nf2.format(Math.abs(n))}`;
  return nf2.format(0);
}

/** Rút gọn: 12.3K, 1.2M */
export function compact(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${nf2.format(abs)}`;
}

export function percent(value: number | null | undefined, digits = 1): string {
  return `${Number(value ?? 0).toFixed(digits)}%`;
}

export function tone(value: number | null | undefined): "up" | "down" | "flat" {
  const n = Number(value ?? 0);
  if (n > 0) return "up";
  if (n < 0) return "down";
  return "flat";
}

// ---------------------------------------------------------
// Ngày giờ
// ---------------------------------------------------------

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dateVN(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function dateTimeVN(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return "—";
  return d.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function timeAgo(value: string | Date | null | undefined): string {
  const d = toDate(value);
  if (!d) return "Chưa có tín hiệu";
  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return "Vừa xong";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day} ngày trước`;
  return dateVN(d);
}

/** yyyy-MM-dd theo giờ máy người dùng */
export function ymd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shortDay(isoDate: string): string {
  const [, m, d] = isoDate.split("-");
  return `${d}/${m}`;
}

export type RangePreset = "today" | "7d" | "30d" | "month" | "lastMonth" | "year";

export const RANGE_PRESETS: { key: RangePreset; label: string }[] = [
  { key: "today", label: "Hôm nay" },
  { key: "7d", label: "7 ngày" },
  { key: "30d", label: "30 ngày" },
  { key: "month", label: "Tháng này" },
  { key: "lastMonth", label: "Tháng trước" },
  { key: "year", label: "Năm nay" },
];

export function presetRange(key: RangePreset): { from: string; to: string } {
  const now = new Date();
  const today = ymd(now);
  switch (key) {
    case "today":
      return { from: today, to: today };
    case "7d":
      return { from: ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)), to: today };
    case "30d":
      return { from: ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)), to: today };
    case "lastMonth":
      return {
        from: ymd(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        to: ymd(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    case "year":
      return { from: ymd(new Date(now.getFullYear(), 0, 1)), to: today };
    case "month":
    default:
      return { from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: today };
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}
