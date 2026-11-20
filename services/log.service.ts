import api from "@/lib/axios";
import type { Page, SystemLog } from "@/types/api";

export async function getLogs(params: {
  account?: string;
  keyword?: string;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}): Promise<Page<SystemLog>> {
  const response = await api.get<Page<SystemLog>>("logs", {
    params: {
      account: params.account || undefined,
      keyword: params.keyword || undefined,
      from: params.from || undefined,
      to: params.to || undefined,
      page: params.page ?? 0,
      size: params.size ?? 50,
    },
  });
  return response.data;
}
