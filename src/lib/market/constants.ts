export const SYMBOLS = [
  { id: "BTCUSDT", base: "BTC", quote: "USDT", seed: 64250 },
  { id: "ETHUSDT", base: "ETH", quote: "USDT", seed: 3120 },
  { id: "SOLUSDT", base: "SOL", quote: "USDT", seed: 148 },
  { id: "BNBUSDT", base: "BNB", quote: "USDT", seed: 590 },
  { id: "XRPUSDT", base: "XRP", quote: "USDT", seed: 0.62 },
  { id: "DOGEUSDT", base: "DOGE", quote: "USDT", seed: 0.14 },
  { id: "AVAXUSDT", base: "AVAX", quote: "USDT", seed: 28 },
  { id: "LINKUSDT", base: "LINK", quote: "USDT", seed: 14.8 },
] as const;

export const INTERVALS = [
  { id: "15m", label: "15m", ms: 15 * 60 * 1000 },
  { id: "1h", label: "1H", ms: 60 * 60 * 1000 },
  { id: "4h", label: "4H", ms: 4 * 60 * 60 * 1000 },
  { id: "1d", label: "1D", ms: 24 * 60 * 60 * 1000 },
] as const;

export type SymbolId = (typeof SYMBOLS)[number]["id"];
export type IntervalId = (typeof INTERVALS)[number]["id"];

export const DEFAULT_SYMBOL: SymbolId = "BTCUSDT";
export const DEFAULT_INTERVAL: IntervalId = "1h";
export const DEFAULT_LOOKBACK = 20;
export const DEFAULT_RSI_PERIOD = 14;
export const DEFAULT_LIMIT = 400;

export function isSymbol(v: string): v is SymbolId {
  return SYMBOLS.some((s) => s.id === v);
}

export function isInterval(v: string): v is IntervalId {
  return INTERVALS.some((s) => s.id === v);
}

export function pairLabel(id: string): string {
  const found = SYMBOLS.find((s) => s.id === id);
  if (!found) return id;
  return `${found.base}/${found.quote}`;
}
