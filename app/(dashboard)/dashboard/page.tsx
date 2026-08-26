"use client";

import {
  Activity,
  CircleDollarSign,
  ShieldCheck,
  Users,
  TrendingUp,
  TrendingDown,
  Settings2,
  BarChart3,
  Loader2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";

import {
  getDashboard,
  type DashboardResponse,
} from "@/services/dashboard.service";


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
// DASHBOARD
// =========================================================

export default function DashboardPage() {

  // =======================================================
  // DATA
  // =======================================================

  const [
    dashboard,
    setDashboard
  ] = useState<
    DashboardResponse | null
  >(null);


  // =======================================================
  // LOADING
  // =======================================================

  const [
    loading,
    setLoading
  ] = useState(true);


  // =======================================================
  // ERROR
  // =======================================================

  const [
    error,
    setError
  ] = useState("");


  // =======================================================
  // LOAD DASHBOARD
  // =======================================================

  useEffect(() => {

    let mounted = true;


    async function loadDashboard() {

      try {

        setLoading(true);

        setError("");


        console.log(
          "GET DASHBOARD"
        );


        const data =
          await getDashboard();


        console.log(
          "DASHBOARD DATA:",
          data
        );


        if (!mounted) {
          return;
        }


        setDashboard(
          data
        );


      } catch (err: any) {

        console.error(
          "DASHBOARD API ERROR:",
          err
        );


        console.error(
          "DASHBOARD API RESPONSE:",
          err?.response?.data
        );


        if (!mounted) {
          return;
        }


        setError(
          err?.response?.data?.message ||
          "Không thể tải dữ liệu Dashboard."
        );


      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    }


    loadDashboard();


    return () => {

      mounted = false;

    };

  }, []);


  // =======================================================
  // LOADING UI
  // =======================================================

  if (loading) {

    return (

      <div className="mx-auto max-w-[1500px]">

        <PageHeader
          title="Dashboard"
          description="Tổng quan hệ thống quản trị Forex"
        />


        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-2 text-sm text-slate-400">

            <Loader2
              size={18}
              className="animate-spin"
            />

            Đang tải dữ liệu...

          </div>

        </div>

      </div>

    );

  }


  // =======================================================
  // ERROR UI
  // =======================================================

  if (error) {

    return (

      <div className="mx-auto max-w-[1500px]">

        <PageHeader
          title="Dashboard"
          description="Tổng quan hệ thống quản trị Forex"
        />


        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">

          <p className="text-sm font-medium text-red-700">

            Không thể tải Dashboard

          </p>


          <p className="mt-1 text-sm text-red-600">

            {error}

          </p>

        </div>

      </div>

    );

  }


  // =======================================================
  // NO DATA
  // =======================================================

  if (!dashboard) {

    return (

      <div className="mx-auto max-w-[1500px]">

        <PageHeader
          title="Dashboard"
          description="Tổng quan hệ thống quản trị Forex"
        />


        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400">

          Không có dữ liệu Dashboard.

        </div>

      </div>

    );

  }


  // =======================================================
  // BEST CONFIGURATION
  // =======================================================

  const bestConfiguration =
    dashboard.bestConfiguration;


  // =======================================================
  // ACTIVE RATE
  // =======================================================

  const activeRate =
    dashboard.totalAccounts > 0
      ? (
          dashboard.activeAccounts /
          dashboard.totalAccounts *
          100
        )
      : 0;


  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="mx-auto max-w-[1500px]">


      {/* ===================================================
          HEADER
      =================================================== */}

      <PageHeader
        title="Dashboard"
        description="Tổng quan hệ thống quản trị Forex"
      />


      {/* ===================================================
          MAIN STATISTICS
      =================================================== */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


        {/* TOTAL ACCOUNT */}

        <StatCard
          label="Tổng tài khoản"
          value={String(
            dashboard.totalAccounts
          )}
          sub={`${dashboard.activeAccounts} đang hoạt động`}
          icon={Users}
        />


        {/* TOTAL BALANCE */}

        <StatCard
          label="Tổng số dư"
          value={money(
            dashboard.totalBalance
          )}
          icon={CircleDollarSign}
        />


        {/* TOTAL PROFIT */}

        <StatCard
          label="Tổng lợi nhuận"
          value={money(
            dashboard.totalProfit
          )}
          sub="Theo dữ liệu giao dịch"
          positive={
            dashboard.totalProfit >= 0
          }
          icon={
            dashboard.totalProfit >= 0
              ? TrendingUp
              : TrendingDown
          }
        />


        {/* TOTAL TRADES */}

        <StatCard
          label="Giao dịch ghi nhận"
          value={String(
            dashboard.totalTrades
          )}
          sub="Tổng giao dịch"
          icon={ShieldCheck}
        />

      </div>


      {/* ===================================================
          ACCOUNT STATUS + BEST CONFIG
      =================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">


        {/* =================================================
            ACCOUNT STATUS
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-semibold text-slate-900">

                Trạng thái tài khoản

              </h3>


              <p className="mt-1 text-xs text-slate-400">

                Tổng quan quyền sử dụng tài khoản

              </p>

            </div>


            <div className="rounded-lg bg-slate-50 p-2 text-slate-500">

              <Users
                size={18}
              />

            </div>

          </div>


          {/* STATUS */}

          <div className="mt-7 grid grid-cols-3 gap-3">


            {/* ACTIVE */}

            <div className="rounded-xl border border-slate-100 p-5">

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">

                ACTIVE

              </span>


              <p className="mt-4 text-3xl font-semibold text-slate-900">

                {dashboard.activeAccounts}

              </p>


              <p className="mt-1 text-xs text-slate-400">

                Đang hoạt động

              </p>

            </div>


            {/* BLOCKED */}

            <div className="rounded-xl border border-slate-100 p-5">

              <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold text-red-700">

                BLOCKED

              </span>


              <p className="mt-4 text-3xl font-semibold text-slate-900">

                {dashboard.blockedAccounts}

              </p>


              <p className="mt-1 text-xs text-slate-400">

                Đã khóa

              </p>

            </div>


            {/* EXPIRED */}

            <div className="rounded-xl border border-slate-100 p-5">

              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">

                EXPIRED

              </span>


              <p className="mt-4 text-3xl font-semibold text-slate-900">

                {dashboard.expiredAccounts}

              </p>


              <p className="mt-1 text-xs text-slate-400">

                Hết hạn

              </p>

            </div>

          </div>


          {/* ACTIVE RATE */}

          <div className="mt-6 rounded-xl bg-slate-50 p-4">

            <div className="flex items-center justify-between">

              <span className="text-xs text-slate-500">

                Tỷ lệ tài khoản hoạt động

              </span>


              <span className="text-sm font-semibold text-slate-800">

                {activeRate.toFixed(1)}%

              </span>

            </div>


            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-emerald-500"
                style={{
                  width: `${activeRate}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* =================================================
            BEST CONFIGURATION
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


          <div className="flex items-start justify-between">

            <div>

              <h3 className="font-semibold text-slate-900">

                Cấu hình có doanh thu tốt nhất

              </h3>


              <p className="mt-1 text-xs text-slate-400">

                Cấu hình mang lại lợi nhuận cao nhất

              </p>

            </div>


            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">

              <Settings2
                size={18}
              />

            </div>

          </div>


          {bestConfiguration ? (

            <>

              {/* PROFIT */}

              <div className="mt-5 rounded-xl bg-slate-50 p-5">

                <div className="flex items-end justify-between gap-4">


                  <div>

                    <p className="text-xs text-slate-400">

                      Tổng lợi nhuận

                    </p>


                    <p
                      className={`mt-1 text-2xl font-semibold ${
                        bestConfiguration.totalProfit >= 0
                          ? "text-emerald-600"
                          : "text-red-500"
                      }`}
                    >

                      {money(
                        bestConfiguration.totalProfit
                      )}

                    </p>

                  </div>


                  <div className="text-right">

                    <p className="text-xs text-slate-400">

                      Win Rate

                    </p>


                    <p className="mt-1 text-lg font-semibold text-slate-800">

                      {Number(
                        bestConfiguration.winRate || 0
                      ).toFixed(1)}%

                    </p>

                  </div>

                </div>


                <div className="mt-2 text-xs text-slate-400">

                  {bestConfiguration.totalTrades}
                  {" "}giao dịch

                </div>

              </div>


              {/* CONFIGURATION */}

              <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">


                {/* STRATEGY */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    Strategy

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.strategy || "-"}

                  </p>

                </div>


                {/* MULTI LOT */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    Multi Lot

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.multiLot
                      ? "Có"
                      : "Không"}

                  </p>

                </div>


                {/* MA CROSS */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    MA Cross

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.maFast ?? "-"}

                    {" / "}

                    {bestConfiguration.maSlow ?? "-"}

                  </p>

                </div>


                {/* MA TREND */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    MA Trend

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.maTrendValue ?? "-"}

                  </p>

                </div>


                {/* SIDEWAY */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    Sideway

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.sideway
                      ? "Có"
                      : "Không"}

                  </p>

                </div>


                {/* FOMO */}

                <div>

                  <p className="text-[11px] text-slate-400">

                    FOMO

                  </p>


                  <p className="mt-1 text-sm font-semibold text-slate-800">

                    {bestConfiguration.fomo
                      ? "Có"
                      : "Không"}

                  </p>

                </div>

              </div>

            </>

          ) : (

            <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-400">

              Chưa có dữ liệu cấu hình giao dịch.

            </div>

          )}

        </div>

      </div>


      {/* ===================================================
          TRADING OVERVIEW
      =================================================== */}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">


        {/* =================================================
            ACCOUNT SUMMARY
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-semibold text-slate-900">

                Tổng quan tài khoản

              </h3>


              <p className="mt-1 text-xs text-slate-400">

                Thống kê quyền sử dụng hệ thống

              </p>

            </div>


            <Users
              size={18}
              className="text-slate-400"
            />

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">


            {/* TOTAL */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Tổng tài khoản

              </p>


              <p className="mt-2 text-2xl font-semibold text-slate-900">

                {dashboard.totalAccounts}

              </p>

            </div>


            {/* ACTIVE */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Đang hoạt động

              </p>


              <p className="mt-2 text-2xl font-semibold text-emerald-600">

                {dashboard.activeAccounts}

              </p>

            </div>


            {/* BLOCKED */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Đã khóa

              </p>


              <p className="mt-2 text-2xl font-semibold text-red-500">

                {dashboard.blockedAccounts}

              </p>

            </div>


            {/* EXPIRED */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Hết hạn

              </p>


              <p className="mt-2 text-2xl font-semibold text-amber-600">

                {dashboard.expiredAccounts}

              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            TRADING OVERVIEW
        ================================================= */}

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">


          <div className="flex items-center justify-between">

            <div>

              <h3 className="font-semibold text-slate-900">

                Tổng quan giao dịch

              </h3>


              <p className="mt-1 text-xs text-slate-400">

                Hiệu quả giao dịch hiện tại

              </p>

            </div>


            <BarChart3
              size={18}
              className="text-slate-400"
            />

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">


            {/* TOTAL TRADES */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Tổng giao dịch

              </p>


              <p className="mt-2 text-2xl font-semibold text-slate-900">

                {dashboard.totalTrades}

              </p>

            </div>


            {/* TOTAL PROFIT */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Tổng lợi nhuận

              </p>


              <p
                className={`mt-2 text-2xl font-semibold ${
                  dashboard.totalProfit >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >

                {money(
                  dashboard.totalProfit
                )}

              </p>

            </div>


            {/* BEST CONFIG TRADES */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Giao dịch cấu hình tốt nhất

              </p>


              <p className="mt-2 text-2xl font-semibold text-slate-900">

                {bestConfiguration?.totalTrades ?? 0}

              </p>

            </div>


            {/* BEST CONFIG PROFIT */}

            <div className="rounded-xl border border-slate-100 p-4">

              <p className="text-xs text-slate-400">

                Lợi nhuận cấu hình tốt nhất

              </p>


              <p className="mt-2 text-2xl font-semibold text-emerald-600">

                {money(
                  bestConfiguration?.totalProfit
                )}

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}