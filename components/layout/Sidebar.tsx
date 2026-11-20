"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useSession } from "@/components/providers/SessionProvider";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { NAV } from "./nav";

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useSession();
  const initials = (user?.fullname || user?.username || "AD")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] shrink-0 flex-col border-r border-white/[0.06] bg-sidebar text-[#c9cfdb] transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top_left,rgba(229,181,85,0.14),transparent_65%)]" />

        <div className="relative flex items-center justify-between px-5 pb-6 pt-6">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <Logo size={40} />
            <div>
              <p className="text-[17px] font-bold tracking-[0.08em] text-white">XAUUSD</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#e5b555]/80">Gold Admin</p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#8b93a5] hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Đóng menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 pb-6">
          {NAV.map((group) => (
            <div key={group.title}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5d6679]">
                {group.title}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                        active
                          ? "bg-gradient-to-r from-[#e5b555]/[0.16] to-transparent text-white"
                          : "text-[#9aa3b5] hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      {active && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gold-gradient" />}
                      <Icon size={18} className={active ? "text-[#e5b555]" : "text-[#6b7487] group-hover:text-[#c9cfdb]"} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative m-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2a2f3b] to-[#151922] text-xs font-bold text-[#e5b555] ring-1 ring-[#e5b555]/30">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.fullname || user?.username || "—"}</p>
              <p className="truncate text-[11px] text-[#8b93a5]">{user?.roleName || "Quản trị"}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Đăng xuất"
              className="rounded-lg p-2 text-[#8b93a5] transition hover:bg-white/5 hover:text-[#fb7185]"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
