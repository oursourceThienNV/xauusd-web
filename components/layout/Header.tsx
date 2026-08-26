"use client";

import { Bell, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/accounts": "Quản lý tài khoản",
  "/reports": "Báo cáo thống kê",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("accessToken");
    router.push("/login");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-7">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {titles[pathname] || "Chi tiết giao dịch"}
        </h2>
        <p className="text-xs text-slate-400">Forex Administration System</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          title="Thông báo"
        >
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
        </button>

        <div className="h-7 w-px bg-slate-200" />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">Administrator</p>
          <p className="text-[11px] text-slate-400">System Admin</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
