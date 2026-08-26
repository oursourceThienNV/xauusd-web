import api from "@/lib/axios";

export interface AccountReportResponse {
  account: string;
  balance: number;
  profit: number;
  totalTrades: number;
  winTrades: number;
  winRate: number;
  status: string;
  licenseExpiredDt?: string | null;
  remainingDays?: number;
}

export interface TradeReportResponse {
  id: number;
  ticket: number;
  account: string;

  type: string;
  lot: number;

  openPrice: number;
  closePrice: number;

  openTime: string;
  closeTime: string;

  profit: number;

  tradeStatus: string;
  result: string;

  openBalance: number;
  closeBalance: number;

  strategy: string;

  multiLot: boolean;
  lotChain: string;

  rrRisk: number;
  rrReward: number;

  maFast: number;
  maSlow: number;
  maTrendValue: number;

  sideway: boolean;
  fomo: boolean;

  syncStatus: string;
  syncedDt: string;

  createdDt: string;
  updatedDt: string;

  firstTradeAfterBotStart: boolean;
}

export interface AccountReportPageResponse {
  content: AccountReportResponse[];

  totalPages: number;
  totalElements: number;

  number: number;
  size: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
}

export interface TradeReportPageResponse {
  content: TradeReportResponse[];

  totalPages: number;
  totalElements: number;

  number: number;
  size: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
}


// =========================================================
// ACCOUNT REPORT
// =========================================================

export async function getAccountReports(
  page: number = 0,
  size: number = 10,
  keyword: string = "",
  from: string,
  to: string
) {
  const response =
    await api.get<AccountReportPageResponse>(
      "/reports/accounts",
      {
        params: {
          page,
          size,
          keyword: keyword || undefined,
          from,
          to,
        },
      }
    );

  return response.data;
}


// =========================================================
// TRADE REPORT DETAIL
// =========================================================

export async function getTradeReports(
  account: string,
  page: number = 0,
  size: number = 20,
  keyword: string = "",
  from: string,
  to: string
) {
  const response =
    await api.get<TradeReportPageResponse>(
      `/reports/accounts/${encodeURIComponent(account)}/trades`,
      {
        params: {
          page,
          size,
          keyword: keyword || undefined,
          from,
          to,
        },
      }
    );

  return response.data;
}