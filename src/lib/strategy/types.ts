export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type DivergenceKind = "regular" | "hidden";
export type FamilyFilter = "regular" | "hidden" | "both";

export type Bar = Candle & {
  rsi: number | null;
  closeMax: number | null;
  closeMin: number | null;
  rsiMax: number | null;
  rsiMin: number | null;
  bearishDivergence: boolean;
  bullishDivergence: boolean;
  hiddenBullish: boolean;
  hiddenBearish: boolean;
  signalStart: boolean;
  hiddenBullStart: boolean;
  hiddenBearStart: boolean;
  ret5: number | null;
  ret10: number | null;
  ret20: number | null;
};

export type Signal = {
  id: string;
  index: number;
  t: number;
  type: "bullish" | "bearish";
  kind: DivergenceKind;
  close: number;
  rsi: number;
  closeExtreme: number;
  rsiExtreme: number;
  strength: number;
  ret5: number | null;
  ret10: number | null;
  ret20: number | null;
};

export type StrategyStats = {
  bullish: number;
  bearish: number;
  hidden: number;
  regular: number;
  total: number;
  hit5: number | null;
  avgRet5Bull: number | null;
  avgRet5Bear: number | null;
  last: Signal | null;
};

export type MarketPayload = {
  symbol: string;
  interval: string;
  source: "binance" | "synthetic";
  fetchedAt: number;
  candles: Candle[];
};

export type EquityPoint = {
  t: number;
  equity: number;
};

export type PaperBook = {
  points: EquityPoint[];
  trades: number;
  maxDd: number;
  end: number;
  avg: number | null;
};
