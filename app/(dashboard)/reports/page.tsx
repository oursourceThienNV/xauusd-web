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

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";

import {
  getAccountReports,
  exportAccountReports,
  type AccountReportResponse,
} from "@/services/report.service";


// =========================================================
// PAGE SIZE
// =========================================================

const PAGE_SIZE = 10;


// =========================================================
// GET DATE YYYY-MM-DD
// =========================================================

function formatDate(
  date: Date
): string {

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;
}


// =========================================================
// GET DEFAULT DATE RANGE
// =========================================================

function getDefaultDateRange() {

  const now =
    new Date();


  // Ngày đầu tiên của tháng hiện tại

  const firstDay =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );


  return {
    from: formatDate(
      firstDay
    ),

    to: formatDate(
      now
    ),
  };
}


// =========================================================
// MONEY
// =========================================================

function money(
  value: number | null | undefined
) {

  return `$${Number(
    value || 0
  ).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}


// =========================================================
// PAGE
// =========================================================

export default function ReportsPage() {

  // =======================================================
  // DEFAULT DATE
  // =======================================================

  const defaultDates =
    getDefaultDateRange();


  // =======================================================
  // FILTER INPUT
  // =======================================================

  const [
    accountFilter,
    setAccountFilter
  ] = useState("");


  const [
    roleType,
    setRoleType
  ] = useState("");


  const [
    from,
    setFrom
  ] = useState(
    defaultDates.from
  );


  const [
    to,
    setTo
  ] = useState(
    defaultDates.to
  );


  // =======================================================
  // SEARCHED FILTER
  // =======================================================

  const [
    searchedAccount,
    setSearchedAccount
  ] = useState("");


  const [
    searchedRoleType,
    setSearchedRoleType
  ] = useState("");


  const [
    searchedFrom,
    setSearchedFrom
  ] = useState(
    defaultDates.from
  );


  const [
    searchedTo,
    setSearchedTo
  ] = useState(
    defaultDates.to
  );


  // =======================================================
  // DATA
  // =======================================================

  const [
    rows,
    setRows
  ] = useState<
    AccountReportResponse[]
  >([]);


  // =======================================================
  // PAGINATION
  // =======================================================

  const [
    page,
    setPage
  ] = useState(0);


  const [
    totalPages,
    setTotalPages
  ] = useState(0);


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  // =======================================================
  // LOADING
  // =======================================================

  const [
    loading,
    setLoading
  ] = useState(false);
  const [
    exporting,
    setExporting
  ] = useState(false);

  // =======================================================
  // ERROR
  // =======================================================

  const [
    error,
    setError
  ] = useState("");


  // =======================================================
  // LOAD REPORT
  // =======================================================

  const loadReports =
    useCallback(
      async (
        targetPage: number,
        keyword: string,
        dateFrom: string,
        dateTo: string,
        targetRoleType: string
      ) => {

        console.log(
          "===================================="
        );

        console.log(
          "GET REPORT ACCOUNTS"
        );

        console.log({
          page: targetPage,
          size: PAGE_SIZE,
          keyword,
          from: dateFrom,
          to: dateTo,
          roleType: targetRoleType,
        });

        console.log(
          "===================================="
        );


        try {

          setLoading(true);

          setError("");


          const response =
            await getAccountReports(
              targetPage,
              PAGE_SIZE,
              keyword,
              dateFrom,
              dateTo,
              targetRoleType
            );


          console.log(
            "REPORT API SUCCESS:",
            response
          );


          setRows(
            response?.content || []
          );


          setPage(
            response?.number ??
            targetPage
          );


          setTotalPages(
            response?.totalPages ??
            0
          );


          setTotalElements(
            response?.totalElements ??
            0
          );


        } catch (
          err: any
        ) {

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

      },
      []
    );


  // =======================================================
  // AUTO SEARCH WHEN OPEN PAGE
  // =======================================================

  useEffect(() => {

    const dates =
      getDefaultDateRange();


    console.log(
      "===================================="
    );

    console.log(
      "REPORT PAGE OPENED"
    );

    console.log(
      "AUTO SEARCH"
    );

    console.log(
      "DATE RANGE:",
      dates
    );

    console.log(
      "===================================="
    );


    // Đồng bộ lại ngày mặc định

    setFrom(
      dates.from
    );

    setTo(
      dates.to
    );


    setSearchedAccount(
      ""
    );

    setSearchedRoleType(
      ""
    );

    setRoleType(
      ""
    );

    setSearchedFrom(
      dates.from
    );

    setSearchedTo(
      dates.to
    );


    // =====================================================
    // GỌI API NGAY
    // =====================================================

    loadReports(
      0,
      "",
      dates.from,
      dates.to,
      ""
    );

  }, [loadReports]);


  // =======================================================
  // SEARCH
  // =======================================================

  async function handleSearch() {

    console.log(
      "USER CLICK SEARCH"
    );


    // -----------------------------------------------------
    // VALIDATE
    // -----------------------------------------------------

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


    // -----------------------------------------------------
    // SAVE SEARCH
    // -----------------------------------------------------

    setSearchedAccount(
      accountFilter
    );

    setSearchedRoleType(
      roleType
    );

    setSearchedFrom(
      from
    );

    setSearchedTo(
      to
    );


    setPage(0);


    // -----------------------------------------------------
    // CALL API
    // -----------------------------------------------------

    await loadReports(
      0,
      accountFilter,
      from,
      to,
      roleType
    );
  }
// =======================================================
// EXPORT EXCEL
// =======================================================

async function handleExportExcel() {

  try {

    // -----------------------------------------------------
    // VALIDATE DATE
    // -----------------------------------------------------

    if (!searchedFrom || !searchedTo) {

      setError(
        "Vui lòng chọn khoảng thời gian."
      );

      return;
    }


    if (searchedFrom > searchedTo) {

      setError(
        "Ngày bắt đầu không được lớn hơn ngày kết thúc."
      );

      return;
    }


    // -----------------------------------------------------
    // START EXPORT
    // -----------------------------------------------------

    setExporting(true);

    setError("");


    // -----------------------------------------------------
    // IMPORT SERVICE
    // -----------------------------------------------------



    // -----------------------------------------------------
    // CALL API
    // -----------------------------------------------------

    const blob =
      await exportAccountReports(
        searchedFrom,
        searchedTo
      );


    // -----------------------------------------------------
    // CREATE DOWNLOAD URL
    // -----------------------------------------------------

    const url =
      window.URL.createObjectURL(
        new Blob(
          [blob],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }
        )
      );


    // -----------------------------------------------------
    // CREATE DOWNLOAD LINK
    // -----------------------------------------------------

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `bao-cao-${searchedFrom}-${searchedTo}.xlsx`;


    document.body.appendChild(link);

    link.click();

    link.remove();


    // -----------------------------------------------------
    // CLEAN URL
    // -----------------------------------------------------

    window.URL.revokeObjectURL(url);

  } catch (err: any) {

    console.error(
      "EXPORT EXCEL ERROR:",
      err
    );


    setError(
      err?.response?.data?.message ||
      "Không thể xuất báo cáo Excel."
    );

  } finally {

    setExporting(false);

  }
}

  // =======================================================
  // PAGINATION
  // =======================================================

  async function handlePageChange(
    newPage: number
  ) {

    console.log(
      "CHANGE REPORT PAGE:",
      newPage
    );


    if (
      newPage < 0
    ) {
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
      searchedTo,
      searchedRoleType
    );
  }


  // =======================================================
  // STATISTICS
  // =======================================================

  const totalBalance =
    rows.reduce(
      (
        sum,
        account
      ) =>
        sum +
        Number(
          account.balance || 0
        ),
      0
    );


  const totalProfit =
    rows.reduce(
      (
        sum,
        account
      ) =>
        sum +
        Number(
          account.profit || 0
        ),
      0
    );


  const totalTrades =
    rows.reduce(
      (
        sum,
        account
      ) =>
        sum +
        Number(
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

          <CalendarDays
            size={15}
          />

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
              size={10}
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
          <div className="relative">
            <select
              value={roleType}
              onChange={(e) =>
                setRoleType(
                  e.target.value
                )
              }
              className="h-11 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Tất cả</option>
              <option value="02">Nội bộ</option>
              <option value="03">Khách hàng</option>
            </select>
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

              <Search
                size={16}
              />

            )}

            Tìm kiếm

          </button>
          <button
              type="button"
              disabled={
                loading ||
                exporting ||
                !searchedFrom ||
                !searchedTo
              }
              onClick={handleExportExcel}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {exporting ? (

                <Loader2
                  size={16}
                  className="animate-spin"
                />

              ) : (

                <span>
                  ↓
                </span>

              )}

              {exporting
                ? "Đang xuất..."
                : "Export Excel"
              }

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
          STAT CARDS
      =================================================== */}

      <div className="mt-5 grid gap-4 md:grid-cols-3">


        <StatCard
          label="Số dư hiện tại"
          value={money(
            totalBalance
          )}
          sub={`Đang hiển thị ${rows.length} tài khoản`}
          icon={BarChart3}
        />


        <StatCard
          label="Lợi nhuận trong kỳ"
          value={money(
            totalProfit
          )}
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
          value={String(
            totalTrades
          )}
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
                  Tên
                </th>
                <th className="px-5 py-3 font-medium">
                  Trạng thái
                </th>
                <th className="px-5 py-3 font-medium">
                  Tình trạng bot
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

                rows.map(
                  (
                    account
                  ) => (

                    <tr
                      key={
                        account.account
                      }
                      className="hover:bg-slate-50"
                    >


                      {/* ACCOUNT */}

                      <td className="px-5 py-4">

                        <div className="font-semibold text-slate-800">

                          {account.account}

                        </div>

                      </td>
                      <td className="px-5 py-4">

                        <div className="font-semibold text-slate-800">

                          {account.fullname}

                        </div>

                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        {account.status ===
                        "01" ? (

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">

                            Đang hoạt động

                          </span>

                        ) : (

                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">

                            Bị khóa

                          </span>

                        )}

                      </td>
                      <td className="px-5 py-4">

                        {account.botStatus ===
                        "ONLINE" ? (

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">

                            ONLINE

                          </span>

                        ) : (

                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">

                            KHÔNG CÓ KẾT NỐI

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

                        {account.remainingDays !==
                        undefined ? (

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

                              {account.remainingDays <=
                              0
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


        {/* =================================================
            PAGINATION
        ================================================= */}

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
                  page >=
                    totalPages - 1
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