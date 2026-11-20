"use client";

import { Pause, Play, RefreshCw, ScrollText, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import { EmptyState, ErrorBanner } from "@/components/ui/States";
import { errorMessage } from "@/lib/axios";
import { dateTimeVN, num } from "@/lib/format";
import { cn } from "@/lib/utils";
import { getLogs } from "@/services/log.service";
import type { SystemLog } from "@/types/api";

// Nền log luôn tối (kiểu terminal) -> dùng màu cố định
function lineTone(text: string) {
  if (/❌|⛔|ERROR|LỖI|FAILED|lỗi/i.test(text)) return "text-[#fb7185]";
  if (/⚠️|WARN|cảnh báo/i.test(text)) return "text-[#fbbf24]";
  if (/✅|🟢|SUCCESS|thành công|WIN/i.test(text)) return "text-[#34d399]";
  if (/BUY|SELL|LOT|TP|SL/.test(text)) return "text-[#e5b555]";
  return "text-[#c9cfdb]";
}

export default function LogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [account, setAccount] = useState("");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [applied, setApplied] = useState({ account: "", keyword: "", from: "", to: "" });
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [error, setError] = useState("");
  const appliedRef = useRef(applied);
  useEffect(() => {
    appliedRef.current = applied;
  }, [applied]);

  const load = useCallback(
    async (p: number, s: number, f: { account: string; keyword: string; from: string; to: string }, silent = false) => {
      if (!silent) setLoading(true);
      setError("");
      try {
        const data = await getLogs({ ...f, page: p, size: s });
        setLogs(data.content || []);
        setTotal(data.totalElements ?? 0);
        setTotalPages(data.totalPages ?? 0);
        setPage(data.number ?? p);
        setSize(data.size ?? s);
      } catch (e) {
        setError(await errorMessage(e, "Không thể tải nhật ký."));
      } finally {
        if (!silent) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(0, 50, { account: "", keyword: "", from: "", to: "" });
  }, [load]);

  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => load(0, size, appliedRef.current, true), 5000);
    return () => window.clearInterval(t);
  }, [live, size, load]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const f = { account: account.trim(), keyword: query.trim(), from, to };
    setApplied(f);
    load(0, size, f);
  };

  return (
    <div>
      <PageHeader eyebrow="Giám sát" title="Nhật ký bot" description="Log các bot trên VPS gửi về qua API /write-log (lưu tối đa theo cấu hình LOG_RETENTION_DAYS).">
        <Button
          variant={live ? "gold" : "secondary"}
          icon={live ? <Pause size={15} /> : <Play size={15} />}
          onClick={() => setLive((v) => !v)}
        >
          {live ? "Đang tự cập nhật" : "Tự cập nhật 5s"}
        </Button>
        <Button variant="secondary" size="icon" onClick={() => load(page, size, applied)} disabled={loading} title="Làm mới">
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </Button>
      </PageHeader>

      {error && <ErrorBanner message={error} onClose={() => setError("")} />}

      <Card className="overflow-hidden">
        <form onSubmit={submit} className="flex flex-col gap-2 border-b border-line p-4 lg:flex-row lg:items-center">
          <Input value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Số tài khoản" wrapperClassName="lg:w-44" className="num lg:w-44" />
          <Input icon={<Search size={16} />} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm trong nội dung log..." wrapperClassName="lg:flex-1" />
          <div className="flex items-center gap-2">
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" aria-label="Từ ngày" />
            <span className="text-subtle">→</span>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" aria-label="Đến ngày" />
          </div>
          <Button type="submit" variant="primary" disabled={loading}>
            Lọc
          </Button>
        </form>

        <div className="max-h-[68vh] overflow-y-auto bg-[#05070b] p-2 font-mono text-[12.5px] leading-6">
          {loading && logs.length === 0 ? (
            <div className="space-y-2 p-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="skeleton h-4 opacity-30" style={{ width: `${40 + ((i * 17) % 55)}%` }} />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <EmptyState icon={<ScrollText size={22} />} title="Chưa có log" description="Bot gửi log qua /write-log khi đang chạy. Kiểm tra SAVE_BOT_LOGS=true trong .env của API." />
          ) : (
            logs.map((l) => (
              <div key={l.id} className="group flex gap-3 rounded-md px-3 py-1 hover:bg-white/[0.04]">
                <span className="num shrink-0 text-[#5d6679]">{dateTimeVN(l.createdDt)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAccount(l.account);
                    const f = { ...applied, account: l.account };
                    setApplied(f);
                    load(0, size, f);
                  }}
                  className="num shrink-0 font-semibold text-[#e5b555] hover:underline"
                  title="Lọc theo tài khoản này"
                >
                  {l.account}
                </button>
                <span className={cn("whitespace-pre-wrap break-words", lineTone(l.logs))}>{l.logs}</span>
              </div>
            ))
          )}
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={total}
          unit="dòng log"
          sizes={[50, 100, 200]}
          disabled={loading}
          onPage={(p) => load(p, size, applied)}
          onSize={(s) => load(0, s, applied)}
        />
      </Card>
      <p className="mt-3 text-xs text-subtle">
        Tổng {num(total, 0)} dòng phù hợp. Bấm vào số tài khoản trong log để lọc nhanh.
      </p>
    </div>
  );
}
