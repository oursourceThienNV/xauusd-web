"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Search,
  TrendingDown,
  TrendingUp,
  Loader2,
} from "lucide-react";

import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";

import { useEffect, useState } from "react";

import StatCard from "@/components/ui/StatCard";

import {
  getAccountReports,
  getTradeReports,
  type AccountReportResponse,
  type TradeReportResponse,
} from "@/services/report.service";


// =========================================================
// MONEY
// =========================================================

function money(value: number | null | undefined) {
  return `$${Number(value || 0).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDateTime(
  value: string | null | undefined
) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
}


// =========================================================
// PAGE
// =========================================================

export default function AccountReportDetailPage() {

  const params =
    useParams<{ accountNumber: string }>();

  const searchParams =
    useSearchParams();

  const router = useRouter();


  // =======================================================
  // ACCOUNT
  // =======================================================

  const accountNumber =
    params.accountNumber;


  // =======================================================
  // DATE
  // =======================================================

  const [from, setFrom] =
    useState(
      searchParams.get("from")
      || "2026-08-01"
    );

  const [to, setTo] =
    useState(
      searchParams.get("to")
      || "2026-08-24"
    );


  // =======================================================
  // SEARCH
  // =======================================================

  const [query, setQuery] =
    useState("");


  // =======================================================
  // ACCOUNT
  // =======================================================

  const [account, setAccount] =
    useState<AccountReportResponse | null>(
      null
    );


  // =======================================================
  // TRADES
  // =======================================================

  const [trades, setTrades] =
    useState<TradeReportResponse[]>(
      []
    );


  // =======================================================
  // PAGINATION
  // =======================================================

  const [page, setPage] =
    useState(0);

  const [size] =
    useState(20);

  const [totalPages, setTotalPages] =
    useState(0);

  const [totalElements, setTotalElements] =
    useState(0);


  // =======================================================
  // LOADING
  // =======================================================

  const [loadingAccount, setLoadingAccount] =
    useState(false);

  const [loadingTrades, setLoadingTrades] =
    useState(false);


  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] =
    useState("");


  // =======================================================
  // LOAD ACCOUNT
  // =======================================================

  async function loadAccount() {

    if (!accountNumber) {
      return;
    }

    try {

      setLoadingAccount(true);
      setError("");

      const response =
        await getAccountReports(
          0,
          100,
          accountNumber,
          from,
          to
        );


      const found =
        response.content.find(
          item =>
            item.account === accountNumber
        );


      if (!found) {

        setAccount(null);

      } else {

        setAccount(found);

      }

    } catch (error: any) {

      console.error(
        "ACCOUNT REPORT ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message
        || "Không thể tải thông tin tài khoản."
      );

    } finally {

      setLoadingAccount(false);

    }
  }


  // =======================================================
  // LOAD TRADES
  // =======================================================

  async function loadTrades(
    targetPage: number = page
  ) {

    if (!accountNumber) {
      return;
    }

    try {

      setLoadingTrades(true);
      setError("");

      const response =
        await getTradeReports(
          accountNumber,
          targetPage,
          size,
          query,
          from,
          to
        );


      setTrades(
        response.content
      );


      setTotalPages(
        response.totalPages
      );


      setTotalElements(
        response.totalElements
      );


    } catch (error: any) {

      console.error(
        "TRADE REPORT ERROR:",
        error
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

      setError(
        error?.response?.data?.message
        || "Không thể tải danh sách giao dịch."
      );

    } finally {

      setLoadingTrades(false);

    }
  }


  // =======================================================
  // LOAD ACCOUNT + TRADES
  // =======================================================

  useEffect(() => {

    loadAccount();

  }, [
    accountNumber,
    from,
    to
  ]);


  useEffect(() => {

    loadTrades(page);

  }, [
    accountNumber,
    page,
    from,
    to,
    query
  ]);


  // =======================================================
  // DATE CHANGE
  // =======================================================

  function handleFromChange(
    value: string
  ) {

    setFrom(value);
    setPage(0);
  }


  function handleToChange(
    value: string
  ) {

    setTo(value);
    setPage(0);
  }


  // =======================================================
  // SEARCH
  // =======================================================

  function handleSearch(
    value: string
  ) {

    setQuery(value);
    setPage(0);
  }


  // =======================================================
  // PAGE CHANGE
  // =======================================================

  function handlePageChange(
    newPage: number
  ) {

    if (
      newPage < 0 ||
      newPage >= totalPages
    ) {
      return;
    }

    setPage(newPage);
  }


  // =======================================================
  // LOADING ACCOUNT
  // =======================================================

  if (
    loadingAccount &&
    !account
  ) {

    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Loader2
            size={18}
            className="animate-spin"
          />

          Đang tải thông tin tài khoản...

        </div>

      </div>
    );
  }


  // =======================================================
  // ACCOUNT NOT FOUND
  // =======================================================

  if (!account) {

    return (

      <div className="mx-auto max-w-[1500px]">

        <Link
          href="/reports"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >

          <ArrowLeft size={16} />

          Quay lại báo cáo

        </Link>


        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500">

          {error ||
            "Không tìm thấy tài khoản."}

        </div>

      </div>

    );
  }


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="mx-auto max-w-[1500px]">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="mb-6">

        <Link
          href="/reports"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
        >

          <ArrowLeft size={16} />

          Quay lại báo cáo

        </Link>


        <div className="mt-4 flex flex-col justify-between gap-3 md:flex-row md:items-end">

          <div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">

              Tài khoản {account.account}

            </h1>


            <p className="mt-1 text-sm text-slate-500">

              Khoảng thời gian báo cáo:
              {" "}
              {from}
              {" → "}
              {to}

            </p>

          </div>


          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">

            <CalendarDays size={15} />

            {from}
            {" → "}
            {to}

          </div>

        </div>

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          {error}

        </div>

      )}


      {/* ===================================================
          STAT CARDS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-4">


        <StatCard
          label="Số dư hiện tại"
          value={money(account.balance)}
          icon={CalendarDays}
        />


        <StatCard
          label="Lợi nhuận"
          value={money(account.profit)}
          positive={account.profit >= 0}
          icon={
            account.profit >= 0
              ? TrendingUp
              : TrendingDown
          }
        />


        <StatCard
          label="Giao dịch"
          value={String(
            account.totalTrades
          )}
          icon={CalendarDays}
        />


        <StatCard
          label="Win Rate"
          value={`${Number(
            account.winRate || 0
          ).toFixed(1)}%`}
          icon={TrendingUp}
        />

      </div>


      {/* ===================================================
          TRADE TABLE
      =================================================== */}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">


        {/* =================================================
            TABLE HEADER
        ================================================= */}

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">


          <div>

            <h3 className="font-semibold text-slate-900">

              Danh sách giao dịch

            </h3>


            <p className="mt-1 text-xs text-slate-400">

              Khoảng thời gian:
              {" "}
              {from}
              {" → "}
              {to}

              {" · "}

              {totalElements}
              {" giao dịch"}

            </p>

          </div>


          {/* FILTER */}

          <div className="flex flex-col gap-2 sm:flex-row">


            <input
              type="date"
              value={from}
              onChange={(e) =>
                handleFromChange(
                  e.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />


            <input
              type="date"
              value={to}
              onChange={(e) =>
                handleToChange(
                  e.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />


            <div className="relative">

              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />


              <input
                value={query}
                onChange={(e) =>
                  handleSearch(
                    e.target.value
                  )
                }
                placeholder="Ticket, type..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-44"
              />

            </div>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1450px] text-left text-sm">


            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">

              <tr>

                <th className="px-5 py-3 font-medium">
                  Ticket
                </th>

                <th className="px-5 py-3 font-medium">
                  Type
                </th>

                <th className="px-5 py-3 font-medium">
                  Lot
                </th>

                <th className="px-5 py-3 font-medium">
                  Open
                </th>

                <th className="px-5 py-3 font-medium">
                  Close
                </th>

                <th className="px-5 py-3 font-medium">
                  Open Time
                </th>

                <th className="px-5 py-3 font-medium">
                  Close Time
                </th>

                <th className="px-5 py-3 font-medium">
                  P/L
                </th>

                <th className="px-5 py-3 font-medium">
                  Result
                </th>

                <th className="px-5 py-3 font-medium">
                  Strategy
                </th>

                <th className="px-5 py-3 font-medium">
                  Multi Lot
                </th>

                <th className="px-5 py-3 font-medium">
                  RR
                </th>

                <th className="px-5 py-3 font-medium">
                  MA
                </th>

                <th className="px-5 py-3 font-medium">
                  Sideway
                </th>

                <th className="px-5 py-3 font-medium">
                  FOMO
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">


              {loadingTrades ? (

                <tr>

                  <td
                    colSpan={15}
                    className="px-5 py-12 text-center text-slate-400"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Đang tải giao dịch...

                    </div>

                  </td>

                </tr>

              ) : trades.length === 0 ? (

                <tr>

                  <td
                    colSpan={15}
                    className="px-5 py-12 text-center text-slate-400"
                  >

                    Không có giao dịch.

                  </td>

                </tr>

              ) : (

                trades.map(
                  (trade) => (

                    <tr
                      key={trade.id}
                      className="hover:bg-slate-50"
                    >


                      {/* TICKET */}

                      <td className="px-5 py-4 font-medium text-slate-700">

                        {trade.ticket}

                      </td>


                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            trade.type === "BUY"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >

                          {trade.type}

                        </span>

                      </td>


                      {/* LOT */}

                      <td className="px-5 py-4 text-slate-600">

                        {Number(
                          trade.lot || 0
                        ).toFixed(2)}

                      </td>


                      {/* OPEN */}

                      <td className="px-5 py-4 text-slate-600">

                        {Number(
                          trade.openPrice || 0
                        ).toFixed(2)}

                      </td>


                      {/* CLOSE */}

                      <td className="px-5 py-4 text-slate-600">

                        {Number(
                          trade.closePrice || 0
                        ).toFixed(2)}

                      </td>


                      {/* OPEN TIME */}

                      <td className="px-5 py-4 text-xs text-slate-500">

                        {formatDateTime(
                          trade.openTime
                        )}

                      </td>


                      {/* CLOSE TIME */}

                      <td className="px-5 py-4 text-xs text-slate-500">

                        {formatDateTime(
                          trade.closeTime
                        )}

                      </td>


                      {/* PROFIT */}

                      <td
                        className={`px-5 py-4 font-semibold ${
                          trade.profit >= 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >

                        {money(
                          trade.profit
                        )}

                      </td>


                      {/* RESULT */}

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            trade.result === "WIN"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >

                          {trade.result || "-"}

                        </span>

                      </td>


                      {/* STRATEGY */}

                      <td className="px-5 py-4 text-slate-600">

                        {trade.strategy || "-"}

                      </td>


                      {/* MULTI LOT */}

                      <td className="px-5 py-4 text-slate-600">

                        {trade.multiLot
                          ? "Có"
                          : "Không"}

                      </td>


                      {/* RR */}

                      <td className="px-5 py-4 text-slate-600">

                        {trade.rrRisk ?? "-"}
                        {" : "}
                        {trade.rrReward ?? "-"}

                      </td>


                      {/* MA */}

                      <td className="px-5 py-4 text-xs text-slate-500">

                        {trade.maFast ?? "-"}
                        {" / "}
                        {trade.maSlow ?? "-"}
                        {" / "}
                        {trade.maTrendValue ?? "-"}

                      </td>


                      {/* SIDEWAY */}

                      <td className="px-5 py-4 text-slate-600">

                        {trade.sideway
                          ? "Có"
                          : "Không"}

                      </td>


                      {/* FOMO */}

                      <td className="px-5 py-4 text-slate-600">

                        {trade.fomo
                          ? "Có"
                          : "Không"}

                      </td>


                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {totalPages > 0 && (

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">


            <div className="text-sm text-slate-500">

              Trang{" "}

              <span className="font-medium text-slate-700">

                {page + 1}

              </span>

              {" / "}

              {totalPages}

            </div>


            <div className="flex items-center gap-2">


              <button
                type="button"
                disabled={page === 0}
                onClick={() =>
                  handlePageChange(
                    page - 1
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >

                Trước

              </button>


              <button
                type="button"
                disabled={
                  page >= totalPages - 1
                }
                onClick={() =>
                  handlePageChange(
                    page + 1
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >

                Sau

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}