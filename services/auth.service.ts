import api from "@/lib/axios";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("auth/login", data);

  return response.data;
};