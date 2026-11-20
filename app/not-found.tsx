import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <p className="text-gold-gradient num text-7xl font-bold">404</p>
      <p className="text-lg font-semibold text-fg">Không tìm thấy trang</p>
      <Link href="/dashboard" className="rounded-xl bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-[#1a1204]">
        Về Dashboard
      </Link>
    </main>
  );
}
