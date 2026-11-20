"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "h-10 w-full rounded-xl border border-line bg-card px-3 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-gold/60 focus:ring-4 focus:ring-gold/10 disabled:opacity-60";

export function Input({
  icon,
  className,
  wrapperClassName,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode; wrapperClassName?: string }) {
  if (!icon) return <input className={cn(base, className)} {...props} />;
  return (
    <div className={cn("relative", wrapperClassName)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle">{icon}</span>
      <input className={cn(base, "pl-9", className)} {...props} />
    </div>
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(base, "cursor-pointer pr-8", className)} {...props}>
      {children}
    </select>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-down">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] text-subtle">{hint}</span>
      ) : null}
    </label>
  );
}
