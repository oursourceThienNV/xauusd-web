import axios, { AxiosError } from "axios";
import { clearSession, getToken } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    // Hết phiên -> về trang đăng nhập (trừ chính request đăng nhập)
    if (status === 401 && !url.includes("auth/login") && typeof window !== "undefined") {
      clearSession();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login?expired=1";
      }
    }
    return Promise.reject(error);
  }
);

/** Lấy thông báo lỗi từ API ({ message }) hoặc từ blob khi tải file. */
export async function errorMessage(error: unknown, fallback: string): Promise<string> {
  const err = error as AxiosError<{ message?: string } | Blob>;
  const data = err?.response?.data;
  if (data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text());
      if (parsed?.message) return parsed.message;
    } catch {
      /* ignore */
    }
    return fallback;
  }
  if (data && typeof data === "object" && "message" in data && data.message) {
    return String(data.message);
  }
  if (err?.code === "ERR_NETWORK") return "Không kết nối được máy chủ API.";
  if (err?.code === "ECONNABORTED") return "Máy chủ phản hồi quá lâu, vui lòng thử lại.";
  return fallback;
}

export default api;
