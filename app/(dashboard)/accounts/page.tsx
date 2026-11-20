"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarClock,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldBan,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useSession } from "@/components/providers/SessionProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Money from "@/components/ui/Money";
import PageHeader from "@/components/ui/PageHeader";
import Pagination from "@/components/ui/Pagination";
import Segmented from "@/components/ui/Segmented";
import { EmptyState, ErrorBanner, SkeletonRows } from "@/components/ui/States";
import { useToast } from "@/components/ui/Toast";
import { isAdmin } from "@/lib/auth";
import { errorMessage } from "@/lib/axios";
import { ROLE_LABEL, ROLE_OPTIONS } from "@/lib/constants";
import { dateTimeVN, dateVN, money, num, percent, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  blockAccount,
  createAccount,
  getAccounts,
  renewAccount,
  unblockAccount,
  updateAccount,
} from "@/services/account.service";
import type { AccountForm, AccountListResponse } from "@/types/api";

type ModalKind = "detail" | "block" | "renew" | "edit" | "create" | null;

const STATUS_TABS = [
  { value: "", label: "Tất cả" },
  { value: "01", label: "Hoạt động" },
  { value: "00", label: "Đã khóa" },
];

const RENEW_PRESETS = [7, 30, 90, 180, 365];

function LicenseCell({ days, expired }: { days: number; expired?: string | null }) {
  const tone = days <= 0 ? "text-down" : days <= 7 ? "text-down" : days <= 30 ? "text-warn" : "text-up";
  const bar = days <= 0 ? "bg-down" : days <= 7 ? "bg-down" : days <= 30 ? "bg-warn" : "bg-up";
  const pct = Math.max(4, Math.min(100, (days / 90) * 100));
  return (
    <div className="w-28">
      <p className={cn("text-[13px] font-semibold", tone)}>{days <= 0 ? "Đã hết hạn" : `Còn ${days} ngày`}</p>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-elev">
        <div className={cn("h-full rounded-full", bar)} style={{ width: days <= 0 ? "100%" : `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-subtle">{expired ? dateVN(expired) : "Chưa có license"}</p>
    </div>
  );
}

function BotCell({ status, online }: { status?: string; online?: string | null }) {
  const on = status === "ONLINE";
  return (
    <div>
      <Badge tone={on ? "up" : "neutral"} dot pulse={on}>
        {on ? "Online" : "Offline"}
      </Badge>
      <p className="mt-1 text-[11px] text-subtle">{timeAgo(online)}</p>
    </div>
  );
}

export default function AccountsPage() {
  const toast = useToast();
  const { user } = useSession();
  const admin = isAdmin(user);

  const [accounts, setAccounts] = useState<AccountListResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [roleType, setRoleType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState<AccountListResponse | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState("30");
  const [form, setForm] = useState<AccountForm>({});

  const load = useCallback(
    async (p: number, s: number, kw: string, st: string, rt: string) => {
      setLoading(true);
      setError("");
      try {
        const data = await getAccounts(p, s, kw, { status: st, roleType: rt });
        setAccounts(data.content || []);
        setPage(data.number ?? p);
        setSize(data.size ?? s);
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      } catch (e) {
        setAccounts([]);
        setTotalPages(0);
        setTotalElements(0);
        setError(await errorMessage(e, "Không thể tải danh sách tài khoản."));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(0, 10, "", "", "");
  }, [load]);

  const reload = () => load(page, size, keyword, status, roleType);

  const search = (e?: FormEvent) => {
    e?.preventDefault();
    setKeyword(query.trim());
    load(0, size, query.trim(), status, roleType);
  };

  const close = () => {
    if (busy) return;
    setModal(null);
    setSelected(null);
  };

  const open = (kind: ModalKind, account: AccountListResponse | null) => {
    setSelected(account);
    setModal(kind);
    if (kind === "renew") setDays("30");
    if (kind === "edit" && account) {
      setForm({
        fullname: account.fullname ?? "",
        phone: account.phone ?? "",
        email: account.email ?? "",
        typeMoney: account.typeMoney ?? "USC",
        role: account.role ?? "03",
      });
    }
    if (kind === "create") setForm({ role: "03", typeMoney: "USC", licenseDays: 30 });
  };

  const run = async (fn: () => Promise<unknown>, ok: string, fail: string) => {
    setBusy(true);
    try {
      await fn();
      toast.success(ok);
      setModal(null);
      setSelected(null);
      await reload();
    } catch (e) {
      toast.error(await errorMessage(e, fail));
    } finally {
      setBusy(false);
    }
  };

  const renewDays = Number(days);
  const renewPreview = useMemo(() => {
    if (!selected || !Number.isFinite(renewDays) || renewDays <= 0) return null;
    const now = Date.now();
    const cur = selected.licenseExpiredDt ? new Date(selected.licenseExpiredDt).getTime() : 0;
    const base = cur > now ? cur : now;
    return new Date(base + renewDays * 86400000);
  }, [selected, renewDays]);

  const pageStats = useMemo(() => {
    const online = accounts.filter((a) => a.botStatus === "ONLINE").length;
    const balance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0);
    return { online, balance };
  }, [accounts]);

  return (
    <div>
      <PageHeader
        eyebrow="Quản lý"
        title="Tài khoản"
        description="Tìm kiếm, khóa / mở khóa, gia hạn license và tạo mới tài khoản MT5."
      >
        <Button variant="secondary" size="icon" onClick={reload} title="Làm mới" disabled={loading}>
          <RefreshCw size={16} className={cn(loading && "animate-spin")} />
        </Button>
        <Button variant="gold" icon={<Plus size={16} />} onClick={() => open("create", null)}>
          Thêm tài khoản
        </Button>
      </PageHeader>

      {error && <ErrorBanner message={error} onClose={() => setError("")} />}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-gold">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-muted">Tổng theo bộ lọc</p>
            <p className="num text-xl font-semibold text-fg">{num(totalElements, 0)}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-up-soft text-up">
            <span className="h-2.5 w-2.5 rounded-full bg-up pulse-dot" />
          </div>
          <div>
            <p className="text-xs text-muted">Bot online (trang này)</p>
            <p className="num text-xl font-semibold text-fg">
              {pageStats.online}
              <span className="text-sm text-subtle"> / {accounts.length}</span>
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-soft text-info">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-xs text-muted">Số dư (trang này)</p>
            <p className="num text-xl font-semibold text-fg">{money(pageStats.balance)}</p>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 xl:flex-row xl:items-center xl:justify-between">
          <Segmented
            value={status}
            options={STATUS_TABS}
            onChange={(v) => {
              setStatus(v);
              load(0, size, keyword, v, roleType);
            }}
          />
          <form onSubmit={search} className="flex flex-col gap-2 sm:flex-row">
            {admin && (
              <Select
                value={roleType}
                onChange={(e) => {
                  setRoleType(e.target.value);
                  load(0, size, keyword, status, e.target.value);
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
              placeholder="Số tài khoản hoặc họ tên..."
              wrapperClassName="sm:w-72"
            />
            <Button type="submit" variant="primary" disabled={loading}>
              Tìm kiếm
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-elev/60 text-[11px] uppercase tracking-wider text-subtle">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Tài khoản</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Bot</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Số dư</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Lợi nhuận</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Hiệu suất</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">License</th>
                <th className="whitespace-nowrap px-4 py-3 font-medium">Trạng thái</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading ? (
                <SkeletonRows rows={Math.min(size, 8)} cols={8} />
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="Không tìm thấy tài khoản"
                      description="Thử đổi từ khóa hoặc bộ lọc trạng thái."
                      action={
                        <Button variant="gold" size="sm" icon={<UserPlus size={14} />} onClick={() => open("create", null)}>
                          Thêm tài khoản
                        </Button>
                      }
                    />
                  </td>
                </tr>
              ) : (
                accounts.map((a) => {
                  const locked = a.status === "00";
                  const wr = Number(a.winRate ?? 0);
                  return (
                    <tr key={a.account} className="group transition hover:bg-elev/50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-elev text-[11px] font-bold text-gold ring-1 ring-line">
                            {(a.fullname || a.account).trim().charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="num font-semibold text-fg">{a.account}</p>
                            <p className="truncate text-xs text-muted">{a.fullname || "—"}</p>
                            <div className="mt-1 flex gap-1">
                              {a.role && (
                                <Badge tone={a.role === "02" ? "info" : "gold"} className="px-2 py-0.5 text-[10px]">
                                  {ROLE_LABEL[a.role] || a.role}
                                </Badge>
                              )}
                              {a.typeMoney && (
                                <Badge tone="neutral" className="px-2 py-0.5 text-[10px]">
                                  {a.typeMoney}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <BotCell status={a.botStatus} online={a.onlineDate} />
                      </td>
                      <td className="num px-4 py-4 text-right font-semibold text-fg">{money(a.balance)}</td>
                      <td className="px-4 py-4 text-right">
                        <Money value={a.profit} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="num font-semibold text-fg">{percent(wr, 2)}</span>
                            <span className="num text-subtle">
                              {num(a.winTrades ?? 0, 0)}/{num(a.totalTrades ?? 0, 0)} lệnh
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-down/25">
                            <div className="h-full rounded-full bg-up" style={{ width: `${Math.min(100, wr)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <LicenseCell days={Number(a.remainingDays ?? 0)} expired={a.licenseExpiredDt} />
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={locked ? "down" : "up"} dot>
                          {locked ? "Bị khóa" : "Hoạt động"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <IconAction title="Chi tiết" onClick={() => open("detail", a)}>
                            <Eye size={16} />
                          </IconAction>
                          <IconAction title="Sửa thông tin" onClick={() => open("edit", a)}>
                            <Pencil size={16} />
                          </IconAction>
                          <IconAction title="Gia hạn license" onClick={() => open("renew", a)} tone="gold">
                            <CalendarClock size={16} />
                          </IconAction>
                          <IconAction
                            title={locked ? "Mở khóa" : "Khóa tài khoản"}
                            onClick={() => open("block", a)}
                            tone={locked ? "up" : "down"}
                          >
                            {locked ? <ShieldCheck size={16} /> : <ShieldBan size={16} />}
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          unit="tài khoản"
          disabled={loading}
          onPage={(p) => load(p, size, keyword, status, roleType)}
          onSize={(s) => load(0, s, keyword, status, roleType)}
        />
      </Card>

      {/* ================= DETAIL ================= */}
      <Modal
        open={modal === "detail" && !!selected}
        onClose={close}
        title={`Tài khoản ${selected?.account ?? ""}`}
        subtitle={selected?.fullname || undefined}
        icon={<Users size={18} />}
        footer={
          <>
            <Button variant="secondary" onClick={close}>
              Đóng
            </Button>
            {selected && (
              <Link href={`/reports/accounts/${encodeURIComponent(selected.account)}`}>
                <Button variant="gold" icon={<BarChart3 size={15} />}>
                  Xem giao dịch
                </Button>
              </Link>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Info label="Số dư" value={<span className="num">{money(selected.balance)}</span>} />
              <Info label="Lợi nhuận" value={<Money value={selected.profit} />} />
              <Info label="Giao dịch" value={<span className="num">{num(selected.totalTrades, 0)}</span>} />
              <Info label="Win rate" value={<span className="num">{percent(selected.winRate, 2)}</span>} />
            </div>
            <div className="divide-y divide-line rounded-xl border border-line">
              <Row k="Loại tài khoản" v={ROLE_LABEL[selected.role || ""] || "—"} />
              <Row k="Loại tiền" v={selected.typeMoney || "—"} />
              <Row k="Trạng thái" v={selected.status === "00" ? "Bị khóa" : "Đang hoạt động"} />
              <Row k="Bot" v={`${selected.botStatus === "ONLINE" ? "Online" : "Offline"} · ${timeAgo(selected.onlineDate)}`} />
              <Row k="License" v={`${Number(selected.remainingDays) > 0 ? `Còn ${selected.remainingDays} ngày` : "Đã hết hạn"} · ${dateVN(selected.licenseExpiredDt)}`} />
              <Row k="Số điện thoại" v={selected.phone || "—"} />
              <Row k="Email" v={selected.email || "—"} />
              <Row k="Người tạo" v={selected.createdBy || "—"} />
              <Row k="Ngày tạo" v={dateTimeVN(selected.createdDt)} />
            </div>
          </div>
        )}
      </Modal>

      {/* ================= BLOCK / UNBLOCK ================= */}
      <Modal
        open={modal === "block" && !!selected}
        onClose={close}
        locked={busy}
        size="sm"
        title={selected?.status === "00" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
        icon={selected?.status === "00" ? <ShieldCheck size={18} /> : <ShieldBan size={18} />}
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={busy}>
              Hủy
            </Button>
            {selected?.status === "00" ? (
              <Button
                variant="success"
                loading={busy}
                onClick={() =>
                  run(() => unblockAccount(selected.account), `Đã mở khóa ${selected.account}`, "Không thể mở khóa tài khoản.")
                }
              >
                Mở khóa
              </Button>
            ) : (
              <Button
                variant="danger"
                loading={busy}
                onClick={() =>
                  selected &&
                  run(() => blockAccount(selected.account), `Đã khóa ${selected.account}`, "Không thể khóa tài khoản.")
                }
              >
                Khóa tài khoản
              </Button>
            )}
          </>
        }
      >
        <p className="text-sm leading-6 text-muted">
          {selected?.status === "00" ? (
            <>
              Tài khoản <b className="num text-fg">{selected?.account}</b> đang bị khóa. Mở khóa để bot đăng nhập và giao dịch trở lại.
            </>
          ) : (
            <>
              Tài khoản <b className="num text-fg">{selected?.account}</b> sẽ bị khóa. Bot trên VPS sẽ{" "}
              <b className="text-down">không đăng nhập được</b> cho tới khi mở khóa.
            </>
          )}
        </p>
      </Modal>

      {/* ================= RENEW ================= */}
      <Modal
        open={modal === "renew" && !!selected}
        onClose={close}
        locked={busy}
        title="Gia hạn license"
        subtitle={`Tài khoản ${selected?.account ?? ""}`}
        icon={<CalendarClock size={18} />}
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={busy}>
              Hủy
            </Button>
            <Button
              variant="gold"
              loading={busy}
              disabled={!Number.isFinite(renewDays) || renewDays <= 0}
              onClick={() =>
                selected &&
                run(
                  () => renewAccount(selected.account, renewDays),
                  `Đã gia hạn ${renewDays} ngày cho ${selected.account}`,
                  "Không thể gia hạn tài khoản."
                )
              }
            >
              Gia hạn {Number.isFinite(renewDays) && renewDays > 0 ? `${renewDays} ngày` : ""}
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Info
                label="Hết hạn hiện tại"
                value={selected.licenseExpiredDt ? dateVN(selected.licenseExpiredDt) : "Chưa có"}
                sub={Number(selected.remainingDays) > 0 ? `Còn ${selected.remainingDays} ngày` : "Đã hết hạn"}
              />
              <Info
                label="Sau khi gia hạn"
                value={<span className="text-gold-gradient">{renewPreview ? dateVN(renewPreview) : "—"}</span>}
                sub="Tài khoản sẽ được mở khóa"
              />
            </div>
            <Field label="Số ngày gia hạn">
              <Input type="number" min={1} max={3650} value={days} onChange={(e) => setDays(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              {RENEW_PRESETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(String(d))}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                    days === String(d) ? "border-gold/50 bg-gold-soft text-gold" : "border-line text-muted hover:bg-elev"
                  )}
                >
                  {d === 365 ? "1 năm" : `${d} ngày`}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* ================= CREATE / EDIT ================= */}
      <Modal
        open={modal === "create" || (modal === "edit" && !!selected)}
        onClose={close}
        locked={busy}
        size="lg"
        title={modal === "create" ? "Thêm tài khoản MT5" : `Sửa tài khoản ${selected?.account ?? ""}`}
        subtitle={modal === "create" ? "Bot đăng nhập bằng số tài khoản MT5, không cần mật khẩu." : undefined}
        icon={modal === "create" ? <UserPlus size={18} /> : <Pencil size={18} />}
        footer={
          <>
            <Button variant="secondary" onClick={close} disabled={busy}>
              Hủy
            </Button>
            <Button
              variant="gold"
              loading={busy}
              onClick={() => {
                if (modal === "create") {
                  if (!form.username?.trim()) {
                    toast.error("Vui lòng nhập số tài khoản MT5.");
                    return;
                  }
                  run(() => createAccount(form), `Đã tạo tài khoản ${form.username}`, "Không thể tạo tài khoản.");
                } else if (selected) {
                  run(() => updateAccount(selected.account, form), "Đã lưu thay đổi", "Không thể cập nhật tài khoản.");
                }
              }}
            >
              {modal === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {modal === "create" && (
            <Field label="Số tài khoản MT5 *">
              <Input
                value={form.username ?? ""}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="VD: 123456789"
                autoFocus
              />
            </Field>
          )}
          <Field label="Họ và tên">
            <Input value={form.fullname ?? ""} onChange={(e) => setForm({ ...form, fullname: e.target.value })} placeholder="Nguyễn Văn A" />
          </Field>
          {(admin || modal === "create") && (
            <Field label="Loại tài khoản" hint={!admin ? "Sale chỉ tạo được tài khoản khách hàng" : undefined}>
              <Select value={form.role ?? "03"} disabled={!admin} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="03">Khách hàng</option>
                <option value="02">Tự doanh</option>
                {admin && modal === "create" && <option value="01">Sale (đăng nhập web)</option>}
              </Select>
            </Field>
          )}
          <Field label="Loại tiền" hint="USD sẽ quy đổi x100 sang USC trong báo cáo">
            <Select value={form.typeMoney ?? "USC"} onChange={(e) => setForm({ ...form, typeMoney: e.target.value })}>
              <option value="USC">USC (tài khoản cent)</option>
              <option value="USD">USD</option>
            </Select>
          </Field>
          {modal === "create" && (
            <Field label="License ban đầu (ngày)">
              <Input
                type="number"
                min={0}
                max={3650}
                value={form.licenseDays ?? 0}
                onChange={(e) => setForm({ ...form, licenseDays: Number(e.target.value) })}
              />
            </Field>
          )}
          <Field label="Số điện thoại">
            <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09xx xxx xxx" />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@domain.com" />
          </Field>
          {(form.role === "01" || modal === "edit") && (
            <Field
              label={form.role === "01" ? "Mật khẩu đăng nhập web *" : "Đặt lại mật khẩu"}
              hint={modal === "edit" ? "Để trống nếu không đổi" : "Tối thiểu 6 ký tự"}
            >
              <Input type="password" value={form.password ?? ""} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Field>
          )}
        </div>
      </Modal>
    </div>
  );
}

function IconAction({
  title,
  onClick,
  children,
  tone,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  tone?: "gold" | "up" | "down";
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition hover:bg-elev",
        tone === "gold" && "hover:text-gold",
        tone === "up" && "hover:text-up",
        tone === "down" && "hover:text-down",
        !tone && "hover:text-fg"
      )}
    >
      {children}
    </button>
  );
}

function Info({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="rounded-xl bg-elev p-4">
      <p className="text-[11px] text-subtle">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-fg">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium text-fg">{v}</span>
    </div>
  );
}
