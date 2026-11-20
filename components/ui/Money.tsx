import { signed, money } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Số tiền có màu lời / lỗ */
export default function Money({
  value,
  sign = true,
  className,
  muted = false,
}: {
  value: number | null | undefined;
  sign?: boolean;
  className?: string;
  muted?: boolean;
}) {
  const n = Number(value ?? 0);
  return (
    <span
      className={cn(
        "num font-semibold",
        n > 0 ? "text-up" : n < 0 ? "text-down" : muted ? "text-subtle" : "text-muted",
        className
      )}
    >
      {sign ? signed(n) : money(n)}
    </span>
  );
}
