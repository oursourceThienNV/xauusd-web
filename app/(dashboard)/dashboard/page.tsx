"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  CircleDollarSign,
  Layers,
  RefreshCw,
  Settings2,
  Trophy,
  TrendingDown,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import Donut from "@/components/charts/Donut";
import Sparkline from "@/components/charts/Sparkline";
import { useSession } from "@/components/providers/SessionProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import Segmented from "@/components/ui/Segmented";
import StatCard from "@/components/ui/StatCard";
import { EmptyState, ErrorBanner } from "@/components/ui/States";
import { errorMessage } from "@/lib/axios";
import { strategyName } from "@/lib/constants";
import { dateTimeVN, money, num, percent, shortDay, signed } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getDashboard, getDashboardStatistics } from "@/services/dashboard.service";
import type { DashboardResponse, DashboardStatistics } from "@/types/api";

const DAY_OPTIONS = [
  { value: 7, label: "7 ngày" },
  { value: 30, label: "30 ngày" },
  { value: 90, label: "90 ngày" },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng";
  if (h < 14) return "Chào buổi trưa";
  if (h < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function DashboardPage() {
  const { user } = useSession();
  const [days, setDays] = useState(30);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [stats, setStats] = useState<DashboardStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (d: number) => {
    setLoading(true);
    setError("");
    try {
      const [a, b] = await Promise.all([getDashboard(), getDashboardStatistics(d)]);
      setDashboard(a);
      setStats(b);
    } catch (e) {
      setError(await errorMessage(e, "Không thể tải dữ liệu Dashboard."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const daily = useMemo(() => stats?.daily ?? [], [stats]);
  const cumulative = useMemo(
    () => daily.map((d) => ({ label: shortDay(d.date), value: Number(d.cumulative), hint: d.date.split("-").reverse().join("/") })),
    [daily]
  );
  const bars = useMemo(
    () =>
      daily.map((d) => ({
        label: shortDay(d.date),
        value: Number(d.profit),
        hint: d.date.split("-").reverse().join("/"),
        extra: `${d.trades} lệnh · ${d.wins} thắng`,
      })),
    [daily]
  );

  const activeRate = dashboard && dashboard.totalAccounts > 0 ? (dashboard.activeAccounts / dashboard.totalAccounts) * 100 : 0;
  const best = dashboard?.bestConfiguration;
  const periodProfit = Number(stats?.totalProfit ?? 0);
  const maxStrategy = Math.max(1, ...(stats?.strategies ?? []).map((s) => Math.abs(Number(s.totalProfit))));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tổng quan hệ thống"
        title={
          <>
            {greeting()}, <span className="text-gold-gradient">{user?.fullname || user?.username || "Admin"}</span>
          </>
        }
        description="Hiệu quả giao dịch vàng XAUUSD của toàn bộ bot trên VPS."
      >
        <Segmented value={days} options={DAY_OPTIONS} onChange={setDays} />
        <Button variant="secondary" size="icon" onClick={() => load(days)} title="Làm mới" disabled={loading}>
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </Button>
      </PageHeader>

      {error && <ErrorBanner message={error} onClose={() => setError("")} />}

      {/* ================= KPI ================= */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          accent
          label="Tổng số dư"
          value={money(dashboard?.totalBalance)}
          sub={`${num(dashboard?.activeAccounts ?? 0, 0)} tài khoản đang hoạt động`}
          icon={CircleDollarSign}
          loading={loading && !dashboard}
        />
        <StatCard
          label={`Lợi nhuận ${days} ngày`}
          value={signed(periodProfit)}
          sub={`Win rate ${percent(stats?.winRate)} · ${num(stats?.totalTrades ?? 0, 0)} lệnh`}
          positive={periodProfit >= 0}
          icon={periodProfit >= 0 ? TrendingUp : TrendingDown}
          loading={loading && !stats}
          footer={<Sparkline values={daily.map((d) => Number(d.cumulative))} width={220} height={32} />}
        />
        <StatCard
          label="Lợi nhuận toàn thời gian"
          value={signed(dashboard?.totalProfit)}
          sub={`${num(dashboard?.totalTrades ?? 0, 0)} giao dịch đã ghi nhận`}
          positive={Number(dashboard?.totalProfit ?? 0) >= 0}
          icon={BarChart3}
          loading={loading && !dashboard}
        />
        <StatCard
          label="Bot đang online"
          value={`${num(stats?.onlineBots ?? 0, 0)}`}
          sub={`${num(stats?.openPositions ?? 0, 0)} lệnh đang mở`}
          icon={Wifi}
          loading={loading && !stats}
          footer={
            <div className="flex items-center gap-2 text-[11px] text-muted">
              <span className="h-2 w-2 rounded-full bg-up pulse-dot" />
              Tín hiệu trong 20 phút gần nhất
            </div>
          }
        />
      </div>

      {/* ================= CHART + WIN/LOSS ================= */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader
            icon={<TrendingUp size={18} />}
            title="Lợi nhuận tích lũy"
            subtitle={stats?.from && stats?.to ? `${stats.from.split("-").reverse().join("/")} – ${stats.to.split("-").reverse().join("/")}` : "—"}
            action={<Money value={periodProfit} className="text-lg" />}
          />
          <div className="px-3 pb-4 pt-4">
            <AreaChart data={cumulative} height={270} format={(v) => signed(v)} />
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader icon={<Award size={18} />} title="Tỷ lệ thắng" subtitle={`${days} ngày gần nhất`} />
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 pb-5 pt-4">
            <Donut
              size={170}
              thickness={16}
              slices={[
                { label: "Thắng", value: stats?.winTrades ?? 0, color: "var(--up)" },
                { label: "Thua", value: stats?.lossTrades ?? 0, color: "var(--down)" },
              ]}
              center={
                <>
                  <p className="num text-3xl font-semibold text-fg">{percent(stats?.winRate)}</p>
                  <p className="text-[11px] text-subtle">{num(stats?.totalTrades ?? 0, 0)} lệnh</p>
                </>
              }
            />
            <div className="grid w-full grid-cols-2 gap-3">
              <div className="rounded-xl bg-up-soft p-3 text-center">
                <p className="text-[11px] font-medium text-up">Thắng</p>
                <p className="num mt-1 text-xl font-semibold text-up">{num(stats?.winTrades ?? 0, 0)}</p>
              </div>
              <div className="rounded-xl bg-down-soft p-3 text-center">
                <p className="text-[11px] font-medium text-down">Thua</p>
                <p className="num mt-1 text-xl font-semibold text-down">{num(stats?.lossTrades ?? 0, 0)}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= DAILY BARS + ACCOUNT STATUS ================= */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader icon={<BarChart3 size={18} />} title="Lợi nhuận theo ngày" subtitle="Rê chuột lên cột để xem chi tiết" />
          <div className="px-3 pb-4 pt-4">
            <BarChart data={bars} height={240} format={(v) => signed(v)} />
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={<Users size={18} />}
            title="Trạng thái tài khoản"
            subtitle={`${num(dashboard?.totalAccounts ?? 0, 0)} tài khoản trong hệ thống`}
            action={
              <Link href="/accounts" className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
                Quản lý <ArrowUpRight size={13} />
              </Link>
            }
          />
          <div className="space-y-4 p-5">
            {[
              { label: "Đang hoạt động", value: dashboard?.activeAccounts ?? 0, tone: "bg-up", text: "text-up" },
              { label: "Đã khóa", value: dashboard?.blockedAccounts ?? 0, tone: "bg-down", text: "text-down" },
              { label: "Hết hạn license", value: dashboard?.expiredAccounts ?? 0, tone: "bg-warn", text: "text-warn" },
            ].map((row) => {
              const pct = dashboard && dashboard.totalAccounts > 0 ? (row.value / dashboard.totalAccounts) * 100 : 0;
              return (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted">{row.label}</span>
                    <span className={cn("num font-semibold", row.text)}>{num(row.value, 0)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-elev">
                    <div className={cn("h-full rounded-full transition-all duration-700", row.tone)} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            <div className="rounded-xl border border-line bg-elev/60 p-4">
              <p className="text-xs text-muted">Tỷ lệ hoạt động</p>
              <p className="num mt-1 text-2xl font-semibold text-gold-gradient">{percent(activeRate)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ================= STRATEGIES + TOP + BEST CONFIG ================= */}
      <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
        <Card>
          <CardHeader icon={<Layers size={18} />} title="Hiệu quả theo phương pháp" subtitle={`${days} ngày gần nhất`} />
          <div className="space-y-4 p-5">
            {(stats?.strategies ?? []).length === 0 ? (
              <EmptyState title="Chưa có giao dịch" className="py-8" />
            ) : (
              stats!.strategies.map((s) => {
                const p = Number(s.totalProfit);
                return (
                  <div key={s.strategy}>
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-fg">{strategyName(s.strategy)}</span>
                      <Money value={p} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-elev">
                        <div
                          className={cn("h-full rounded-full", p >= 0 ? "bg-up" : "bg-down")}
                          style={{ width: `${(Math.abs(p) / maxStrategy) * 100}%` }}
                        />
                      </div>
                      <span className="num w-28 text-right text-[11px] text-subtle">
                        {num(s.totalTrades, 0)} lệnh · {percent(s.winRate)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <CardHeader icon={<Trophy size={18} />} title="Top tài khoản" subtitle={`Lợi nhuận cao nhất ${days} ngày`} />
          <div className="p-3">
            {(stats?.topAccounts ?? []).length === 0 ? (
              <EmptyState title="Chưa có dữ liệu" className="py-8" />
            ) : (
              stats!.topAccounts.map((a, i) => (
                <Link
                  key={a.account}
                  href={`/reports/accounts/${encodeURIComponent(a.account)}`}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-elev"
                >
                  <span
                    className={cn(
                      "num flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      i === 0 ? "bg-gold-gradient text-[#1a1204]" : i < 3 ? "bg-gold-soft text-gold" : "bg-elev text-muted"
                    )}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="num truncate text-sm font-semibold text-fg">{a.account}</p>
                    <p className="truncate text-[11px] text-subtle">
                      {a.fullname || "—"} · {num(a.totalTrades, 0)} lệnh · {percent(a.winRate)}
                    </p>
                  </div>
                  <Money value={a.totalProfit} />
                </Link>
              ))
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2 2xl:col-span-1">
          <CardHeader icon={<Settings2 size={18} />} title="Cấu hình hiệu quả nhất" subtitle="Toàn thời gian, theo tổng lợi nhuận" />
          {best ? (
            <div className="p-5">
              <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gold-soft p-5">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gold/20 blur-2xl" />
                <p className="text-xs text-muted">Tổng lợi nhuận</p>
                <p className="num mt-1 text-3xl font-semibold text-gold-gradient">{signed(best.totalProfit)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="gold">{strategyName(best.strategy)}</Badge>
                  <Badge tone="neutral">{num(best.totalTrades, 0)} lệnh</Badge>
                  <Badge tone="up">Win {percent(best.winRate)}</Badge>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  ["MA Cross", `${best.maFast ?? "—"} / ${best.maSlow ?? "—"}`],
                  ["MA Trend", best.maTrendValue ?? "—"],
                  ["Multi Lot", best.multiLot ? "Có" : "Không"],
                  ["Sideway", best.sideway ? "Bật" : "Tắt"],
                  ["Anti FOMO", best.fomo ? "Bật" : "Tắt"],
                  ["Phương pháp", strategyName(best.strategy)],
                ].map(([k, v]) => (
                  <div key={String(k)} className="rounded-xl bg-elev p-3">
                    <dt className="text-[10px] uppercase tracking-wider text-subtle">{k}</dt>
                    <dd className="num mt-1 truncate text-sm font-semibold text-fg">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <EmptyState title="Chưa có dữ liệu cấu hình" className="py-10" />
          )}
        </Card>
      </div>

      {/* ================= RECENT TRADES ================= */}
      <Card className="overflow-hidden">
        <CardHeader
          icon={<Activity size={18} />}
          title="Giao dịch gần nhất"
          subtitle="10 lệnh đóng mới nhất"
          action={
            <Link href="/reports" className="flex items-center gap-1 text-xs font-semibold text-gold hover:underline">
              Xem báo cáo <ArrowUpRight size={13} />
            </Link>
          }
        />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-y border-line bg-elev/60 text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="px-5 py-3 font-medium">Thời gian đóng</th>
                <th className="px-5 py-3 font-medium">Tài khoản</th>
                <th className="px-5 py-3 font-medium">Ticket</th>
                <th className="px-5 py-3 font-medium">Lệnh</th>
                <th className="px-5 py-3 font-medium">Lot</th>
                <th className="px-5 py-3 font-medium">Phương pháp</th>
                <th className="px-5 py-3 text-right font-medium">Lợi nhuận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(stats?.recentTrades ?? []).length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState title="Chưa có giao dịch" className="py-10" />
                  </td>
                </tr>
              ) : (
                stats!.recentTrades.map((t) => (
                  <tr key={t.id} className="transition hover:bg-elev/60">
                    <td className="num px-5 py-3 text-xs text-muted">{dateTimeVN(t.closeTime)}</td>
                    <td className="px-5 py-3">
                      <Link href={`/reports/accounts/${encodeURIComponent(t.account)}`} className="num font-semibold text-fg hover:text-gold">
                        {t.account}
                      </Link>
                    </td>
                    <td className="num px-5 py-3 text-muted">#{t.ticket}</td>
                    <td className="px-5 py-3">
                      <Badge tone={t.type === "BUY" ? "up" : "down"}>{t.type || "—"}</Badge>
                    </td>
                    <td className="num px-5 py-3 text-muted">{num(t.lot)}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted">
                      {String(t.autoBot).toLowerCase() === "true" ? strategyName(t.strategy) : "Thủ công"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Money value={t.profit} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
