import type {
  Bar,
  Candle,
  DivergenceKind,
  FamilyFilter,
  Signal,
  StrategyStats,
} from "./types";
import { wilderRsi } from "./rsi";

/**
 * pandas: series.rolling(lb).max().shift(1)
 * At index i (i >= lb): max of values[i-lb .. i-1] — previous `lb` bars, excluding current.
 */
function rollingPrevMax(values: Array<number | null>, lb: number): (number | null)[] {
  const n = values.length;
  const out: (number | null)[] = Array(n).fill(null);
  for (let i = lb; i < n; i++) {
    let m = -Infinity;
    let ok = true;
    for (let j = i - lb; j < i; j++) {
      const v = values[j];
      if (v == null || !Number.isFinite(v)) {
        ok = false;
        break;
      }
      if (v > m) m = v;
    }
    out[i] = ok ? m : null;
  }
  return out;
}

function rollingPrevMin(values: Array<number | null>, lb: number): (number | null)[] {
  const n = values.length;
  const out: (number | null)[] = Array(n).fill(null);
  for (let i = lb; i < n; i++) {
    let m = Infinity;
    let ok = true;
    for (let j = i - lb; j < i; j++) {
      const v = values[j];
      if (v == null || !Number.isFinite(v)) {
        ok = false;
        break;
      }
      if (v < m) m = v;
    }
    out[i] = ok ? m : null;
  }
  return out;
}

function fwdReturn(closes: number[], i: number, horizon: number): number | null {
  const future = closes[i + horizon];
  const now = closes[i];
  if (future == null || now == null || now === 0) return null;
  return (future - now) / now;
}

