import type { Candle } from "./types";
import { INTERVALS, SYMBOLS, type IntervalId, type SymbolId } from "../market/constants";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function randn(rng: () => number): number {
  const u = Math.max(rng(), 1e-9);
  const v = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function generateSynthetic(
  symbol: string,
  interval: string,
  limit = 400,
  now = Date.now(),
): Candle[] {
  const meta = SYMBOLS.find((s) => s.id === symbol) ?? SYMBOLS[0];
  const tf = INTERVALS.find((s) => s.id === interval) ?? INTERVALS[1];
  const rng = mulberry32(hashString(`${meta.id}:${tf.id}:v3`));
  const step = tf.ms;
  const aligned = Math.floor(now / step) * step;
  const hourScale = Math.sqrt(step / INTERVALS[1].ms);
  const vol = 0.0075 * hourScale;

  let price = meta.seed * (0.92 + rng() * 0.16);
  let drift = (rng() - 0.5) * 0.0008 * hourScale;
  const candles: Candle[] = [];

  for (let i = 0; i < limit; i++) {
    if (rng() < 0.018) drift = (rng() - 0.5) * 0.0014 * hourScale;
    const shock = randn(rng) * vol;
    const next = Math.max(price * (1 + drift + shock), meta.seed * 0.12);
    const wick = vol * (0.25 + rng() * 0.9);
    const open = price;
    const close = next;
    const high = Math.max(open, close) * (1 + rng() * wick);
    const low = Math.min(open, close) * (1 - rng() * wick);
    const t = aligned - (limit - 1 - i) * step;
    candles.push({
      t,
      o: open,
      h: high,
      l: Math.max(low, 0.00000001),
      c: close,
      v: meta.seed * (80 + rng() * 420) * hourScale,
    });
    price = next;
  }

  // Inject a few textbook divergences so the desk always has something to show.
  injectDivergence(candles, rng, 0.72, "bear");
  injectDivergence(candles, rng, 0.48, "bull");
  injectDivergence(candles, rng, 0.88, "bear");
  return candles;
}

function injectDivergence(
  candles: Candle[],
  rng: () => number,
  loc: number,
  kind: "bull" | "bear",
) {
  const n = candles.length;
  const center = Math.min(n - 28, Math.max(40, Math.floor(n * loc)));
  if (kind === "bear") {
    const a = candles[center - 18]!;
    const b = candles[center]!;
    const peak1 = a.c * (1.01 + rng() * 0.01);
    const peak2 = peak1 * (1.012 + rng() * 0.01);
    stampPeak(candles, center - 18, peak1, rng);
    stampPeak(candles, center, peak2, rng);
    // Fade momentum into the second peak so RSI lags price.
    for (let k = center - 8; k <= center; k++) {
      const bar = candles[k];
      if (!bar) continue;
      bar.c = bar.c * (0.997 + (k - (center - 8)) * 0.0016);
      bar.h = Math.max(bar.h, bar.c);
      bar.l = Math.min(bar.l, bar.o, bar.c);
    }
    void b;
  } else {
    const trough1 = candles[center - 16]!.c * (0.985 - rng() * 0.01);
    const trough2 = trough1 * (0.985 - rng() * 0.008);
    stampTrough(candles, center - 16, trough1, rng);
    stampTrough(candles, center, trough2, rng);
    for (let k = center - 7; k <= center; k++) {
      const bar = candles[k];
      if (!bar) continue;
      bar.c = bar.c * (1.002 + (k - (center - 7)) * 0.0014);
      bar.l = Math.min(bar.l, bar.c);
      bar.h = Math.max(bar.h, bar.o, bar.c);
    }
  }
}

function stampPeak(candles: Candle[], i: number, price: number, rng: () => number) {
  const bar = candles[i];
  if (!bar) return;
  bar.h = price;
  bar.c = price * (0.996 + rng() * 0.003);
  bar.o = bar.c * (0.994 + rng() * 0.004);
  bar.l = Math.min(bar.l, bar.o, bar.c);
}

function stampTrough(candles: Candle[], i: number, price: number, rng: () => number) {
  const bar = candles[i];
  if (!bar) return;
  bar.l = price;
  bar.c = price * (1.002 + rng() * 0.003);
  bar.o = bar.c * (1.002 + rng() * 0.004);
  bar.h = Math.max(bar.h, bar.o, bar.c);
}

export function isSymbolId(v: string): v is SymbolId {
  return SYMBOLS.some((s) => s.id === v);
}

export function isIntervalId(v: string): v is IntervalId {
  return INTERVALS.some((s) => s.id === v);
}
