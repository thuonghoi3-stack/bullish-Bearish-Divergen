import type { Candle, PaperBook, Signal } from "./types";

/** Non-overlapping hold: enter at signal close, exit `hold` bars later. 10 bps each side. */
export function simulateHold(
  signals: Signal[],
  candles: Candle[],
  hold: number,
  fee = 0.001,
): PaperBook {
  const ordered = [...signals].sort((a, b) => a.index - b.index || a.t - b.t);
  let equity = 1;
  let peak = 1;
  let maxDd = 0;
  let cursor = -1;
  let trades = 0;
  let sum = 0;
  const points: PaperBook["points"] = [];
  const firstT = candles[0]?.t;
  if (firstT != null) points.push({ t: firstT, equity: 1 });

  for (const signal of ordered) {
    if (signal.index <= cursor) continue;
    const exit = candles[signal.index + hold];
    if (!exit || exit.c <= 0 || signal.close <= 0) continue;
    const raw = exit.c / signal.close - 1;
    const dir = signal.type === "bullish" ? 1 : -1;
    const pnl = dir * raw - 2 * fee;
    equity *= 1 + pnl;
    if (!Number.isFinite(equity)) break;
    trades += 1;
    sum += pnl;
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
    points.push({ t: exit.t, equity });
    cursor = signal.index + hold;
  }

  if (points.length === 1 && candles.length > 1) {
    const last = candles[candles.length - 1]!;
    points.push({ t: last.t, equity: 1 });
  }

  return {
    points,
    trades,
    maxDd,
    end: equity,
    avg: trades ? sum / trades : null,
  };
}
