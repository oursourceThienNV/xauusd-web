import api from "@/lib/axios";

export interface AccountListResponse {
  account: string;
  fullname:string;
  balance: number;
  profit: number;
  totalTrades: number;
  winTrades: number;
  winRate: number;
  status: string;
  licenseExpiredDt?: string | null;
  remainingDays: number;
}

export interface AccountPageResponse {
  content: AccountListResponse[];

  totalPages: number;
  totalElements: number;

  number: number;
  size: number;

  first: boolean;
  last: boolean;

  numberOfElements: number;
}

export async function getAccounts(
  page: number = 0,
  size: number = 10,
  keyword: string = ""
): Promise<AccountPageResponse> {

  const response = await api.get<AccountPageResponse>(
    "/accounts",
    {
      params: {
        page: page,
        size: size,
        keyword: keyword || undefined,
      },
    }
  );

  return response.data;
}
export async function blockAccount(
  username: string
) {
  const response = await api.post(
    `/accounts/${username}/block`
  );

  return response.data;
}


export async function unblockAccount(
  username: string
) {
  const response = await api.post(
    `/accounts/${username}/unblock`
  );

  return response.data;
}


export async function renewAccount(
  username: string,
  days: number
) {
  const response = await api.post(
    `/accounts/${username}/renew`,
    null,
    {
      params: {
        days,
      },
    }
  );

  return response.data;
}