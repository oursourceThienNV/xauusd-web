"use client";

import { useState, type ReactNode } from "react";
import { SessionProvider, useSession } from "@/components/providers/SessionProvider";
import Logo from "./Logo";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Shell({ children }: { children: ReactNode }) {
  const { ready } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <Logo size={52} className="animate-pulse" />
          <p className="text-xs tracking-[0.2em] text-subtle">ĐANG TẢI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1560px] px-4 py-6 sm:px-7 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Shell>{children}</Shell>
    </SessionProvider>
  );
}
