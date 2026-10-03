import { createServerFn } from "@tanstack/react-start";
import {
  DEFAULT_INTERVAL,
  DEFAULT_LIMIT,
  DEFAULT_SYMBOL,
  isInterval,
  isSymbol,
} from "./constants";
import { generateSynthetic } from "../strategy/synthetic";
import type { Candle, MarketPayload } from "../strategy/types";

const BINANCE_ENDPOINTS = [
  "https://data-api.binance.vision/api/v3/klines",
  "https://api.binance.com/api/v3/klines",
];

async function fetchFromBinance(
  symbol: string,
  interval: string,
  limit: number,
): Promise<Candle[]> {
  let lastError: unknown;
  for (const base of BINANCE_ENDPOINTS) {
    try {
      const url = `${base}?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`;
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }
      const raw = (await response.json()) as unknown;
      if (!Array.isArray(raw) || raw.length < 30) {
        lastError = new Error("empty klines");
        continue;
      }
      return raw.map((row) => {
        const r = row as Array<string | number>;
        return {
          t: Number(r[0]),
          o: Number(r[1]),
          h: Number(r[2]),
          l: Number(r[3]),
          c: Number(r[4]),
          v: Number(r[5]),
        };
      });
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("binance failed");
}

export const fetchKlines = createServerFn({ method: "GET" })
  .validator((data: unknown) => {
    const d = (data ?? {}) as {
      symbol?: string;
      interval?: string;
      limit?: number;
    };
    const symbol = isSymbol(d.symbol ?? "") ? d.symbol! : DEFAULT_SYMBOL;
    const interval = isInterval(d.interval ?? "") ? d.interval! : DEFAULT_INTERVAL;
    const limit = Math.min(Math.max(Number(d.limit) || DEFAULT_LIMIT, 80), 500);
    return { symbol, interval, limit };
  })
  .handler(async ({ data }): Promise<MarketPayload> => {
    try {
      const candles = await fetchFromBinance(data.symbol, data.interval, data.limit);
      return {
        symbol: data.symbol,
        interval: data.interval,
        source: "binance",
        fetchedAt: Date.now(),
        candles,
      };
    } catch {
      return {
        symbol: data.symbol,
        interval: data.interval,
        source: "synthetic",
        fetchedAt: Date.now(),
        candles: generateSynthetic(data.symbol, data.interval, data.limit),
      };
    }
  });
