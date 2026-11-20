import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "up" | "down" | "gold" | "info" | "warn" | "neutral";

const tones: Record<BadgeTone, string> = {
  up: "bg-up-soft text-up",
  down: "bg-down-soft text-down",
  gold: "bg-gold-soft text-gold",
  info: "bg-info-soft text-info",
  warn: "bg-warn-soft text-warn",
  neutral: "bg-elev text-muted",
};

const dots: Record<BadgeTone, string> = {
  up: "bg-up",
  down: "bg-down",
  gold: "bg-gold",
  info: "bg-info",
  warn: "bg-warn",
  neutral: "bg-subtle",
};

export default function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  className,
  children,
}: {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dots[tone], pulse && "pulse-dot")} />}
      {children}
    </span>
  );
}
