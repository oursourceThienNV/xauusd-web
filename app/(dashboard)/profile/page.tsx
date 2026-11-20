"use client";

import { KeyRound, LogOut, Moon, ShieldCheck, Sun, UserCog } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { changePassword } from "@/services/auth.service";

export default function ProfilePage() {
  const { user, logout } = useSession();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [saving, setSaving] = useState(false);

  const mismatch = rePassword.length > 0 && rePassword !== newPassword;
  const weak = newPassword.length > 0 && newPassword.length < 6;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đủ mật khẩu.");
      return;
    }
    if (weak || mismatch) return;
    setSaving(true);
    try {
      await changePassword(oldPassword, newPassword, rePassword);
      toast.success("Đổi mật khẩu thành công.");
      setOldPassword("");
      setNewPassword("");
      setRePassword("");
    } catch (err) {
      toast.error(await errorMessage(err, "Không thể đổi mật khẩu."));
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.fullname || user?.username || "AD")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(-2)
    .toUpperCase();

  return (
    <div>
      <PageHeader eyebrow="Hệ thống" title="Hồ sơ & bảo mật" description="Thông tin đăng nhập, đổi mật khẩu và tùy chọn giao diện." />

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-24 bg-[radial-gradient(circle_at_20%_0%,rgba(229,181,85,0.35),transparent_60%)] bg-sidebar" />
            <div className="-mt-10 px-6 pb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold-gradient text-2xl font-bold text-[#2a1c03] ring-4 ring-card">
                {initials}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-fg">{user?.fullname || user?.username}</h3>
              <p className="num text-sm text-muted">@{user?.username}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="gold">{user?.roleName || "Quản trị"}</Badge>
                <Badge tone="up" dot>
                  Đang hoạt động
                </Badge>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Email</dt>
                  <dd className="truncate text-fg">{user?.email || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Điện thoại</dt>
                  <dd className="text-fg">{user?.phone || "—"}</dd>
                </div>
              </dl>
              <Button variant="outline" className="mt-6 w-full" icon={<LogOut size={15} />} onClick={logout}>
                Đăng xuất
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader icon={<UserCog size={18} />} title="Giao diện" subtitle="Lưu trên trình duyệt này" />
            <div className="grid grid-cols-2 gap-3 p-5">
              {[
                { key: "dark" as const, label: "Tối · Gold", icon: Moon, preview: "bg-[#07090e]" },
                { key: "light" as const, label: "Sáng", icon: Sun, preview: "bg-[#f4f5f7]" },
              ].map((o) => (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setTheme(o.key)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition",
                    theme === o.key ? "border-gold/60 bg-gold-soft" : "border-line hover:bg-elev"
                  )}
                >
                  <div className={cn("mb-3 flex h-14 items-end gap-1 rounded-lg p-2 ring-1 ring-line", o.preview)}>
                    <span className="h-3 w-6 rounded bg-[#e5b555]" />
                    <span className="h-6 w-6 rounded bg-[#34d399]/70" />
                    <span className="h-4 w-6 rounded bg-[#fb7185]/70" />
                  </div>
                  <span className="flex items-center gap-2 text-sm font-medium text-fg">
                    <o.icon size={15} /> {o.label}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader icon={<KeyRound size={18} />} title="Đổi mật khẩu" subtitle="Mật khẩu mới tối thiểu 6 ký tự" />
          <form onSubmit={submit} className="max-w-xl space-y-4 p-5">
            <Field label="Mật khẩu hiện tại">
              <Input type="password" autoComplete="current-password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            </Field>
            <Field label="Mật khẩu mới" error={weak ? "Mật khẩu phải có ít nhất 6 ký tự." : undefined}>
              <Input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Field>
            <Field label="Nhập lại mật khẩu mới" error={mismatch ? "Mật khẩu nhập lại không khớp." : undefined}>
              <Input type="password" autoComplete="new-password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
            </Field>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="gold" loading={saving} icon={<ShieldCheck size={16} />}>
                Cập nhật mật khẩu
              </Button>
              <p className="text-xs text-subtle">Mật khẩu được mã hóa BCrypt, giống hệ thống cũ.</p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
