// =========================================================
// Kiểu dữ liệu API (khớp JSON của xauusd-api)
// =========================================================

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty?: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ProfileResponse {
  id?: number | null;
  username: string;
  fullname?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  roleName?: string | null;
  status?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  username: string;
  user?: ProfileResponse;
}

// ---------------- Dashboard ----------------

export interface BestConfigurationResponse {
  strategy: string | null;
  multiLot: boolean | null;
  maFast: number | null;
  maSlow: number | null;
  maTrendValue: number | null;
  sideway: boolean | null;
  fomo: boolean | null;
  totalTrades: number;
  totalProfit: number;
  winRate: number;
}

export interface DashboardResponse {
  totalAccounts: number;
  activeAccounts: number;
  blockedAccounts: number;
  expiredAccounts: number;
  totalBalance: number;
  totalProfit: number;
  totalTrades: number;
  bestConfiguration: BestConfigurationResponse | null;
}

export interface DailyPoint {
  date: string;
  profit: number;
  botProfit: number;
  trades: number;
  wins: number;
  losses?: number;
  cumulative: number;
}

export interface StrategyStat {
  strategy: string;
  totalTrades: number;
  totalProfit: number;
  winRate: number;
}

export interface TopAccount {
  account: string;
  fullname: string | null;
  totalTrades: number;
  totalProfit: number;
  winRate: number;
}

export interface DashboardStatistics {
  days: number;
  from: string | null;
  to: string | null;
  totalProfit: number;
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  winRate: number;
  onlineBots: number;
  openPositions: number;
  daily: DailyPoint[];
  strategies: StrategyStat[];
  topAccounts: TopAccount[];
  recentTrades: TradeReportResponse[];
  scope: "ALL" | "OWN";
}

// ---------------- Accounts ----------------

export interface AccountListResponse {
  account: string;
  fullname: string | null;
  balance: number;
  profit: number;
  totalTrades: number;
  winTrades: number;
  winRate: number;
  status: string;
  licenseExpiredDt?: string | null;
  remainingDays: number;
  role?: string | null;
  roleName?: string | null;
  typeMoney?: string | null;
  phone?: string | null;
  email?: string | null;
  createdBy?: string | null;
  createdDt?: string | null;
  licenseStartDt?: string | null;
  onlineDate?: string | null;
  botStatus?: string;
}

export interface AccountDetail extends AccountListResponse {
  id: number;
  username: string;
  address?: string | null;
  updatedBy?: string | null;
  updatedDt?: string | null;
}

export interface AccountForm {
  username?: string;
  fullname?: string;
  phone?: string;
  email?: string;
  address?: string;
  role?: string;
  typeMoney?: string;
  licenseDays?: number;
  password?: string;
}

// ---------------- Reports ----------------

export interface AccountReportResponse {
  account: string;
  fullname: string | null;
  balance: number;
  profit: number;
  totalTrades: number;
  winTrades: number;
  winRate: number;
  status: string;
  licenseExpiredDt?: string | null;
  remainingDays?: number;
  onlineDate?: string | null;
  botStatus: string;
  autoBotProfit: number;
  manualProfit?: number;
  botTrades?: number;
  lossTrades?: number;
  role?: string | null;
  typeMoney?: string | null;
}

export interface TradeReportResponse {
  id: number;
  ticket: number;
  account: string;
  type: string;
  lot: number;
  openPrice: number;
  closePrice: number;
  openTime: string;
  closeTime: string;
  profit: number;
  tradeStatus: string;
  result: string;
  openBalance: number;
  closeBalance: number;
  strategy: string;
  multiLot: boolean;
  lotChain: string;
  rrRisk: number;
  rrReward: number;
  maFast: number;
  maSlow: number;
  maTrendValue: number;
  sideway: boolean;
  fomo: boolean;
  syncStatus: string;
  syncedDt: string;
  createdDt: string;
  updatedDt: string;
  firstTradeAfterBotStart: boolean;
  autoBot: string | null;
  lotNumber?: string | null;
}

export interface AccountSummary {
  account: string;
  fullname: string | null;
  status: string;
  role: string | null;
  typeMoney: string | null;
  botStatus: string;
  onlineDate: string | null;
  licenseExpiredDt: string | null;
  remainingDays: number;
  balance: number;
  profit: number;
  autoBotProfit: number;
  manualProfit: number;
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  botTrades: number;
  winRate: number;
  bestTrade: number;
  worstTrade: number;
  daily: DailyPoint[];
}

// ---------------- Logs ----------------

export interface SystemLog {
  id: number;
  account: string;
  logs: string;
  createdDt: string;
}
