"use client";

import { Suspense } from "react";
import AccountReportDetail from "./AccountReportDetail";

export default function AccountReportDetailPage() {
  return (
    <Suspense fallback={<div className="skeleton h-40 w-full" />}>
      <AccountReportDetail />
    </Suspense>
  );
}
