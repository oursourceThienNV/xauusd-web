import type { Metadata } from "next";
import { Suspense } from "react";
import LoginBanner from "./LoginBanner";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
        <LoginBanner />
        <Suspense fallback={<div className="min-h-screen" />}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
