import api from "@/lib/axios";
import type { DashboardResponse, DashboardStatistics } from "@/types/api";

export type { BestConfigurationResponse, DashboardResponse, DashboardStatistics } from "@/types/api";

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await api.get<DashboardResponse>("dashboard");
  return response.data;
}

export async function getDashboardStatistics(days = 30): Promise<DashboardStatistics> {
  const response = await api.get<DashboardStatistics>("dashboard/statistics", { params: { days } });
  return response.data;
}
