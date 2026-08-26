import api from "@/lib/axios";

// =========================================================
// BEST CONFIGURATION
// =========================================================

export interface BestConfigurationResponse {
  strategy: string | null;

  multiLot: boolean | null;

  maFast: number | null;

  maSlow: number | null;

  maTrendValue: number | null;

  sideway: boolean | null;

  fomo: boolean | null;

  totalTrades: number;

  totalProfit: number;

  winRate: number;
}


// =========================================================
// DASHBOARD RESPONSE
// =========================================================

export interface DashboardResponse {
  // ACCOUNT

  totalAccounts: number;

  activeAccounts: number;

  blockedAccounts: number;

  expiredAccounts: number;


  // FINANCIAL

  totalBalance: number;

  totalProfit: number;

  totalTrades: number;


  // BEST CONFIGURATION

  bestConfiguration:
    | BestConfigurationResponse
    | null;
}


// =========================================================
// GET DASHBOARD
// =========================================================

export async function getDashboard(): Promise<DashboardResponse> {

  console.log(
    "GET DASHBOARD API"
  );


  const response =
    await api.get<DashboardResponse>(
      "/dashboard"
    );


  console.log(
    "GET DASHBOARD RESPONSE:",
    response.data
  );


  return response.data;
}