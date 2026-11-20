"use client";

import { Eye, EyeOff, KeyRound, LockKeyhole, Moon, Sun, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Logo from "@/components/layout/Logo";
import { useTheme } from "@/components/providers/ThemeProvider";
import Button from "@/components/ui/Button";
import { errorMessage } from "@/lib/axios";
import { getToken, setSession } from "@/lib/auth";
import { login } from "@/services/auth.service";

const REMEMBER_KEY = "xauusd.lastUser";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { theme, toggle } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (getToken() && !params.get("expired")) {
      router.replace("/dashboard");
      return;
    }
    try {
      const last = localStorage.getItem(REMEMBER_KEY);
      if (last) setUsername(last);
    } catch {
      /* ignore */
    }
    if (params.get("expired")) setErrorText("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }, [params, router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText("");
    if (!username.trim() || !password) {
      setErrorText("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }
    try {
      setLoading(true);
      const response = await login({ username: username.trim(), password });
      setSession(response.accessToken, response.user ?? { username: response.username });
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, username.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* ignore */
      }
      router.replace("/dashboard");
    } catch (error) {
      setErrorText(await errorMessage(error, "Tài khoản hoặc mật khẩu không chính xác."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
      <button
        type="button"
        onClick={toggle}
        className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition hover:text-gold"
        title="Đổi giao diện"
      >
        {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      <div className="fade-up w-full max-w-[400px]">
        <div className="mb-9">
          <Logo size={48} className="mb-6 lg:hidden" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Secure sign in</p>
          <h2 className="mt-2 text-[28px] font-semibold tracking-tight text-fg">Đăng nhập quản trị</h2>
          <p className="mt-2 text-sm text-muted">Sử dụng tài khoản quản trị viên hoặc sale được cấp.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">Tài khoản</span>
            <div className="relative">
              <User size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type="text"
                autoComplete="username"
                autoFocus
                placeholder="Nhập tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 w-full rounded-xl border border-line bg-card pl-11 pr-4 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-gold/60 focus:ring-4 focus:ring-gold/10"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-medium text-muted">Mật khẩu</span>
            <div className="relative">
              <LockKeyhole size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-subtle" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-xl border border-line bg-card pl-11 pr-12 text-sm text-fg outline-none transition placeholder:text-subtle focus:border-gold/60 focus:ring-4 focus:ring-gold/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-subtle hover:text-fg"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded accent-[#d8a63a]"
            />
            Ghi nhớ tài khoản
          </label>

          {errorText && (
            <div className="fade-up rounded-xl border border-down/25 bg-down-soft px-4 py-3 text-sm text-down">{errorText}</div>
          )}

          <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full" icon={!loading ? <KeyRound size={16} /> : undefined}>
            {loading ? "Đang xác thực..." : "Đăng nhập"}
          </Button>
        </form>

        <p className="mt-10 text-center text-xs text-subtle">© {new Date().getFullYear()} XAUUSD · Gold Trading Administration</p>
      </div>
    </section>
  );
}
