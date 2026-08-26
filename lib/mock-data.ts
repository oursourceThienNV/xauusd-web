export type AccountStatus = "ACTIVE" | "BLOCKED" | "EXPIRED";

export type Account = {
  id: number;
  accountNumber: string;
  broker: string;
  server: string;
  balance: number;
  equity: number;
  profit: number;
  status: AccountStatus;
  expiredAt: string;
  lastSeen: string;
};

export type Trade = {
  id: number;
  accountNumber: string;
  ticket: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  closePrice: number;
  stopLoss: number;
  takeProfit: number;
  profit: number;
  commission: number;
  swap: number;
  openTime: string;
  closeTime: string;
};

export const accounts: Account[] = [
  {
    id: 1, accountNumber: "12345678", broker: "Exness", server: "Exness-MT5Real",
    balance: 1280.5, equity: 1291.2, profit: 180.5, status: "ACTIVE",
    expiredAt: "2026-09-30", lastSeen: "2 sec ago",
  },
  {
    id: 2, accountNumber: "12345679", broker: "XM", server: "XMGlobal-MT5",
    balance: 820.4, equity: 811.8, profit: -30.2, status: "ACTIVE",
    expiredAt: "2026-10-15", lastSeen: "8 sec ago",
  },
  {
    id: 3, accountNumber: "12345680", broker: "Exness", server: "Exness-MT5Real",
    balance: 2430.75, equity: 2419.1, profit: 230.15, status: "BLOCKED",
    expiredAt: "2026-09-20", lastSeen: "2 min ago",
  },
  {
    id: 4, accountNumber: "12345681", broker: "ICMarkets", server: "ICMarketsSC-Live",
    balance: 1560.2, equity: 1584.7, profit: 96.3, status: "ACTIVE",
    expiredAt: "2026-11-05", lastSeen: "4 sec ago",
  },
  {
    id: 5, accountNumber: "12345682", broker: "Exness", server: "Exness-MT5Real",
    balance: 540.8, equity: 528.3, profit: -74.9, status: "EXPIRED",
    expiredAt: "2026-08-20", lastSeen: "3 days ago",
  },
  {
    id: 6, accountNumber: "12345683", broker: "XM", server: "XMGlobal-MT5",
    balance: 3180.0, equity: 3218.4, profit: 312.8, status: "ACTIVE",
    expiredAt: "2026-12-01", lastSeen: "1 sec ago",
  },
];

export const trades: Trade[] = [
  { id:1, accountNumber:"12345678", ticket:"100001", symbol:"XAUUSD", type:"BUY", volume:.01, openPrice:3370.2, closePrice:3371.8, stopLoss:3365.2, takeProfit:3372.2, profit:1.6, commission:-.03, swap:0, openTime:"2026-08-24 08:01:12", closeTime:"2026-08-24 08:05:42" },
  { id:2, accountNumber:"12345678", ticket:"100002", symbol:"XAUUSD", type:"SELL", volume:.01, openPrice:3372.1, closePrice:3373.2, stopLoss:3377.1, takeProfit:3370.5, profit:-1.1, commission:-.03, swap:0, openTime:"2026-08-24 08:10:10", closeTime:"2026-08-24 08:14:02" },
  { id:3, accountNumber:"12345678", ticket:"100003", symbol:"XAUUSD", type:"BUY", volume:.02, openPrice:3368.5, closePrice:3371.6, stopLoss:3363.5, takeProfit:3372.5, profit:6.2, commission:-.06, swap:0, openTime:"2026-08-24 09:12:33", closeTime:"2026-08-24 09:20:11" },
  { id:4, accountNumber:"12345678", ticket:"100004", symbol:"XAUUSD", type:"BUY", volume:.01, openPrice:3374.4, closePrice:3375.9, stopLoss:3369.4, takeProfit:3377.0, profit:1.5, commission:-.03, swap:0, openTime:"2026-08-24 10:03:18", closeTime:"2026-08-24 10:07:45" },
  { id:5, accountNumber:"12345678", ticket:"100005", symbol:"XAUUSD", type:"SELL", volume:.01, openPrice:3377.3, closePrice:3375.1, stopLoss:3382.3, takeProfit:3374.8, profit:2.2, commission:-.03, swap:0, openTime:"2026-08-24 11:22:08", closeTime:"2026-08-24 11:29:20" },
  { id:6, accountNumber:"12345679", ticket:"100006", symbol:"XAUUSD", type:"SELL", volume:.01, openPrice:3375.8, closePrice:3377.1, stopLoss:3380.8, takeProfit:3373.5, profit:-1.3, commission:-.03, swap:0, openTime:"2026-08-24 08:21:02", closeTime:"2026-08-24 08:25:12" },
  { id:7, accountNumber:"12345679", ticket:"100007", symbol:"XAUUSD", type:"BUY", volume:.02, openPrice:3371.4, closePrice:3374.2, stopLoss:3366.4, takeProfit:3375.0, profit:5.6, commission:-.06, swap:0, openTime:"2026-08-24 09:02:10", closeTime:"2026-08-24 09:08:41" },
  { id:8, accountNumber:"12345680", ticket:"100008", symbol:"XAUUSD", type:"BUY", volume:.01, openPrice:3368.1, closePrice:3370.7, stopLoss:3363.1, takeProfit:3372.0, profit:2.6, commission:-.03, swap:0, openTime:"2026-08-23 10:10:00", closeTime:"2026-08-23 10:16:00" },
  { id:9, accountNumber:"12345681", ticket:"100009", symbol:"XAUUSD", type:"SELL", volume:.01, openPrice:3380.2, closePrice:3377.5, stopLoss:3385.2, takeProfit:3376.0, profit:2.7, commission:-.03, swap:0, openTime:"2026-08-22 13:02:00", closeTime:"2026-08-22 13:10:00" },
  { id:10, accountNumber:"12345683", ticket:"100010", symbol:"XAUUSD", type:"BUY", volume:.03, openPrice:3360.2, closePrice:3366.4, stopLoss:3355.2, takeProfit:3367.0, profit:18.6, commission:-.09, swap:0, openTime:"2026-08-24 15:02:00", closeTime:"2026-08-24 15:17:00" },
];

export const money = (value: number) =>
  `${value >= 0 ? "+" : "-"}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
