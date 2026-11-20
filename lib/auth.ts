// =========================================================
// Lưu phiên đăng nhập (JWT) ở localStorage – giống bản cũ ("accessToken")
// =========================================================

export const TOKEN_KEY = "accessToken";
export const USER_KEY = "xauusd.user";

export interface SessionUser {
  id?: number | null;
  username: string;
  fullname?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  roleName?: string | null;
  status?: string | null;
}

function storage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

export function setSession(token: string, user?: SessionUser | null) {
  const s = storage();
  if (!s) return;
  s.setItem(TOKEN_KEY, token);
  if (user) s.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): SessionUser | null {
  const raw = storage()?.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: SessionUser) {
  storage()?.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  const s = storage();
  if (!s) return;
  s.removeItem(TOKEN_KEY);
  s.removeItem(USER_KEY);
}

export function isAdmin(user: SessionUser | null | undefined) {
  return user?.role === "00";
}
