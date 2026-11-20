"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getStoredUser, getToken, setStoredUser, type SessionUser } from "@/lib/auth";
import { getMe } from "@/services/auth.service";

interface SessionState {
  user: SessionUser | null;
  ready: boolean;
  logout: () => void;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionState>({
  user: null,
  ready: false,
  logout: () => undefined,
  refresh: async () => undefined,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  const logout = useCallback(() => {
    clearSession();
    router.replace("/login");
  }, [router]);

  const refresh = useCallback(async () => {
    const me = await getMe();
    setStoredUser(me);
    setUser(me);
  }, []);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setUser(getStoredUser());
    setReady(true);
    refresh().catch(() => {
      /* 401 đã được axios interceptor xử lý */
    });
  }, [router, refresh]);

  return <SessionContext.Provider value={{ user, ready, logout, refresh }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  return useContext(SessionContext);
}
