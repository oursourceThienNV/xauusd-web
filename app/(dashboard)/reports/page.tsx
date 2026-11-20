"use client";

import Link from "next/link";
import {
  ArrowDownUp,
  ArrowUpRight,
  Bot,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  FileSpreadsheet,
  Hand,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DateRange from "@/components/ui/DateRange";
import { Input, Select } from "@/components/ui/Input";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import StatCard from "@/components/ui/StatCard";
import { EmptyState, ErrorBanner, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { isAdmin } from "@/lib/auth";
import { errorMessage } from "@/lib/axios";
import { ROLE_LABEL, ROLE_OPTIONS } from "@/lib/constants";
import { downloadBlob, money, num, percent, presetRange, signed, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { exportAccountReports, getAccountReports } from "@/services/report.service";
import type { AccountReportResponse } from "@/types/api";

type SortKey = "account" | "balance" | "profit" | "autoBotProfit" | "winRate" | "totalTrades" | "remainingDays";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "profit", label: "Lợi nhuận" },
  { key: "autoBotProfit", label: "Lợi nhuận bot" },
  { key: "balance", label: "Số dư" },
  { key: "winRate", label: "Win rate" },
  { key: "totalTrades", label: "Số lệnh" },
  { key: "account", label: "Tài khoản" },
];

export default function ReportsPage() {
  const toast = useToast();
  const { user } = useSession();
  const admin = isAdmin(user);
  const initial = presetRange("month");

  const [range, setRange] = useState(initial);
  const [searched, setSearched] = useState(initial);
  const [query, setQuery] = useState("");
  const [roleType, setRoleType] = useState("");
  const [onlyTraded, setOnlyTraded] = useState(false);
  const [rows, setRows] = useState<AccountReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "profit", dir: "desc" });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const load = useCallback(async (r: { from: string; to: string }, kw: string, role: string) => {
    if (!r.from || !r.to) {
      setError("Vui lòng chọn khoảng thời gian.");
      return;
    }
    if (r.from > r.to) {
      setError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await getAccountReports(0, 1000, kw, r.from, r.to, role);
      setRows(data.content || []);
      setSearched(r);
      setPage(0);
    } catch (e) {
      setRows([]);
      setError(await errorMessage(e, "Không thể tải báo cáo."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(initial, "", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    load(range, query.trim(), roleType);
  };

  const handleExport = async () => {
    if (!range.from || !range.to || range.from > range.to) {
      toast.error("Khoảng thời gian không hợp lệ.");
      return;
    }
    setExporting(true);
    try {
      const blob = await exportAccountReports(range.from, range.to);
      downloadBlob(blob, `bao-cao-${range.from}-${range.to}.xlsx`);
      toast.success("Đã xuất file Excel báo cáo.");
    } catch (e) {
      toast.error(await errorMessage(e, "Không thể xuất Excel."));
    } finally {
      setExporting(false);
    }
  };

  const filtered = useMemo(() => {
    const list = onlyTraded ? rows.filter((r) => Number(r.totalTrades) > 0) : rows.slice();
    const dir = sort.dir === "asc" ? 1 : -1;
    list.sort((a, b) => {
      if (sort.key === "account") return a.account.localeCompare(b.account) * dir;
      return (Number(a[sort.key] ?? 0) - Number(b[sort.key] ?? 0)) * dir;
    });
    return list;
  }, [rows, onlyTraded, sort]);

  const totals = useMemo(() => {
    const t = { balance: 0, profit: 0, bot: 0, trades: 0, wins: 0, online: 0 };
    for (const r of rows) {
      t.balance += Number(r.balance || 0);
      t.profit += Number(r.profit || 0);
      t.bot += Number(r.autoBotProfit || 0);
      t.trades += Number(r.totalTrades || 0);
      t.wins += Number(r.winTrades || 0);
      if (r.botStatus === "ONLINE") t.online += 1;
    }
    return t;
  }, [rows]);

  const paged = filtered.slice(page * size, page * size + size);
  const totalPages = Math.ceil(filtered.length / size);
  const maxAbs = Math.max(1, ...filtered.map((r) => Math.abs(Number(r.profit || 0))));

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key !== k ? (
      <ArrowDownUp size={12} className="opacity-40" />
    ) : sort.dir === "asc" ? (
      <ChevronUp size={13} className="text-gold" />
    ) : (
      <ChevronDown size={13} className="text-gold" />
    );

  const Th = ({ k, children, right = false }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={cn("whitespace-nowrap px-5 py-3 font-medium", right && "text-right")}>
      <button
        type="button"
        onClick={() => toggleSort(k)}
        className={cn("inline-flex items-center gap-1 uppercase tracking-wider hover:text-fg", right && "flex-row-reverse")}
      >
        {children}
        <SortIcon k={k} />
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Báo cáo"
        title="Báo cáo thống kê"
        description={`Lợi nhuận theo tài khoản từ ${searched.from.split("-").reverse().join("/")} đến ${searched.to
          .split("-")
          .reverse()
          .join("/")}.`}
      >
        <Button variant="gold" icon={<FileSpreadsheet size={16} />} loading={exporting} onClick={handleExport}>
          Xuất Excel
        </Button>
      </PageHeader>

      {error && <ErrorBanner message={error} onClose={() => setError("")} />}

      <Card className="mb-5 p-4">
        <form onSubmit={submit} className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
          <DateRange
            from={range.from}
            to={range.to}
            onChange={(r) => {
              setRange(r);
              if (r.from && r.to && r.from <= r.to) load(r, query.trim(), roleType);
            }}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            {admin && (
              <Select
                value={roleType}
                onChange={(e) => {
                  setRoleType(e.target.value);
                  load(range, query.trim(), e.target.value);
                }}
                className="sm:w-40"
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
            <Input
              icon={<Search size={16} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tài khoản hoặc họ tên..."
              wrapperClassName="sm:w-64"
            />
            <Button type="submit" variant="primary" loading={loading}>
              Xem báo cáo
            </Button>
          </div>
        </form>
      </Card>

      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard accent label="Tổng số dư hiện tại" value={money(totals.balance)} sub={`${rows.length} tài khoản`} icon={CircleDollarSign} loading={loading} />
        <StatCard
          label="Lợi nhuận trong kỳ"
          value={signed(totals.profit)}
          positive={totals.profit >= 0}
          sub={`${num(totals.trades, 0)} lệnh · win ${percent(totals.trades ? (totals.wins / totals.trades) * 100 : 0)}`}
          icon={totals.profit >= 0 ? TrendingUp : TrendingDown}
          loading={loading}
        />
        <StatCard
          label="Lợi nhuận do bot"
          value={signed(totals.bot)}
          positive={totals.bot >= 0}
          sub="Lệnh bot tự vào"
          icon={Bot}
          loading={loading}
        />
        <StatCard
          label="Lợi nhuận thủ công"
          value={signed(totals.profit - totals.bot)}
          positive={totals.profit - totals.bot >= 0}
          sub={`${totals.online} bot đang online`}
          icon={Hand}
          loading={loading}
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[15px] font-semibold text-fg">Thống kê theo tài khoản</h3>
            <p className="mt-0.5 text-xs text-muted">Bấm vào tài khoản để xem toàn bộ giao dịch trong kỳ.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-xs text-muted">
              <input type="checkbox" checked={onlyTraded} onChange={(e) => { setOnlyTraded(e.target.checked); setPage(0); }} className="accent-[#d8a63a]" />
              Chỉ tài khoản có giao dịch
            </label>
            <Select
              value={`${sort.key}:${sort.dir}`}
              onChange={(e) => {
                const [key, dir] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
                setSort({ key, dir });
              }}
              className="h-9 w-48 text-xs"
            >
              {SORTS.flatMap((s) => [
                <option key={`${s.key}:desc`} value={`${s.key}:desc`}>
                  {s.label} ↓
                </option>,
                <option key={`${s.key}:asc`} value={`${s.key}:asc`}>
                  {s.label} ↑
                </option>,
              ])}
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-left text-sm">
            <thead className="bg-elev/60 text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <Th k="account">Tài khoản</Th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">Trạng thái</th>
                <th className="whitespace-nowrap px-5 py-3 font-medium">Bot</th>
                <Th k="balance" right>
                  Số dư
                </Th>
                <Th k="profit" right>
                  Lợi nhuận
                </Th>
                <Th k="autoBotProfit" right>
                  Do bot
                </Th>
                <Th k="winRate">Win rate</Th>
                <Th k="totalTrades" right>
                  Lệnh
                </Th>
                <Th k="remainingDays">License</Th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <SkeletonRows rows={8} cols={10} />
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState title="Không có dữ liệu" description="Không có tài khoản phù hợp trong khoảng thời gian này." />
                  </td>
                </tr>
              ) : (
                paged.map((a) => {
                  const href = `/reports/accounts/${encodeURIComponent(a.account)}?from=${searched.from}&to=${searched.to}`;
                  const p = Number(a.profit || 0);
                  const days = Number(a.remainingDays ?? 0);
                  return (
                    <tr key={a.account} className="group transition hover:bg-elev/50">
                      <td className="px-5 py-3.5">
                        <Link href={href} className="block">
                          <p className="num font-semibold text-fg group-hover:text-gold">{a.account}</p>
                          <p className="text-xs text-muted">
                            {a.fullname || "—"}
                            {a.role && <span className="text-subtle"> · {ROLE_LABEL[a.role] || a.role}</span>}
                            {a.typeMoney === "USD" && <span className="text-subtle"> · USD→USC</span>}
                          </p>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={a.status === "01" ? "up" : "down"} dot>
                          {a.status === "01" ? "Hoạt động" : "Bị khóa"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tone={a.botStatus === "ONLINE" ? "up" : "neutral"} dot pulse={a.botStatus === "ONLINE"}>
                          {a.botStatus === "ONLINE" ? "Online" : "Mất kết nối"}
                        </Badge>
                        <p className="mt-1 text-[11px] text-subtle">{timeAgo(a.onlineDate)}</p>
                      </td>
                      <td className="num px-5 py-3.5 text-right font-semibold text-fg">{money(a.balance)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Money value={p} />
                        <div className="ml-auto mt-1.5 h-1 w-24 overflow-hidden rounded-full bg-elev">
                          <div
                            className={cn("h-full rounded-full", p >= 0 ? "ml-auto bg-up" : "bg-down")}
                            style={{ width: `${(Math.abs(p) / maxAbs) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Money value={a.autoBotProfit} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="num text-sm font-semibold text-fg">{percent(a.winRate)}</span>
                        <p className="num text-[11px] text-subtle">
                          {num(a.winTrades, 0)}W · {num(Number(a.totalTrades) - Number(a.winTrades), 0)}L
                        </p>
                      </td>
                      <td className="num px-5 py-3.5 text-right text-fg">{num(a.totalTrades, 0)}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-xs font-semibold", days <= 0 ? "text-down" : days <= 7 ? "text-warn" : "text-up")}>
                          {days <= 0 ? "Hết hạn" : `${days} ngày`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={href}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition hover:bg-elev hover:text-gold"
                          title="Xem giao dịch"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {!loading && filtered.length > 0 && (
              <tfoot className="border-t-2 border-line bg-elev/60 text-sm">
                <tr>
                  <td className="px-5 py-3.5 font-semibold text-fg" colSpan={3}>
                    Tổng ({filtered.length} tài khoản)
                  </td>
                  <td className="num px-5 py-3.5 text-right font-semibold text-fg">
                    {money(filtered.reduce((s, r) => s + Number(r.balance || 0), 0))}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Money value={filtered.reduce((s, r) => s + Number(r.profit || 0), 0)} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Money value={filtered.reduce((s, r) => s + Number(r.autoBotProfit || 0), 0)} />
                  </td>
                  <td />
                  <td className="num px-5 py-3.5 text-right font-semibold text-fg">
                    {num(filtered.reduce((s, r) => s + Number(r.totalTrades || 0), 0), 0)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={filtered.length}
          unit="tài khoản"
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
