import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import Providers from "@/components/providers/Providers";
import { themeScript } from "@/components/providers/ThemeProvider";
import "./globals.css";

const appFont = Be_Vietnam_Pro({
  variable: "--font-app",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const numFont = JetBrains_Mono({
  variable: "--font-num",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "XAUUSD Gold Admin",
    template: "%s · XAUUSD Gold Admin",
  },
  description: "Hệ thống quản trị bot giao dịch vàng XAUUSD",
};

export const viewport: Viewport = {
  themeColor: "#07090e",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${appFont.variable} ${numFont.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
