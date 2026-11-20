import api from "@/lib/axios";
import type { AccountReportResponse, AccountSummary, Page, TradeReportResponse } from "@/types/api";

export type { AccountReportResponse, AccountSummary, TradeReportResponse } from "@/types/api";
export type AccountReportPageResponse = Page<AccountReportResponse>;
export type TradeReportPageResponse = Page<TradeReportResponse>;

export async function getAccountReports(
  page: number = 0,
  size: number = 10,
  keyword: string = "",
  from: string,
  to: string,
  roleType: string = ""
) {
  const response = await api.get<AccountReportPageResponse>("reports/accounts", {
    params: {
      page,
      size,
      keyword: keyword || undefined,
      from,
      to,
      roleType: roleType || undefined,
    },
  });
  return response.data;
}

export async function getTradeReports(
  account: string,
  page: number = 0,
  size: number = 100,
  keyword: string = "",
  from: string,
  to: string,
  filters: { result?: string; type?: string; source?: string } = {}
) {
  const response = await api.get<TradeReportPageResponse>(
    `reports/accounts/${encodeURIComponent(account)}/trades`,
    {
      params: {
        page,
        size,
        keyword: keyword || undefined,
        from,
        to,
        result: filters.result || undefined,
        type: filters.type || undefined,
        source: filters.source || undefined,
      },
    }
  );
  return response.data;
}

export async function getAccountSummary(account: string, from: string, to: string) {
  const response = await api.get<AccountSummary>(
    `reports/accounts/${encodeURIComponent(account)}/summary`,
    { params: { from, to } }
  );
  return response.data;
}

export async function exportAccountReports(from: string, to: string): Promise<Blob> {
  const response = await api.get("reports/accounts/export", {
    params: { from, to },
    responseType: "blob",
  });
  return response.data;
}

export async function exportTradeReports(
  account: string,
  from: string,
  to: string,
  keyword: string = ""
): Promise<Blob> {
  const response = await api.get(`reports/accounts/${encodeURIComponent(account)}/trades/export`, {
    params: { from, to, keyword: keyword.trim() || undefined },
    responseType: "blob",
  });
  return response.data;
}
