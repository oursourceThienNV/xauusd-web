"use client";

import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { login } from "@/services/auth.service";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      setLoading(true);
      const response = await login({
        username: email,
        password,
      });

      localStorage.setItem("accessToken", response.accessToken);
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10 sm:px-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center lg:text-left">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white lg:mx-0">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Đăng nhập quản trị
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Đăng nhập để truy cập hệ thống quản trị Forex.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tài khoản
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="Nhập tài khoản"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-0 top-0 flex h-12 w-11 items-center justify-center text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          Kết nối được bảo vệ · Authorized Access Only
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          © 2026 XAUUSD · Forex Administration System
        </p>
      </div>
    </section>
  );
}
