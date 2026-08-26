"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  List,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý",
    icon: ShieldCheck,
    children: [
      { title: "Tài khoản", href: "/accounts" },
    ],
  },
  {
    title: "Báo cáo",
    icon: BarChart3,
    children: [
      { title: "Báo cáo thống kê", href: "/reports" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>(["Quản lý", "Báo cáo"]);

  const toggleMenu = (title: string) =>
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-800 bg-[#08111f] text-white">
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/15 ring-1 ring-blue-400/20">
            <CircleDollarSign className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide">XAUUSD</h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Forex Administration
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-5">
        <p className="px-6 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>

        {menus.map((menu) => {
          const Icon = menu.icon;

          if (!menu.children) {
            const active = pathname === menu.href;
            return (
              <Link
                key={menu.title}
                href={menu.href!}
                className={`mx-3 mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-300 hover:bg-slate-800/80"
                }`}
              >
                <Icon size={18} />
                {menu.title}
              </Link>
            );
          }

          const opened = openMenus.includes(menu.title);
          return (
            <div key={menu.title} className="mb-2">
              <button
                type="button"
                onClick={() => toggleMenu(menu.title)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm text-slate-400 transition hover:text-white"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {menu.title}
                </span>
                {opened ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {opened && (
                <div className="space-y-1 px-3">
                  {menu.children.map((child) => {
                    const active =
                      pathname === child.href ||
                      pathname.startsWith(`${child.href}/`);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition ${
                          active
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                        }`}
                      >
                        <List size={15} />
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold">
            NT
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">Administrator</div>
            <div className="text-xs text-slate-500">System Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
