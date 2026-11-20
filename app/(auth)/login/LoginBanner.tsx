import { Activity, ChartLine, ShieldCheck } from "lucide-react";
import Logo from "@/components/layout/Logo";

const CHART =
  "M0,250 C60,240 90,262 140,230 C190,198 220,214 270,180 C320,146 350,170 400,138 C450,106 480,128 530,96 C580,64 610,84 660,52 C700,28 730,40 760,22";

export default function LoginBanner() {
  return (
    <section className="relative hidden overflow-hidden bg-[#06080c] text-white lg:flex">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(229,181,85,0.20),transparent_38%),radial-gradient(circle_at_85%_90%,rgba(229,181,85,0.10),transparent_40%)]" />
      <div className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <svg viewBox="0 0 760 300" className="absolute bottom-[18%] left-0 w-full opacity-90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="goldArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#e5b555" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#e5b555" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0" x2="1">
            <stop offset="0%" stopColor="#b9861c" />
            <stop offset="100%" stopColor="#f6d78e" />
          </linearGradient>
        </defs>
        <path d={`${CHART} L760,300 L0,300 Z`} fill="url(#goldArea)" />
        <path d={CHART} fill="none" stroke="url(#goldLine)" strokeWidth="2.5" pathLength={1} className="draw-line" />
        <circle cx="760" cy="22" r="5" fill="#f6d78e" />
      </svg>

      <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
        <div className="flex items-center gap-3">
          <Logo size={46} />
          <div>
            <p className="text-lg font-bold tracking-[0.1em]">XAUUSD</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#e5b555]/80">Gold Trading Admin</p>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e5b555]/25 bg-[#e5b555]/[0.07] px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#f6d78e]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d399] pulse-dot" />
            Hệ thống đang hoạt động
          </div>
          <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight xl:text-[52px]">
            Quản trị bot giao dịch
            <br />
            <span className="text-gold-gradient">Vàng XAU/USD</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#98a1b3]">
            Theo dõi lợi nhuận, quản lý license và giám sát toàn bộ bot MT5 trên VPS trong một bảng điều khiển duy nhất.
          </p>
        </div>

        <div>
          <div className="grid max-w-xl grid-cols-3 gap-3">
            {[
              { icon: ChartLine, title: "Lợi nhuận", text: "Realtime theo ngày" },
              { icon: Activity, title: "Giám sát", text: "Bot online / log" },
              { icon: ShieldCheck, title: "License", text: "Khóa · gia hạn" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 backdrop-blur">
                <Icon className="mb-3 h-5 w-5 text-[#e5b555]" />
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs text-[#697286]">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-center justify-between text-[11px] tracking-wide text-[#4b5263]">
            <span>AUTHORIZED ACCESS ONLY</span>
            <span>© {new Date().getFullYear()} XAUUSD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
