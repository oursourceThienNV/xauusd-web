"use client";

import Link from "next/link";
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  Search,
  TrendingDown,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";

import {
  getAccountReports,
  type AccountReportResponse,
} from "@/services/report.service";


// =========================================================
// DEFAULT
// =========================================================

const DEFAULT_FROM = "2026-08-01";
const DEFAULT_TO = "2026-08-24";


// =========================================================
// MONEY
// =========================================================

function money(value: number | null | undefined) {
  return `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}


// =========================================================
// PAGE
// =========================================================

export default function ReportsPage() {

  console.log("REPORTS PAGE RENDER");


  // =======================================================
  // FILTER
  // =======================================================

  const [accountFilter, setAccountFilter] = useState("");

  const [from, setFrom] = useState(DEFAULT_FROM);

  const [to, setTo] = useState(DEFAULT_TO);


  // =======================================================
  // FILTER ĐÃ THỰC HIỆN SEARCH
  // =======================================================

  const [searchedAccount, setSearchedAccount] = useState("");

  const [searchedFrom, setSearchedFrom] =
    useState(DEFAULT_FROM);

  const [searchedTo, setSearchedTo] =
    useState(DEFAULT_TO);


  // =======================================================
  // DATA
  // =======================================================

  const [rows, setRows] =
    useState<AccountReportResponse[]>([]);


  // =======================================================
  // PAGINATION
  // =======================================================

  const [page, setPage] = useState(0);

  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);


  // =======================================================
  // LOADING
  // =======================================================

  const [loading, setLoading] = useState(false);


  // =======================================================
  // ERROR
  // =======================================================

  const [error, setError] = useState("");


  // =======================================================
  // LOAD REPORT
  // =======================================================

  async function loadReports(
    targetPage: number,
    keyword: string,
    dateFrom: string,
    dateTo: string
  ) {

    console.log("GET REPORT ACCOUNTS:", {
      page: targetPage,
      size,
      keyword,
      from: dateFrom,
      to: dateTo,
    });


    try {

      setLoading(true);
      setError("");


      const response = await getAccountReports(
        targetPage,
        size,
        keyword,
        dateFrom,
        dateTo
      );


      console.log(
        "GET REPORT ACCOUNTS RESPONSE:",
        response
      );


      setRows(
        response?.content || []
      );


      setPage(
        response?.number ?? targetPage
      );


      setTotalPages(
        response?.totalPages ?? 0
      );


      setTotalElements(
        response?.totalElements ?? 0
      );


    } catch (err: any) {

      console.error(
        "REPORT API ERROR:",
        err
      );


      console.error(
        "REPORT API RESPONSE:",
        err?.response?.data
      );


      setRows([]);

      setTotalPages(0);

      setTotalElements(0);


      setError(
        err?.response?.data?.message ||
        "Không thể tải báo cáo."
      );


    } finally {

      setLoading(false);

    }
  }


  // =======================================================
  // ⭐ QUAN TRỌNG
  // VỪA VÀO /reports -> GỌI API NGAY
  // =======================================================

  useEffect(() => {

    console.log(
      "===================================="
    );

    console.log(
      "REPORT PAGE MOUNTED"
    );

    console.log(
      "AUTO LOAD REPORT API"
    );

    console.log(
      "===================================="
    );


    // Đồng bộ filter hiển thị
    setSearchedAccount("");

    setSearchedFrom(
      DEFAULT_FROM
    );

    setSearchedTo(
      DEFAULT_TO
    );


    // GỌI API NGAY
    loadReports(
      0,
      "",
      DEFAULT_FROM,
      DEFAULT_TO
    );

  }, []);


  // =======================================================
  // SEARCH
  // =======================================================

  async function handleSearch() {

    console.log(
      "SEARCH REPORT:",
      {
        account: accountFilter,
        from,
        to,
      }
    );


    if (!from || !to) {

      setError(
        "Vui lòng chọn khoảng thời gian."
      );

      return;
    }


    if (from > to) {

      setError(
        "Ngày bắt đầu không được lớn hơn ngày kết thúc."
      );

      return;
    }


    setSearchedAccount(
      accountFilter
    );

    setSearchedFrom(
      from
    );

    setSearchedTo(
      to
    );


    await loadReports(
      0,
      accountFilter,
      from,
      to
    );
  }


  // =======================================================
  // PAGINATION
  // =======================================================

  async function handlePageChange(
    newPage: number
  ) {

    console.log(
      "CHANGE PAGE:",
      newPage
    );


    if (newPage < 0) {
      return;
    }


    if (
      totalPages > 0 &&
      newPage >= totalPages
    ) {
      return;
    }


    await loadReports(
      newPage,
      searchedAccount,
      searchedFrom,
      searchedTo
    );
  }


  // =======================================================
  // STATISTICS
  // =======================================================

  const totalBalance =
    rows.reduce(
      (sum, account) =>
        sum + Number(
          account.balance || 0
        ),
      0
    );


  const totalProfit =
    rows.reduce(
      (sum, account) =>
        sum + Number(
          account.profit || 0
        ),
      0
    );


  const totalTrades =
    rows.reduce(
      (sum, account) =>
        sum + Number(
          account.totalTrades || 0
        ),
      0
    );


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="mx-auto max-w-[1500px]">


      {/* ===================================================
          HEADER
      =================================================== */}

      <PageHeader
        title="Báo cáo thống kê"
        description="Theo dõi số dư và hiệu quả giao dịch theo tài khoản"
      >

        <div className="flex items-center gap-2 text-xs text-slate-400">

          <CalendarDays size={15} />

          {searchedFrom}
          {" → "}
          {searchedTo}

        </div>

      </PageHeader>


      {/* ===================================================
          FILTER
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">


          {/* ACCOUNT */}

          <div className="relative">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />

            <input
              value={accountFilter}
              onChange={(e) =>
                setAccountFilter(
                  e.target.value
                )
              }
              placeholder="Tìm tài khoản..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />

          </div>


          {/* FROM */}

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(
                e.target.value
              )
            }
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
          />


          {/* TO */}

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(
                e.target.value
              )
            }
            className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
          />


          {/* SEARCH */}

          <button
            type="button"
            disabled={loading}
            onClick={handleSearch}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (

              <Loader2
                size={16}
                className="animate-spin"
              />

            ) : (

              <Search size={16} />

            )}

            Tìm kiếm

          </button>

        </div>

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

          {error}

        </div>

      )}


      {/* ===================================================
          STAT
      =================================================== */}

      <div className="mt-5 grid gap-4 md:grid-cols-3">


        <StatCard
          label="Số dư hiện tại"
          value={money(totalBalance)}
          sub={`Đang hiển thị ${rows.length} tài khoản`}
          icon={BarChart3}
        />


        <StatCard
          label="Lợi nhuận trong kỳ"
          value={money(totalProfit)}
          sub={`${searchedFrom} → ${searchedTo}`}
          positive={
            totalProfit >= 0
          }
          icon={
            totalProfit >= 0
              ? TrendingUp
              : TrendingDown
          }
        />


        <StatCard
          label="Tổng giao dịch"
          value={String(totalTrades)}
          sub={`Tổng ${totalElements} tài khoản`}
          icon={CalendarDays}
        />

      </div>


      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">


        {/* TABLE HEADER */}

        <div className="border-b border-slate-100 px-5 py-4">

          <h3 className="font-semibold text-slate-900">
            Thống kê theo tài khoản
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Bấm vào tài khoản để xem toàn bộ giao dịch
            trong khoảng thời gian đã chọn.
          </p>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">

              <tr>

                <th className="px-5 py-3 font-medium">
                  Tài khoản
                </th>

                <th className="px-5 py-3 font-medium">
                  Trạng thái
                </th>

                <th className="px-5 py-3 font-medium">
                  Số dư hiện tại
                </th>

                <th className="px-5 py-3 font-medium">
                  Lợi nhuận
                </th>

                <th className="px-5 py-3 font-medium">
                  Win Rate
                </th>

                <th className="px-5 py-3 font-medium">
                  Giao dịch
                </th>

                <th className="px-5 py-3 font-medium">
                  License
                </th>

                <th className="px-5 py-3 font-medium">
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">


              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-slate-400"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Đang tải báo cáo...

                    </div>

                  </td>

                </tr>

              ) : rows.length === 0 ? (

                /* EMPTY */

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-14 text-center text-slate-400"
                  >

                    Không có tài khoản có giao dịch
                    trong khoảng thời gian này.

                  </td>

                </tr>

              ) : (

                /* DATA */

                rows.map(
                  (account) => (

                    <tr
                      key={account.account}
                      className="hover:bg-slate-50"
                    >


                      {/* ACCOUNT */}

                      <td className="px-5 py-4">

                        <div className="font-semibold text-slate-800">

                          {account.account}

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {account.status === "01" ? (

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">

                            Đang hoạt động

                          </span>

                        ) : (

                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">

                            Bị khóa

                          </span>

                        )}

                      </td>


                      {/* BALANCE */}

                      <td className="px-5 py-4 font-medium text-slate-800">

                        {money(
                          account.balance
                        )}

                      </td>


                      {/* PROFIT */}

                      <td
                        className={`px-5 py-4 font-semibold ${
                          Number(
                            account.profit || 0
                          ) >= 0
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >

                        {money(
                          account.profit
                        )}

                      </td>


                      {/* WIN RATE */}

                      <td className="px-5 py-4 text-slate-600">

                        {Number(
                          account.winRate || 0
                        ).toFixed(1)}
                        %

                      </td>


                      {/* TRADES */}

                      <td className="px-5 py-4 text-slate-600">

                        {account.totalTrades}

                      </td>


                      {/* LICENSE */}

                      <td className="px-5 py-4">

                        {account.remainingDays !== undefined ? (

                          <div>

                            <div
                              className={`font-medium ${
                                account.remainingDays <= 0
                                  ? "text-red-500"
                                  : account.remainingDays <= 7
                                    ? "text-amber-600"
                                    : "text-slate-700"
                              }`}
                            >

                              {account.remainingDays <= 0
                                ? "Đã hết hạn"
                                : `Còn ${account.remainingDays} ngày`}

                            </div>


                            {account.licenseExpiredDt && (

                              <div className="mt-0.5 text-[11px] text-slate-400">

                                {new Date(
                                  account.licenseExpiredDt
                                ).toLocaleDateString(
                                  "vi-VN"
                                )}

                              </div>

                            )}

                          </div>

                        ) : (

                          "-"

                        )}

                      </td>


                      {/* DETAIL */}

                      <td className="px-5 py-4">

                        <Link
                          href={`/reports/accounts/${encodeURIComponent(
                            account.account
                          )}?from=${searchedFrom}&to=${searchedTo}`}
                          className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                        >

                          Chi tiết

                          <ChevronRight
                            size={14}
                          />

                        </Link>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* ===================================================
            PAGINATION
        =================================================== */}

        {totalPages > 0 && (

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">


            <div className="text-sm text-slate-500">

              Tổng{" "}

              <span className="font-medium text-slate-700">

                {totalElements}

              </span>

              {" "}tài khoản

            </div>


            <div className="flex items-center gap-2">


              {/* PREVIOUS */}

              <button
                type="button"
                disabled={
                  loading ||
                  page === 0
                }
                onClick={() =>
                  handlePageChange(
                    page - 1
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >

                Trước

              </button>


              {/* PAGE */}

              <div className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">

                {page + 1}
                {" / "}
                {totalPages}

              </div>


              {/* NEXT */}

              <button
                type="button"
                disabled={
                  loading ||
                  page >= totalPages - 1
                }
                onClick={() =>
                  handlePageChange(
                    page + 1
                  )
                }
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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