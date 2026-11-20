"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { pageTitle } from "./nav";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!now) return null;
  return (
    <div className="hidden text-right md:block">
      <p className="num text-sm font-semibold text-fg">
        {now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
      </p>
      <p className="text-[11px] text-subtle">
        {now.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
      </p>
    </div>
  );
}

export default function Header({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { title, parent } = pageTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line bg-bg/80 px-4 backdrop-blur-xl sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:text-fg lg:hidden"
          aria-label="Mở menu"
        >
          <Menu size={18} />
        </button>
        <div className="min-w-0">
          {parent && <p className="truncate text-[11px] font-medium text-subtle">{parent}</p>}
          <h2 className="truncate text-[15px] font-semibold text-fg">{title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[11px] font-semibold tracking-wide text-muted">XAU/USD</span>
        </div>
        <Clock />
        <button
          type="button"
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:border-gold/40 hover:text-gold"
          title={theme === "dark" ? "Chuyển giao diện sáng" : "Chuyển giao diện tối"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
