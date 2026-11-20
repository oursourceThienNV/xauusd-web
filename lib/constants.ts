export const STATUS = {
  ACTIVE: "01",
  BLOCKED: "00",
} as const;

export const ROLE_LABEL: Record<string, string> = {
  "00": "Quản trị viên",
  "01": "Sale",
  "02": "Tự doanh",
  "03": "Khách hàng",
};

export const ROLE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  { value: "02", label: "Tự doanh" },
  { value: "03", label: "Khách hàng" },
];

export const STRATEGY_LABEL: Record<string, string> = {
  trend_v1: "MA Cross",
  bollinger: "Bollinger",
  adx: "ADX",
  sma_rsi: "SMA20 + RSI",
  ai: "AI tự quyết",
  LOW_PROFIT: "Low Profit",
  HIGH_PROFIT: "High Profit",
  ai_select: "AI chọn phương pháp",
};

export function strategyName(value?: string | null) {
  if (!value) return "—";
  return STRATEGY_LABEL[value] || value;
}
