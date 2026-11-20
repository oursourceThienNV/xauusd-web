import { cn } from "@/lib/utils";

export default function Logo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-gold-gradient shadow-[0_8px_24px_-8px_rgba(226,173,70,0.7)]",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.55)_0%,transparent_45%)]" />
      <span className="relative font-bold tracking-tight text-[#2a1c03]" style={{ fontSize: size * 0.42 }}>
        Au
      </span>
    </div>
  );
}
