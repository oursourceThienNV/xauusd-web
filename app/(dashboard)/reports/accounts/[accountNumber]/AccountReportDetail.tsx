"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CircleDollarSign,
  FileSpreadsheet,
  Hand,
  Search,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import AreaChart from "@/components/charts/AreaChart";
import BarChart from "@/components/charts/BarChart";
import Donut from "@/components/charts/Donut";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import DateRange from "@/components/ui/DateRange";
import { Input, Select } from "@/components/ui/Input";
import Money from "@/components/ui/Money";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import { EmptyState, ErrorBanner, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { errorMessage } from "@/lib/axios";
import { ROLE_LABEL, strategyName } from "@/lib/constants";
import { dateTimeVN, dateVN, downloadBlob, money, num, percent, presetRange, shortDay, signed, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { exportTradeReports, getAccountSummary, getTradeReports } from "@/services/report.service";
import type { AccountSummary, TradeReportResponse } from "@/types/api";

const isBot = (t: TradeReportResponse) => String(t.autoBot).toLowerCase() === "true";

export default function AccountReportDetail() {
  const params = useParams<{ accountNumber: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const accountNumber = decodeURIComponent(String(params?.accountNumber ?? ""));

  const fallback = presetRange("month");
  const [range, setRange] = useState({
    from: search.get("from") || fallback.from,
    to: search.get("to") || fallback.to,
  });
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [trades, setTrades] = useState<TradeReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [type, setType] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const load = useCallback(
    async (r: { from: string; to: string }, kw: string, f: { result: string; type: string; source: string }) => {
      if (!accountNumber) return;
      if (!r.from || !r.to || r.from > r.to) {
        setError("Khoảng thời gian không hợp lệ.");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const [s, t] = await Promise.all([
          getAccountSummary(accountNumber, r.from, r.to),
          getTradeReports(accountNumber, 0, 1000, kw, r.from, r.to, f),
        ]);
        setSummary(s);
        setTrades(t.content || []);
        setPage(0);
      } catch (e) {
        setError(await errorMessage(e, "Không thể tải dữ liệu tài khoản."));
      } finally {
        setLoading(false);
      }
    },
    [accountNumber]
  );

  useEffect(() => {
    load(range, "", { result: "", type: "", source: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber]);

  const filters = { result, type, source };

  const applyRange = (r: { from: string; to: string }) => {
    setRange(r);
    if (r.from && r.to && r.from <= r.to) {
      router.replace(`/reports/accounts/${encodeURIComponent(accountNumber)}?from=${r.from}&to=${r.to}`);
      load(r, keyword, filters);
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    setKeyword(query.trim());
    load(range, query.trim(), filters);
  };

  const setFilter = (next: Partial<typeof filters>) => {
    const f = { ...filters, ...next };
    setResult(f.result);
    setType(f.type);
    setSource(f.source);
    load(range, keyword, f);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportTradeReports(accountNumber, range.from, range.to, keyword);
      downloadBlob(blob, `giao-dich-${accountNumber}-${range.from}-${range.to}.xlsx`);
      toast.success("Đã xuất Excel giao dịch.");
    } catch (e) {
      toast.error(await errorMessage(e, "Không thể xuất Excel."));
    } finally {
      setExporting(false);
    }
  };

  const daily = useMemo(() => summary?.daily ?? [], [summary]);
  const curve = useMemo(
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

  const paged = trades.slice(page * size, page * size + size);
  const pageProfit = trades.reduce((s, t) => s + Number(t.profit || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Link href="/reports" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-gold">
            <ArrowLeft size={14} /> Quay lại báo cáo
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="num text-2xl font-semibold tracking-tight text-fg sm:text-[28px]">{accountNumber}</h1>
            {summary && (
              <>
                <Badge tone={summary.status === "01" ? "up" : "down"} dot>
                  {summary.status === "01" ? "Hoạt động" : "Bị khóa"}
                </Badge>
                <Badge tone={summary.botStatus === "ONLINE" ? "up" : "neutral"} dot pulse={summary.botStatus === "ONLINE"}>
                  Bot {summary.botStatus === "ONLINE" ? "online" : "offline"}
                </Badge>
                {summary.role && <Badge tone="gold">{ROLE_LABEL[summary.role] || summary.role}</Badge>}
              </>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted">
            {summary?.fullname || "—"}
            {summary && (
              <>
                {" "}
                · License {summary.remainingDays > 0 ? `còn ${summary.remainingDays} ngày (${dateVN(summary.licenseExpiredDt)})` : "đã hết hạn"} · Tín hiệu{" "}
                {timeAgo(summary.onlineDate).toLowerCase()}
              </>
            )}
          </p>
        </div>
        <Button variant="gold" icon={<FileSpreadsheet size={16} />} loading={exporting} onClick={handleExport}>
          Tải Excel giao dịch
        </Button>
      </div>

      <Card className="p-4">
        <DateRange from={range.from} to={range.to} onChange={applyRange} />
      </Card>

      {error && <ErrorBanner message={error} onClose={() => setError("")} />}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard accent label="Số dư hiện tại" value={money(summary?.balance)} icon={Wallet} loading={loading && !summary} />
        <StatCard
          label="Lợi nhuận kỳ"
          value={signed(summary?.profit)}
          positive={Number(summary?.profit ?? 0) >= 0}
          icon={Number(summary?.profit ?? 0) >= 0 ? TrendingUp : TrendingDown}
          loading={loading && !summary}
        />
        <StatCard label="Do bot" value={signed(summary?.autoBotProfit)} positive={Number(summary?.autoBotProfit ?? 0) >= 0} icon={Bot} sub={`${num(summary?.botTrades ?? 0, 0)} lệnh bot`} loading={loading && !summary} />
        <StatCard label="Thủ công" value={signed(summary?.manualProfit)} positive={Number(summary?.manualProfit ?? 0) >= 0} icon={Hand} loading={loading && !summary} />
        <StatCard label="Win rate" value={percent(summary?.winRate)} sub={`${num(summary?.winTrades ?? 0, 0)} thắng / ${num(summary?.lossTrades ?? 0, 0)} thua`} icon={Target} loading={loading && !summary} />
        <StatCard
          label="Lệnh tốt / tệ nhất"
          value={<span className="text-up">{signed(summary?.bestTrade)}</span>}
          sub={<span className="text-down">{signed(summary?.worstTrade)}</span>}
          icon={CircleDollarSign}
          loading={loading && !summary}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr_300px]">
        <Card>
          <CardHeader icon={<TrendingUp size={18} />} title="Lợi nhuận tích lũy" subtitle="Theo ngày đóng lệnh" />
          <div className="px-3 pb-4 pt-4">
            <AreaChart data={curve} height={220} format={(v) => signed(v)} />
          </div>
        </Card>
        <Card>
          <CardHeader icon={<TrendingUp size={18} />} title="Lợi nhuận từng ngày" />
          <div className="px-3 pb-4 pt-4">
            <BarChart data={bars} height={220} format={(v) => signed(v)} />
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader icon={<Bot size={18} />} title="Nguồn lợi nhuận" />
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-5">
            <Donut
              size={150}
              thickness={14}
              slices={[
                { label: "Bot", value: Math.abs(Number(summary?.autoBotProfit ?? 0)), color: "var(--gold)" },
                { label: "Thủ công", value: Math.abs(Number(summary?.manualProfit ?? 0)), color: "var(--info)" },
              ]}
              center={
                <>
                  <p className="num text-xl font-semibold text-fg">{num(summary?.totalTrades ?? 0, 0)}</p>
                  <p className="text-[11px] text-subtle">lệnh</p>
                </>
              }
            />
            <div className="w-full space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <span className="h-2 w-2 rounded-full bg-gold" /> Bot
                </span>
                <Money value={summary?.autoBotProfit} />
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted">
                  <span className="h-2 w-2 rounded-full bg-info" /> Thủ công
                </span>
                <Money value={summary?.manualProfit} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-fg">Danh sách giao dịch</h3>
            <p className="mt-0.5 text-xs text-muted">
              {num(trades.length, 0)} lệnh · tổng <Money value={pageProfit} />
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-2 md:flex-row">
            <Select value={source} onChange={(e) => setFilter({ source: e.target.value })} className="md:w-40">
              <option value="">Mọi nguồn</option>
              <option value="bot">Bot</option>
              <option value="manual">Thủ công</option>
            </Select>
            <Select value={type} onChange={(e) => setFilter({ type: e.target.value })} className="md:w-40">
              <option value="">BUY + SELL</option>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </Select>
            <Select value={result} onChange={(e) => setFilter({ result: e.target.value })} className="md:w-40">
              <option value="">Mọi kết quả</option>
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
            </Select>
            <Input
              icon={<Search size={16} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ticket, phương pháp..."
              wrapperClassName="md:w-56"
            />
            <Button type="submit" variant="primary" disabled={loading}>
              Lọc
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1380px] text-left text-sm">
            <thead className="bg-elev/60 text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Ticket</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Nguồn</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Lệnh</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Lot</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Giá mở</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Giá đóng</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Mở lúc</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Đóng lúc</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">P/L</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Kết quả</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Phương pháp</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Lot level</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">R:R</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">MA</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Bộ lọc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <SkeletonRows rows={8} cols={15} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={15}>
                    <EmptyState title="Không có giao dịch" description="Không có lệnh nào đóng trong khoảng thời gian / bộ lọc này." />
                  </td>
                </tr>
              ) : (
                paged.map((t) => (
                  <tr key={t.id} className="transition hover:bg-elev/50">
                    <td className="num px-4 py-3 font-semibold text-fg">#{t.ticket}</td>
                    <td className="px-4 py-3">
                      <Badge tone={isBot(t) ? "gold" : "info"}>{isBot(t) ? "Bot" : "Thủ công"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={t.type === "BUY" ? "up" : "down"}>{t.type || "—"}</Badge>
                    </td>
                    <td className="num px-4 py-3 text-right text-fg">{num(t.lot)}</td>
                    <td className="num px-4 py-3 text-right text-muted">{num(t.openPrice)}</td>
                    <td className="num px-4 py-3 text-right text-muted">{num(t.closePrice)}</td>
                    <td className="num px-4 py-3 text-xs text-muted">{dateTimeVN(t.openTime)}</td>
                    <td className="num px-4 py-3 text-xs text-muted">{dateTimeVN(t.closeTime)}</td>
                    <td className="px-4 py-3 text-right">
                      <Money value={t.profit} />
                    </td>
                    <td className="px-4 py-3">
                      {t.result ? <Badge tone={t.result === "WIN" ? "up" : "down"}>{t.result}</Badge> : <span className="text-subtle">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{isBot(t) ? strategyName(t.strategy) : "—"}</td>
                    <td className="px-4 py-3">
                      {t.multiLot ? (
                        <span className={cn("num rounded-md px-2 py-0.5 text-xs font-semibold", t.lotNumber ? "bg-gold-soft text-gold" : "bg-elev text-muted")}>
                          {t.lotNumber ? `L${t.lotNumber}` : "Multi"}
                        </span>
                      ) : (
                        <span className="text-subtle">—</span>
                      )}
                    </td>
                    <td className="num px-4 py-3 text-xs text-muted">
                      {t.rrRisk != null || t.rrReward != null ? `${Number(t.rrRisk ?? 0)}:${Number(t.rrReward ?? 0)}` : "—"}
                    </td>
                    <td className="num px-4 py-3 text-xs text-muted">
                      {t.maFast != null ? `${t.maFast}/${t.maSlow ?? "—"}/${t.maTrendValue ?? "—"}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {t.sideway && <Badge tone="neutral" className="px-2 py-0.5 text-[10px]">Sideway</Badge>}
                        {t.fomo && <Badge tone="neutral" className="px-2 py-0.5 text-[10px]">FOMO</Badge>}
                        {!t.sideway && !t.fomo && <span className="text-subtle">—</span>}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={Math.ceil(trades.length / size)}
          totalElements={trades.length}
          unit="lệnh"
          sizes={[20, 50, 100]}
          onPage={setPage}
          onSize={(s) => {
            setSize(s);
            setPage(0);
          }}
        />
      </Card>
    </div>
  );
}
