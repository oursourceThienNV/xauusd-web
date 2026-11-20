import api from "@/lib/axios";
import type { LoginRequest, LoginResponse, ProfileResponse } from "@/types/api";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("auth/login", data);
  return response.data;
};

export async function getMe(): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>("auth/me");
  return response.data;
}

export async function changePassword(oldPassword: string, newPassword: string, rePassword: string) {
  const response = await api.post("auth/change-password", { oldPassword, newPassword, rePassword });
  return response.data;
}
