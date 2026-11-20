import { BarChart3, LayoutDashboard, ScrollText, UserCog, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: "Tổng quan",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, description: "Hiệu quả toàn hệ thống" }],
  },
  {
    title: "Quản lý",
    items: [{ title: "Tài khoản", href: "/accounts", icon: Users, description: "Khóa, mở khóa, gia hạn license" }],
  },
  {
    title: "Báo cáo",
    items: [
      { title: "Báo cáo thống kê", href: "/reports", icon: BarChart3, description: "Lợi nhuận theo tài khoản" },
      { title: "Nhật ký bot", href: "/logs", icon: ScrollText, description: "Log gửi từ VPS" },
    ],
  },
  {
    title: "Hệ thống",
    items: [{ title: "Hồ sơ & bảo mật", href: "/profile", icon: UserCog, description: "Đổi mật khẩu, giao diện" }],
  },
];

export function pageTitle(pathname: string): { title: string; parent?: string } {
  if (pathname.startsWith("/reports/accounts/")) return { title: "Chi tiết giao dịch", parent: "Báo cáo thống kê" };
  for (const g of NAV) {
    for (const item of g.items) {
      if (pathname === item.href || pathname.startsWith(item.href + "/")) return { title: item.title, parent: g.title };
    }
  }
  return { title: "XAUUSD" };
}
