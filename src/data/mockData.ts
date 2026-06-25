// Typed mock data for pages that don't have a backing API yet.
// Replace each export with a real fetch once the corresponding
// backend endpoint exists — the shapes below are the intended contract.

export type TransactionType = "Deposit" | "Withdrawal";
export type TransactionStatus = "Completed" | "Pending" | "Failed";

export interface Transaction {
  id: string;
  type: TransactionType;
  method: string;
  amount: number;
  status: TransactionStatus;
  date: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "tx-1", type: "Deposit", method: "M-Pesa", amount: 200, status: "Completed", date: "2026-06-18" },
  { id: "tx-2", type: "Withdrawal", method: "Bank Transfer", amount: 120, status: "Completed", date: "2026-06-15" },
  { id: "tx-3", type: "Deposit", method: "Binance Pay", amount: 500, status: "Completed", date: "2026-06-10" },
  { id: "tx-4", type: "Withdrawal", method: "Visa", amount: 80, status: "Pending", date: "2026-06-08" },
  { id: "tx-5", type: "Deposit", method: "Airtel Money", amount: 150, status: "Failed", date: "2026-06-02" },
];

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "mpesa", name: "M-Pesa", icon: "📱", description: "Instant mobile money deposits" },
  { id: "airtel", name: "Airtel Money", icon: "📲", description: "Mobile money across Africa" },
  { id: "bank", name: "Bank Transfer", icon: "🏦", description: "1-3 business day settlement" },
  { id: "card", name: "Mastercard / Visa", icon: "💳", description: "Instant card deposits" },
  { id: "binance", name: "Binance Pay", icon: "🟡", description: "Crypto deposits, zero fees" },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  unlocked: boolean;
}

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-1", title: "First Trade", description: "Place your very first trade", icon: "🎯", progress: 100, unlocked: true },
  { id: "ach-2", title: "10 Trades", description: "Complete 10 trades", icon: "📈", progress: 100, unlocked: true },
  { id: "ach-3", title: "First Profit", description: "Close a trade in profit", icon: "💰", progress: 100, unlocked: true },
  { id: "ach-4", title: "Weekly Streak", description: "Trade 7 days in a row", icon: "🔥", progress: 57, unlocked: false },
  { id: "ach-5", title: "Risk Control", description: "Keep a single stake under 5% of balance for 20 trades", icon: "🛡️", progress: 40, unlocked: false },
  { id: "ach-6", title: "Century Club", description: "Complete 100 trades", icon: "🏆", progress: 23, unlocked: false },
];

export type TournamentStatus = "active" | "upcoming" | "completed";

export interface Tournament {
  id: string;
  name: string;
  status: TournamentStatus;
  prizePool: number;
  entryFee: number;
  participants: number;
  startTime: string;
  endTime: string;
}

export const MOCK_TOURNAMENTS: Tournament[] = [
  { id: "trn-1", name: "Weekend Sprint", status: "active", prizePool: 2000, entryFee: 10, participants: 184, startTime: "2026-06-24T09:00:00Z", endTime: "2026-06-26T21:00:00Z" },
  { id: "trn-2", name: "OTC Masters", status: "active", prizePool: 5000, entryFee: 25, participants: 312, startTime: "2026-06-23T00:00:00Z", endTime: "2026-06-30T00:00:00Z" },
  { id: "trn-3", name: "Crypto Clash", status: "upcoming", prizePool: 3500, entryFee: 15, participants: 76, startTime: "2026-07-02T00:00:00Z", endTime: "2026-07-05T00:00:00Z" },
  { id: "trn-4", name: "Rookie Cup", status: "upcoming", prizePool: 800, entryFee: 0, participants: 401, startTime: "2026-07-01T00:00:00Z", endTime: "2026-07-03T00:00:00Z" },
  { id: "trn-5", name: "Midweek Showdown", status: "completed", prizePool: 1500, entryFee: 5, participants: 220, startTime: "2026-06-10T00:00:00Z", endTime: "2026-06-12T00:00:00Z" },
];

export interface LeaderboardEntry {
  rank: number;
  name: string;
  profit: number;
}

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "TraderX_254", profit: 842.5 },
  { rank: 2, name: "FxQueen", profit: 711.2 },
  { rank: 3, name: "PipHunter", profit: 690.0 },
  { rank: 4, name: "CandleKing", profit: 533.8 },
  { rank: 5, name: "Maris_OTC", profit: 498.6 },
];

export interface ChatConversation {
  id: string;
  name: string;
  lastMessage: string;
  unread: number;
  online: boolean;
}

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  { id: "conv-support", name: "NeuroOption Support", lastMessage: "Let us know if you need anything else!", unread: 0, online: true },
  { id: "conv-community", name: "Community Lounge", lastMessage: "GBP/USD looking bullish today 👀", unread: 3, online: true },
  { id: "conv-signals", name: "Signals Desk", lastMessage: "New signal posted for BTC/USD OTC", unread: 1, online: false },
];

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "support";
  text: string;
  time: string;
}

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: "msg-1", conversationId: "conv-support", sender: "support", text: "Hi! Welcome to NeuroOption support. How can we help?", time: "09:01" },
  { id: "msg-2", conversationId: "conv-support", sender: "user", text: "My withdrawal is still pending after 2 days.", time: "09:03" },
  { id: "msg-3", conversationId: "conv-support", sender: "support", text: "Sorry about that! Let me check your account now.", time: "09:04" },
  { id: "msg-4", conversationId: "conv-support", sender: "support", text: "Your bank transfer is confirmed and should land within 24 hours.", time: "09:06" },
  { id: "msg-5", conversationId: "conv-support", sender: "user", text: "Thank you for the quick response!", time: "09:07" },
];

