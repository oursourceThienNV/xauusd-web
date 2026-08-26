import { ShieldCheck, LockKeyhole, Activity, Server } from "lucide-react";

export default function LoginBanner() {
  return (
    <section className="relative hidden overflow-hidden bg-[#07111f] text-white lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.10),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10">
              <ShieldCheck className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
                Secure Administration
              </div>
              <div className="text-lg font-semibold tracking-wide">XAUUSD</div>
            </div>
          </div>

          <div className="mt-20 max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              HỆ THỐNG AN TOÀN
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Quản trị hệ thống
              <br />
              <span className="text-blue-400">Forex Trading</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Cổng quản trị dành cho việc quản lý tài khoản, quyền truy cập
              và hoạt động giao dịch Forex.
            </p>
          </div>
        </div>

        <div>
          <div className="grid max-w-xl grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <LockKeyhole className="mb-3 h-5 w-5 text-blue-400" />
              <div className="text-sm font-medium">Bảo mật</div>
              <div className="mt-1 text-xs text-slate-500">Truy cập kiểm soát</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Activity className="mb-3 h-5 w-5 text-blue-400" />
              <div className="text-sm font-medium">Giám sát</div>
              <div className="mt-1 text-xs text-slate-500">Theo dõi hoạt động</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <Server className="mb-3 h-5 w-5 text-blue-400" />
              <div className="text-sm font-medium">Ổn định</div>
              <div className="mt-1 text-xs text-slate-500">Hệ thống quản trị</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-[11px] text-slate-600">
            <span>AUTHORIZED ACCESS ONLY</span>
            <span>© 2026 XAUUSD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
