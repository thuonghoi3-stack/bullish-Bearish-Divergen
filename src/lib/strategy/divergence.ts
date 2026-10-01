import type { Bar, Candle, Signal, StrategyStats } from "./types";
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

export function runDivergence(
  candles: Candle[],
  lookback: number,
  rsiPeriod: number,
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
      r != null &&
      cMax != null &&
      rMax != null &&
      candle.c >= cMax &&
      r < rMax;
    const bullish =
      r != null &&
      cMin != null &&
      rMin != null &&
      candle.c <= cMin &&
      r > rMin;
    return {
      ...candle,
      rsi: r,
      closeMax: cMax,
      closeMin: cMin,
      rsiMax: rMax,
      rsiMin: rMin,
      bearishDivergence: bearish,
      bullishDivergence: bullish,
      signalStart: false,
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
  }

  const signals: Signal[] = [];
  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i]!;
    if (!bar.signalStart) continue;
    if (bar.bullishDivergence && bar.rsi != null && bar.closeMin != null && bar.rsiMin != null) {
      signals.push({
        id: `${bar.t}-bull`,
        index: i,
        t: bar.t,
        type: "bullish",
        close: bar.c,
        rsi: bar.rsi,
        closeExtreme: bar.closeMin,
        rsiExtreme: bar.rsiMin,
        ret5: bar.ret5,
        ret10: bar.ret10,
        ret20: bar.ret20,
      });
    }
    if (bar.bearishDivergence && bar.rsi != null && bar.closeMax != null && bar.rsiMax != null) {
      signals.push({
        id: `${bar.t}-bear`,
        index: i,
        t: bar.t,
        type: "bearish",
        close: bar.c,
        rsi: bar.rsi,
        closeExtreme: bar.closeMax,
        rsiExtreme: bar.rsiMax,
        ret5: bar.ret5,
        ret10: bar.ret10,
        ret20: bar.ret20,
      });
    }
  }

  const scored = signals.filter((s) => s.ret5 != null);
  const hits = scored.filter((s) =>
    s.type === "bullish" ? s.ret5! > 0 : s.ret5! < 0,
  );
  const bullRets = signals.filter((s) => s.type === "bullish" && s.ret5 != null).map((s) => s.ret5!);
  const bearRets = signals.filter((s) => s.type === "bearish" && s.ret5 != null).map((s) => s.ret5!);

  const stats: StrategyStats = {
    bullish: signals.filter((s) => s.type === "bullish").length,
    bearish: signals.filter((s) => s.type === "bearish").length,
    total: signals.length,
    hit5: scored.length ? hits.length / scored.length : null,
    avgRet5Bull: mean(bullRets),
    avgRet5Bear: mean(bearRets),
    last: signals.length ? signals[signals.length - 1]! : null,
  };

  return { bars, signals, stats };
}