export interface FaqCategory {
  id: string;
  name: string;
  icon: string;
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { id: "account", name: "Account", icon: "👤" },
  { id: "deposits", name: "Deposits", icon: "💵" },
  { id: "withdrawals", name: "Withdrawals", icon: "🏦" },
  { id: "trading", name: "Trading", icon: "📈" },
  { id: "kyc", name: "KYC", icon: "🪪" },
  { id: "security", name: "Security", icon: "🔒" },
];

export interface FaqItem {
  id: string;
  categoryId: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  { id: "faq-1", categoryId: "account", question: "How do I switch between Demo and Real accounts?", answer: "Use the account type selector in the top bar of the trading screen to switch instantly between Demo and Real." },
  { id: "faq-2", categoryId: "deposits", question: "Which deposit methods are supported?", answer: "M-Pesa, Airtel Money, Bank Transfer, Mastercard/Visa, and Binance Pay are all supported on the Finance page." },
  { id: "faq-3", categoryId: "deposits", question: "How long do deposits take to reflect?", answer: "Mobile money and card deposits are usually instant. Bank transfers can take 1-3 business days." },
  { id: "faq-4", categoryId: "withdrawals", question: "Why is my withdrawal still pending?", answer: "Withdrawals are reviewed for security and typically clear within 24-48 hours depending on the method." },
  { id: "faq-5", categoryId: "trading", question: "What is OTC trading?", answer: "OTC (Over-The-Counter) assets are available on weekends and outside regular market hours with synthetic pricing." },
  { id: "faq-6", categoryId: "trading", question: "How is payout percentage calculated?", answer: "Payout is shown before you confirm a trade and depends on the asset, expiry, and current market conditions." },
  { id: "faq-7", categoryId: "kyc", question: "What documents do I need for KYC?", answer: "A valid government ID and a recent proof of address are required to verify your account." },
  { id: "faq-8", categoryId: "security", question: "How do I enable two-factor authentication?", answer: "2FA can be enabled from the Security section of your Profile page (coming soon)." },
];

export type SignalDirection = "BUY" | "SELL";
export type SignalStrength = "Weak" | "Moderate" | "Strong";

export interface TradingSignal {
  id: string;
  asset: string;
  direction: SignalDirection;
  confidence: number;
  strength: SignalStrength;
  suggestedExpiry: string;
  generatedAt: string;
}

export const MOCK_SIGNALS: TradingSignal[] = [
  { id: "sig-1", asset: "EUR/USD OTC", direction: "BUY", confidence: 78, strength: "Strong", suggestedExpiry: "M5", generatedAt: "2 min ago" },
  { id: "sig-2", asset: "BTC/USD OTC", direction: "SELL", confidence: 64, strength: "Moderate", suggestedExpiry: "M1", generatedAt: "6 min ago" },
  { id: "sig-3", asset: "GBP/USD OTC", direction: "BUY", confidence: 55, strength: "Moderate", suggestedExpiry: "M15", generatedAt: "11 min ago" },
  { id: "sig-4", asset: "USD/JPY OTC", direction: "SELL", confidence: 41, strength: "Weak", suggestedExpiry: "M5", generatedAt: "18 min ago" },
  { id: "sig-5", asset: "AUD/CAD OTC", direction: "BUY", confidence: 72, strength: "Strong", suggestedExpiry: "M30", generatedAt: "25 min ago" },
];

export type RiskScore = "Low" | "Medium" | "High";

export interface Trader {
  id: string;
  name: string;
  initials: string;
  winRate: number;
  followers: number;
  profitPercent: number;
  riskScore: RiskScore;
  rank: number;
}

export const MOCK_TRADERS: Trader[] = [
  { id: "trd-1", name: "TraderX_254", initials: "TX", winRate: 81, followers: 2310, profitPercent: 142, riskScore: "Medium", rank: 1 },
  { id: "trd-2", name: "FxQueen", initials: "FQ", winRate: 76, followers: 1890, profitPercent: 118, riskScore: "Low", rank: 2 },
  { id: "trd-3", name: "PipHunter", initials: "PH", winRate: 73, followers: 1502, profitPercent: 96, riskScore: "Medium", rank: 3 },
  { id: "trd-4", name: "CandleKing", initials: "CK", winRate: 69, followers: 980, profitPercent: 74, riskScore: "High", rank: 4 },
  { id: "trd-5", name: "Maris_OTC", initials: "MO", winRate: 65, followers: 645, profitPercent: 58, riskScore: "Medium", rank: 5 },
];

export type ExpressTradeStatus = "WON" | "LOST" | "PENDING";

export interface ExpressTradeRecord {
  id: string;
  assets: string[];
  amount: number;
  expiry: string;
  status: ExpressTradeStatus;
  time: string;
}

export const MOCK_EXPRESS_TRADES: ExpressTradeRecord[] = [
  { id: "exp-1", assets: ["EUR/USD OTC", "BTC/USD OTC"], amount: 50, expiry: "M1", status: "WON", time: "10:42" },
  { id: "exp-2", assets: ["GBP/USD OTC"], amount: 20, expiry: "M5", status: "LOST", time: "10:30" },
  { id: "exp-3", assets: ["USD/JPY OTC", "AUD/CAD OTC", "ETH/USD OTC"], amount: 100, expiry: "M1", status: "PENDING", time: "10:55" },
];
