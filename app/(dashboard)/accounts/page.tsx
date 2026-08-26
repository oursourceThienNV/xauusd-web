"use client";

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Search,
  ShieldBan,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/components/ui/PageHeader";

import {
  getAccounts,
  blockAccount,
  unblockAccount,
  renewAccount,
  type AccountListResponse,
} from "@/services/account.service";


// =========================================================
// PAGE
// =========================================================

export default function AccountsPage() {

  // =======================================================
  // DATA
  // =======================================================

  const [
    accounts,
    setAccounts
  ] = useState<AccountListResponse[]>([]);


  // =======================================================
  // PAGINATION
  // =======================================================

  const [
    page,
    setPage
  ] = useState(0);

  const [
    size,
    setSize
  ] = useState(10);

  const [
    totalPages,
    setTotalPages
  ] = useState(0);

  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  // =======================================================
  // SEARCH
  // =======================================================

  const [
    query,
    setQuery
  ] = useState("");

  const [
    searchKeyword,
    setSearchKeyword
  ] = useState("");


  // =======================================================
  // LOADING
  // =======================================================

  const [
    loading,
    setLoading
  ] = useState(false);


  // =======================================================
  // ERROR
  // =======================================================

  const [
    error,
    setError
  ] = useState("");


  // =======================================================
  // SELECTED ACCOUNT
  // =======================================================

  const [
    selected,
    setSelected
  ] = useState<AccountListResponse | null>(
    null
  );


  // =======================================================
  // MODAL
  // =======================================================

  const [
    modal,
    setModal
  ] = useState<
    "block" |
    "renew" |
    null
  >(null);


  // =======================================================
  // ACTION LOADING
  // =======================================================

  const [
    actionLoading,
    setActionLoading
  ] = useState(false);


  // =======================================================
  // RENEW DAYS
  // =======================================================

  const [
    days,
    setDays
  ] = useState("30");


  // =======================================================
  // LOAD ACCOUNTS
  // =======================================================

  const loadAccounts = async (
    targetPage: number,
    targetSize: number,
    keyword: string
  ) => {

    try {

      setLoading(true);

      setError("");


      console.log(
        "GET ACCOUNTS:",
        {
          page: targetPage,
          size: targetSize,
          keyword,
        }
      );


      const data =
        await getAccounts(
          targetPage,
          targetSize,
          keyword
        );


      console.log(
        "GET ACCOUNTS RESPONSE:",
        data
      );


      setAccounts(
        data.content || []
      );


      setPage(
        data.number ?? targetPage
      );


      setSize(
        data.size ?? targetSize
      );


      setTotalPages(
        data.totalPages ?? 0
      );


      setTotalElements(
        data.totalElements ?? 0
      );


    } catch (err: any) {

      console.error(
        "ACCOUNT API ERROR:",
        err
      );


      console.error(
        "ACCOUNT API RESPONSE:",
        err?.response?.data
      );


      setAccounts([]);

      setTotalPages(0);

      setTotalElements(0);


      setError(
        err?.response?.data?.message ||
        "Không thể tải danh sách tài khoản."
      );


    } finally {

      setLoading(false);

    }

  };


  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {

    loadAccounts(
      0,
      10,
      ""
    );

  }, []);


  // =======================================================
  // SEARCH
  // =======================================================

  const handleSearch = () => {

    setSearchKeyword(
      query
    );


    loadAccounts(
      0,
      size,
      query
    );

  };


  // =======================================================
  // SEARCH ENTER
  // =======================================================

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {

    if (
      event.key === "Enter"
    ) {

      handleSearch();

    }

  };


  // =======================================================
  // CHANGE PAGE
  // =======================================================

  const handlePageChange = (
    targetPage: number
  ) => {

    if (
      targetPage < 0 ||
      targetPage >= totalPages ||
      loading
    ) {

      return;

    }


    loadAccounts(
      targetPage,
      size,
      searchKeyword
    );

  };


  // =======================================================
  // CHANGE SIZE
  // =======================================================

  const handleSizeChange = (
    newSize: number
  ) => {

    setSize(
      newSize
    );


    loadAccounts(
      0,
      newSize,
      searchKeyword
    );

  };


  // =======================================================
  // BLOCK / UNBLOCK
  // =======================================================

  const updateStatus = async () => {

    if (!selected) {

      return;

    }


    try {

      setActionLoading(
        true
      );

      setError("");


      // ================================================
      // ACCOUNT ĐANG BỊ KHÓA
      // => UNBLOCK
      // ================================================

      if (
        selected.status === "00"
      ) {

        console.log(
          "UNBLOCK ACCOUNT:",
          selected.account
        );


        await unblockAccount(
          selected.account
        );

      }

      // ================================================
      // ACCOUNT ĐANG ACTIVE
      // => BLOCK
      // ================================================

      else {

        console.log(
          "BLOCK ACCOUNT:",
          selected.account
        );


        await blockAccount(
          selected.account
        );

      }


      // ================================================
      // CLOSE MODAL
      // ================================================

      setModal(null);

      setSelected(null);


      // ================================================
      // RELOAD CURRENT PAGE
      // ================================================

      await loadAccounts(
        page,
        size,
        searchKeyword
      );


    } catch (err: any) {

      console.error(
        "UPDATE ACCOUNT STATUS ERROR:",
        err
      );


      console.error(
        "RESPONSE:",
        err?.response?.data
      );


      setError(
        err?.response?.data?.message ||
        "Không thể cập nhật trạng thái tài khoản."
      );


    } finally {

      setActionLoading(
        false
      );

    }

  };


  // =======================================================
  // RENEW ACCOUNT
  // =======================================================

  const handleRenew = async () => {

    if (!selected) {

      return;

    }


    const renewDays =
      Number(days);


    if (
      !Number.isFinite(
        renewDays
      ) ||
      renewDays <= 0
    ) {

      setError(
        "Số ngày gia hạn phải lớn hơn 0."
      );

      return;

    }


    try {

      setActionLoading(
        true
      );

      setError("");


      console.log(
        "RENEW ACCOUNT:",
        {
          account: selected.account,
          days: renewDays,
        }
      );


      await renewAccount(
        selected.account,
        renewDays
      );


      // ================================================
      // CLOSE MODAL
      // ================================================

      setModal(null);

      setSelected(null);


      // ================================================
      // RELOAD
      // ================================================

      await loadAccounts(
        page,
        size,
        searchKeyword
      );


    } catch (err: any) {

      console.error(
        "RENEW ACCOUNT ERROR:",
        err
      );


      console.error(
        "RESPONSE:",
        err?.response?.data
      );


      setError(
        err?.response?.data?.message ||
        "Không thể gia hạn tài khoản."
      );


    } finally {

      setActionLoading(
        false
      );

    }

  };


  // =======================================================
  // PAGE NUMBERS
  // =======================================================

  const getPageNumbers = () => {

    if (
      totalPages <= 0
    ) {

      return [];

    }


    const pages: number[] = [];


    if (
      totalPages <= 5
    ) {

      for (
        let i = 0;
        i < totalPages;
        i++
      ) {

        pages.push(i);

      }


      return pages;

    }


    let start =
      Math.max(
        page - 2,
        0
      );


    if (
      start + 5 >
      totalPages
    ) {

      start =
        totalPages - 5;

    }


    for (
      let i = 0;
      i < 5;
      i++
    ) {

      pages.push(
        start + i
      );

    }


    return pages;

  };


  // =======================================================
  // MONEY
  // =======================================================

  const money = (
    value: number | null | undefined
  ) => {

    const number =
      Number(
        value ?? 0
      );


    return (
      `${number >= 0 ? "+" : "-"}$` +
      Math.abs(
        number
      ).toLocaleString(
        "en-US",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    );

  };


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="mx-auto max-w-[1500px]">


      {/* ===================================================
          HEADER
      =================================================== */}

      <PageHeader
        title="Quản lý tài khoản"
        description="Tìm kiếm, khóa và gia hạn tài khoản sử dụng hệ thống"
      />


      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (

        <div className="mb-4 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm text-red-600">

            {error}

          </p>


          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-red-400 hover:text-red-600"
          >

            <X size={17} />

          </button>

        </div>

      )}


      {/* ===================================================
          MAIN
      =================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">


        {/* =================================================
            HEADER / SEARCH
        ================================================= */}

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">


          <div>

            <p className="text-sm font-semibold text-slate-800">

              Danh sách tài khoản

            </p>


            <p className="mt-1 text-xs text-slate-400">

              Tổng cộng{" "}

              <span className="font-medium text-slate-600">

                {totalElements}

              </span>

              {" "}tài khoản

            </p>

          </div>


          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">


            {/* SEARCH */}

            <div className="relative">

              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />


              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(
                    event.target.value
                  )
                }
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Tìm tài khoản..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />

            </div>


            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="h-10 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "Đang tìm..."
                : "Tìm kiếm"}

            </button>

          </div>

        </div>


        {/* =================================================
            TABLE
        ================================================= */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px] text-left text-sm">


            {/* HEADER */}

            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-400">

              <tr>

                <th className="px-5 py-3 font-medium">
                  STT
                </th>

                <th className="px-5 py-3 font-medium">
                  Tài khoản
                </th>

                <th className="px-5 py-3 font-medium">
                  Số dư
                </th>

                <th className="px-5 py-3 font-medium">
                  Lợi nhuận
                </th>

                <th className="px-5 py-3 font-medium">
                  Giao dịch
                </th>

                <th className="px-5 py-3 font-medium">
                  Win Rate
                </th>

                <th className="px-5 py-3 font-medium">
                  Trạng thái
                </th>

                <th className="px-5 py-3 font-medium">
                  License
                </th>

                <th className="px-5 py-3 font-medium">
                  Thao tác
                </th>

              </tr>

            </thead>


            {/* BODY */}

            <tbody className="divide-y divide-slate-100">


              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan={9}
                    className="px-5 py-14 text-center text-slate-400"
                  >

                    <div className="flex items-center justify-center gap-2">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Đang tải danh sách tài khoản...

                    </div>

                  </td>

                </tr>

              ) : accounts.length === 0 ? (

                <tr>

                  <td
                    colSpan={9}
                    className="px-5 py-14 text-center text-sm text-slate-400"
                  >

                    Không tìm thấy tài khoản.

                  </td>

                </tr>

              ) : (

                accounts.map(
                  (
                    account,
                    index
                  ) => {

                    const remainingDays =
                      Number(
                        account.remainingDays ?? 0
                      );


                    return (

                      <tr
                        key={account.account}
                        className="hover:bg-slate-50"
                      >


                        {/* STT */}

                        <td className="px-5 py-4 text-slate-400">

                          {page * size + index + 1}

                        </td>


                        {/* ACCOUNT */}

                        <td className="px-5 py-4">

                          <p className="font-semibold text-slate-800">

                            {account.account}

                          </p>

                        </td>


                        {/* BALANCE */}

                        <td className="px-5 py-4 font-medium text-slate-800">

                          $
                          {Number(
                            account.balance ?? 0
                          ).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </td>


                        {/* PROFIT */}

                        <td
                          className={`px-5 py-4 font-semibold ${
                            Number(
                              account.profit ?? 0
                            ) >= 0
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >

                          {money(
                            account.profit
                          )}

                        </td>


                        {/* TRADES */}

                        <td className="px-5 py-4 text-slate-600">

                          {account.totalTrades ?? 0}

                        </td>


                        {/* WIN RATE */}

                        <td className="px-5 py-4 text-slate-600">

                          {Number(
                            account.winRate ?? 0
                          ).toFixed(2)}

                          %

                        </td>


                        {/* STATUS */}

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              account.status === "01"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >

                            {account.status === "01"
                              ? "Đang hoạt động"
                              : "Bị khóa"}

                          </span>

                        </td>


                        {/* LICENSE */}

                        <td className="px-5 py-4">

                          {remainingDays <= 0 ? (

                            <div>

                              <p className="font-semibold text-red-500">

                                Đã hết hạn

                              </p>


                              {account.licenseExpiredDt && (

                                <p className="mt-0.5 text-[11px] text-slate-400">

                                  {new Date(
                                    account.licenseExpiredDt
                                  ).toLocaleDateString(
                                    "vi-VN"
                                  )}

                                </p>

                              )}

                            </div>

                          ) : (

                            <div>

                              <p
                                className={`font-semibold ${
                                  remainingDays <= 7
                                    ? "text-red-500"
                                    : remainingDays <= 30
                                      ? "text-amber-500"
                                      : "text-emerald-600"
                                }`}
                              >

                                Còn {remainingDays} ngày

                              </p>


                              {account.licenseExpiredDt && (

                                <p className="mt-0.5 text-[11px] text-slate-400">

                                  Hết hạn{" "}

                                  {new Date(
                                    account.licenseExpiredDt
                                  ).toLocaleDateString(
                                    "vi-VN"
                                  )}

                                </p>

                              )}

                            </div>

                          )}

                        </td>


                        {/* ACTION */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-1">


                            {/* BLOCK / UNBLOCK */}

                            <button
                              type="button"
                              onClick={() => {

                                setSelected(
                                  account
                                );

                                setModal(
                                  "block"
                                );

                              }}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title={
                                account.status === "00"
                                  ? "Mở khóa"
                                  : "Khóa tài khoản"
                              }
                            >

                              {account.status === "00"
                                ? (
                                  <ShieldCheck
                                    size={17}
                                  />
                                )
                                : (
                                  <ShieldBan
                                    size={17}
                                  />
                                )}

                            </button>


                            {/* RENEW */}

                            <button
                              type="button"
                              onClick={() => {

                                setSelected(
                                  account
                                );

                                setDays(
                                  "30"
                                );

                                setModal(
                                  "renew"
                                );

                              }}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title="Gia hạn"
                            >

                              <CalendarClock
                                size={17}
                              />

                            </button>


                            {/* DETAIL */}

                            <button
                              type="button"
                              onClick={() => {

                                setSelected(
                                  account
                                );

                                setModal(
                                  null
                                );

                              }}
                              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                              title="Chi tiết"
                            >

                              <MoreHorizontal
                                size={17}
                              />

                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  }
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">


          <div className="text-xs text-slate-400">

            {totalElements > 0
              ? `Trang ${page + 1} / ${totalPages} · ${totalElements} tài khoản`
              : "Không có dữ liệu"}

          </div>


          <div className="flex items-center gap-1">


            {/* SIZE */}

            <select
              value={size}
              onChange={(event) =>
                handleSizeChange(
                  Number(
                    event.target.value
                  )
                )
              }
              disabled={loading}
              className="mr-2 h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none focus:border-blue-500"
            >

              <option value={10}>
                10 / trang
              </option>

              <option value={20}>
                20 / trang
              </option>

              <option value={50}>
                50 / trang
              </option>

              <option value={100}>
                100 / trang
              </option>

            </select>


            {/* PREVIOUS */}

            <button
              type="button"
              disabled={
                page <= 0 ||
                loading ||
                totalPages === 0
              }
              onClick={() =>
                handlePageChange(
                  page - 1
                )
              }
              className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <ChevronLeft
                size={14}
              />

              Trước

            </button>


            {/* NUMBERS */}

            {getPageNumbers().map(
              (
                pageNumber
              ) => (

                <button
                  key={pageNumber}
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      pageNumber
                    )
                  }
                  disabled={loading}
                  className={`h-9 min-w-9 rounded-lg px-3 text-xs ${
                    pageNumber === page
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >

                  {pageNumber + 1}

                </button>

              )
            )}


            {/* NEXT */}

            <button
              type="button"
              disabled={
                page >= totalPages - 1 ||
                loading ||
                totalPages === 0
              }
              onClick={() =>
                handlePageChange(
                  page + 1
                )
              }
              className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >

              Sau

              <ChevronRight
                size={14}
              />

            </button>

          </div>

        </div>

      </div>


      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {selected &&
        !modal && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onClick={() =>
              setSelected(null)
            }
          >

            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold text-slate-900">

                  Tài khoản{" "}

                  {selected.account}

                </h3>


                <button
                  type="button"
                  onClick={() =>
                    setSelected(null)
                  }
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >

                  <X
                    size={19}
                  />

                </button>

              </div>


              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Balance
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    $
                    {Number(
                      selected.balance ?? 0
                    ).toLocaleString(
                      "en-US",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}

                  </p>

                </div>


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Profit
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      Number(
                        selected.profit ?? 0
                      ) >= 0
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >

                    {money(
                      selected.profit
                    )}

                  </p>

                </div>


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Giao dịch
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {selected.totalTrades ?? 0}

                  </p>

                </div>


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Win Rate
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">

                    {Number(
                      selected.winRate ?? 0
                    ).toFixed(2)}

                    %

                  </p>

                </div>


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    Trạng thái
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      selected.status === "01"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >

                    {selected.status === "01"
                      ? "Đang hoạt động"
                      : "Bị khóa"}

                  </p>

                </div>


                <div className="rounded-lg bg-slate-50 p-4">

                  <p className="text-xs text-slate-400">
                    License
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      Number(
                        selected.remainingDays ?? 0
                      ) <= 7
                        ? "text-red-500"
                        : Number(
                            selected.remainingDays ?? 0
                          ) <= 30
                          ? "text-amber-500"
                          : "text-emerald-600"
                    }`}
                  >

                    {Number(
                      selected.remainingDays ?? 0
                    ) > 0
                      ? `Còn ${selected.remainingDays} ngày`
                      : "Đã hết hạn"}

                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelected(null)
                }
                className="mt-5 w-full rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >

                Đóng

              </button>

            </div>

          </div>

        )}


      {/* ===================================================
          BLOCK / UNBLOCK MODAL
      =================================================== */}

      {modal === "block" &&
        selected && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onClick={() => {

              if (!actionLoading) {

                setModal(null);

              }

            }}
          >

            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold text-slate-900">

                  {selected.status === "00"
                    ? "Mở khóa tài khoản"
                    : "Khóa tài khoản"}

                </h3>


                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  disabled={actionLoading}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >

                  <X
                    size={18}
                  />

                </button>

              </div>


              <p className="mt-3 text-sm leading-6 text-slate-500">

                {selected.status === "00"

                  ? `Tài khoản ${selected.account} đang bị khóa. Anh có muốn mở khóa tài khoản này không?`

                  : `Tài khoản ${selected.account} sẽ bị khóa và không thể tiếp tục sử dụng hệ thống.`}

              </p>


              <div className="mt-6 flex justify-end gap-2">


                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  disabled={actionLoading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >

                  Hủy

                </button>


                <button
                  type="button"
                  onClick={updateStatus}
                  disabled={actionLoading}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                    selected.status === "00"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >

                  {actionLoading && (

                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                  )}


                  {selected.status === "00"
                    ? "Mở khóa"
                    : "Khóa tài khoản"}

                </button>

              </div>

            </div>

          </div>

        )}


      {/* ===================================================
          RENEW MODAL
      =================================================== */}

      {modal === "renew" &&
        selected && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onClick={() => {

              if (!actionLoading) {

                setModal(null);

              }

            }}
          >

            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="flex items-center justify-between">

                <h3 className="text-lg font-semibold text-slate-900">

                  Gia hạn tài khoản

                </h3>


                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  disabled={actionLoading}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                >

                  <X
                    size={18}
                  />

                </button>

              </div>


              <p className="mt-3 text-sm text-slate-500">

                Gia hạn license cho tài khoản{" "}

                <span className="font-semibold text-slate-700">

                  {selected.account}

                </span>

              </p>


              {/* CURRENT LICENSE */}

              <div className="mt-5 rounded-lg bg-slate-50 p-4">

                <p className="text-xs text-slate-400">

                  Thời hạn hiện tại

                </p>


                <p className="mt-1 font-semibold text-slate-800">

                  {selected.licenseExpiredDt

                    ? new Date(
                        selected.licenseExpiredDt
                      ).toLocaleDateString(
                        "vi-VN"
                      )

                    : "Chưa có thời hạn"}

                </p>


                <p className="mt-1 text-xs text-slate-400">

                  {Number(
                    selected.remainingDays ?? 0
                  ) > 0

                    ? `Còn ${selected.remainingDays} ngày`

                    : "Đã hết hạn"}

                </p>

              </div>


              {/* DAYS */}

              <div className="mt-5">

                <label className="text-sm font-medium text-slate-700">

                  Số ngày gia hạn

                </label>


                <input
                  type="number"
                  min={1}
                  value={days}
                  onChange={(event) =>
                    setDays(
                      event.target.value
                    )
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                />


                <div className="mt-2 flex gap-2">

                  {[7, 30, 90, 180, 365].map(
                    (value) => (

                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setDays(
                            String(value)
                          )
                        }
                        className={`rounded-lg border px-3 py-1.5 text-xs ${
                          days === String(value)
                            ? "border-blue-500 bg-blue-50 text-blue-600"
                            : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >

                        {value} ngày

                      </button>

                    )
                  )}

                </div>

              </div>


              {/* ACTION */}

              <div className="mt-6 flex justify-end gap-2">


                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  disabled={actionLoading}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >

                  Hủy

                </button>


                <button
                  type="button"
                  onClick={handleRenew}
                  disabled={
                    actionLoading ||
                    Number(days) <= 0
                  }
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {actionLoading && (

                    <Loader2
                      size={15}
                      className="animate-spin"
                    />

                  )}


                  Gia hạn

                </button>

              </div>

            </div>

          </div>

        )}

    </div>

  );

}