function mean(xs: number[]): number | null {
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function priorVolumeAvg(candles: Candle[], i: number, lb = 20): number | null {
  if (i < 1) return null;
  const from = Math.max(0, i - lb);
  let sum = 0;
  let n = 0;
  for (let j = from; j < i; j++) {
    sum += candles[j]!.v;
    n++;
  }
  return n ? sum / n : null;
}

/** 0–100. Zone, RSI gap vs the lookback extreme, price displacement, relative volume. */
export function signalStrength(input: {
  type: "bullish" | "bearish";
  rsi: number;
  rsiExtreme: number;
  close: number;
  closeExtreme: number;
  volume: number;
  avgVolume: number | null;
}): number {
  const zone =
    input.type === "bullish"
      ? clamp01((45 - input.rsi) / 25)
      : clamp01((input.rsi - 55) / 25);
  const gap = clamp01(Math.abs(input.rsi - input.rsiExtreme) / 12);
  const px =
    input.closeExtreme > 0
      ? clamp01(Math.abs(input.close - input.closeExtreme) / input.closeExtreme / 0.008)
      : 0;
  const vol =
    input.avgVolume && input.avgVolume > 0
      ? clamp01(input.volume / input.avgVolume / 1.5)
      : 0.4;
  return Math.round(100 * (0.5 * zone + 0.3 * gap + 0.12 * px + 0.08 * vol));
}

function makeSignal(
  bar: Bar,
  index: number,
  type: "bullish" | "bearish",
  kind: DivergenceKind,
  closeExtreme: number,
  rsiExtreme: number,
  avgVolume: number | null,
): Signal {
  return {
    id: `${bar.t}-${kind}-${type}`,
    index,
    t: bar.t,
    type,
    kind,
    close: bar.c,
    rsi: bar.rsi!,
    closeExtreme,
    rsiExtreme,
    strength: signalStrength({
      type,
      rsi: bar.rsi!,
      rsiExtreme,
      close: bar.c,
      closeExtreme,
      volume: bar.v,
      avgVolume,
    }),
    ret5: bar.ret5,
    ret10: bar.ret10,
    ret20: bar.ret20,
  };
}

export function summarizeSignals(signals: Signal[]): StrategyStats {
  const scored = signals.filter((s) => s.ret5 != null);
  const hits = scored.filter((s) => (s.type === "bullish" ? s.ret5! > 0 : s.ret5! < 0));
  const bullRets = signals.filter((s) => s.type === "bullish" && s.ret5 != null).map((s) => s.ret5!);
  const bearRets = signals.filter((s) => s.type === "bearish" && s.ret5 != null).map((s) => s.ret5!);
  return {
    bullish: signals.filter((s) => s.type === "bullish").length,
    bearish: signals.filter((s) => s.type === "bearish").length,
    hidden: signals.filter((s) => s.kind === "hidden").length,
    regular: signals.filter((s) => s.kind === "regular").length,
    total: signals.length,
    hit5: scored.length ? hits.length / scored.length : null,
    avgRet5Bull: mean(bullRets),
    avgRet5Bear: mean(bearRets),
    last: signals.length ? signals[signals.length - 1]! : null,
  };
}

export function runDivergence(
  candles: Candle[],
  lookback: number,
  rsiPeriod: number,
  family: FamilyFilter = "regular",
): { bars: Bar[]; signals: Signal[]; stats: StrategyStats } {
  const closes = candles.map((c) => c.c);
  const rsi = wilderRsi(closes, rsiPeriod);
  const closeMax = rollingPrevMax(closes, lookback);
  const closeMin = rollingPrevMin(closes, lookback);
  const rsiMax = rollingPrevMax(rsi, lookback);
  const rsiMin = rollingPrevMin(rsi, lookback);

  const bars: Bar[] = candles.map((candle, i) => {
    const r = rsi[i];
    const cMax = closeMax[i];
    const cMin = closeMin[i];
    const rMax = rsiMax[i];
    const rMin = rsiMin[i];
    const bearish =
      r != null && cMax != null && rMax != null && candle.c >= cMax && r < rMax;
    const bullish =
      r != null && cMin != null && rMin != null && candle.c <= cMin && r > rMin;
    // Hidden continuation, same rolling window as the Freqtrade regular rule.
    // Bullish hidden: RSI prints a new low, price does not (higher low).
    // Bearish hidden: RSI prints a new high, price does not (lower high).
    const hiddenBullish =
      r != null && cMin != null && rMin != null && candle.c > cMin && r <= rMin;
    const hiddenBearish =
      r != null && cMax != null && rMax != null && candle.c < cMax && r >= rMax;
    return {
      ...candle,
      rsi: r,
      closeMax: cMax,
      closeMin: cMin,
      rsiMax: rMax,
      rsiMin: rMin,
      bearishDivergence: bearish,
      bullishDivergence: bullish,
      hiddenBullish,
      hiddenBearish,
      signalStart: false,
      hiddenBullStart: false,
      hiddenBearStart: false,
      ret5: fwdReturn(closes, i, 5),
      ret10: fwdReturn(closes, i, 10),
      ret20: fwdReturn(closes, i, 20),
    };
  });

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i]!;
    const prev = i > 0 ? bars[i - 1] : null;
    bar.signalStart =
      (bar.bullishDivergence && !prev?.bullishDivergence) ||
      (bar.bearishDivergence && !prev?.bearishDivergence);
    bar.hiddenBullStart = bar.hiddenBullish && !prev?.hiddenBullish;
    bar.hiddenBearStart = bar.hiddenBearish && !prev?.hiddenBearish;
  }

  const wantRegular = family !== "hidden";
  const wantHidden = family !== "regular";
  const signals: Signal[] = [];

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i]!;
    const avgV = priorVolumeAvg(candles, i);
    if (
      wantRegular &&
      bar.signalStart &&
      bar.bullishDivergence &&
      bar.rsi != null &&
      bar.closeMin != null &&
      bar.rsiMin != null
    ) {
      signals.push(makeSignal(bar, i, "bullish", "regular", bar.closeMin, bar.rsiMin, avgV));
    }
    if (
      wantRegular &&
      bar.signalStart &&
      bar.bearishDivergence &&
      bar.rsi != null &&
      bar.closeMax != null &&
      bar.rsiMax != null
    ) {
      signals.push(makeSignal(bar, i, "bearish", "regular", bar.closeMax, bar.rsiMax, avgV));
    }
    if (
      wantHidden &&
      bar.hiddenBullStart &&
      bar.rsi != null &&
      bar.closeMin != null &&
      bar.rsiMin != null
    ) {
      signals.push(makeSignal(bar, i, "bullish", "hidden", bar.closeMin, bar.rsiMin, avgV));
    }
    if (
      wantHidden &&
      bar.hiddenBearStart &&
      bar.rsi != null &&
      bar.closeMax != null &&
      bar.rsiMax != null
    ) {
      signals.push(makeSignal(bar, i, "bearish", "hidden", bar.closeMax, bar.rsiMax, avgV));
    }
  }

  return { bars, signals, stats: summarizeSignals(signals) };
}
