import api from "@/lib/axios";
import type { AccountDetail, AccountForm, AccountListResponse, Page } from "@/types/api";

export type { AccountListResponse } from "@/types/api";
export type AccountPageResponse = Page<AccountListResponse>;

export async function getAccounts(
  page: number = 0,
  size: number = 10,
  keyword: string = "",
  filters: { status?: string; roleType?: string } = {}
): Promise<AccountPageResponse> {
  const response = await api.get<AccountPageResponse>("accounts", {
    params: {
      page,
      size,
      keyword: keyword || undefined,
      status: filters.status || undefined,
      roleType: filters.roleType || undefined,
    },
  });
  return response.data;
}

export async function getAccount(username: string): Promise<AccountDetail> {
  const response = await api.get<AccountDetail>(`accounts/${encodeURIComponent(username)}`);
  return response.data;
}

export async function createAccount(data: AccountForm): Promise<AccountDetail> {
  const response = await api.post<AccountDetail>("accounts", data);
  return response.data;
}

export async function updateAccount(username: string, data: AccountForm): Promise<AccountDetail> {
  const response = await api.put<AccountDetail>(`accounts/${encodeURIComponent(username)}`, data);
  return response.data;
}

export async function blockAccount(username: string) {
  const response = await api.post(`accounts/${encodeURIComponent(username)}/block`);
  return response.data;
}

export async function unblockAccount(username: string) {
  const response = await api.post(`accounts/${encodeURIComponent(username)}/unblock`);
  return response.data;
}

export async function renewAccount(username: string, days: number) {
  const response = await api.post(`accounts/${encodeURIComponent(username)}/renew`, null, {
    params: { days },
  });
  return response.data;
}
