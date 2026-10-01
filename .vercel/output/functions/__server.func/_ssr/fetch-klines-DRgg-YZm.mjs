import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as isInterval, i as generateSynthetic, o as isSymbol, t as DEFAULT_SYMBOL } from "./synthetic-BHuFGOVF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch-klines-DRgg-YZm.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var BINANCE_ENDPOINTS = ["https://api.binance.com/api/v3/klines", "https://data-api.binance.vision/api/v3/klines"];
async function fetchFromBinance(symbol, interval, limit) {
	let lastError;
	for (const base of BINANCE_ENDPOINTS) try {
		const url = `${base}?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=${limit}`;
		const response = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(8e3)
		});
		if (!response.ok) {
			lastError = /* @__PURE__ */ new Error(`HTTP ${response.status}`);
			continue;
		}
		const raw = await response.json();
		if (!Array.isArray(raw) || raw.length < 30) {
			lastError = /* @__PURE__ */ new Error("empty klines");
			continue;
		}
		return raw.map((row) => {
			const r = row;
			return {
				t: Number(r[0]),
				o: Number(r[1]),
				h: Number(r[2]),
				l: Number(r[3]),
				c: Number(r[4]),
				v: Number(r[5])
			};
		});
	} catch (err) {
		lastError = err;
	}
	throw lastError instanceof Error ? lastError : /* @__PURE__ */ new Error("binance failed");
}
var fetchKlines_createServerFn_handler = createServerRpc({
	id: "1a161fec8b152c453a6ea88bfdff59b730de565863b1c7f6828224e93771bc17",
	name: "fetchKlines",
	filename: "src/lib/market/fetch-klines.ts"
}, (opts) => fetchKlines.__executeServer(opts));
var fetchKlines = createServerFn({ method: "GET" }).validator((data) => {
	const d = data ?? {};
	return {
		symbol: isSymbol(d.symbol ?? "") ? d.symbol : DEFAULT_SYMBOL,
		interval: isInterval(d.interval ?? "") ? d.interval : "1h",
		limit: Math.min(Math.max(Number(d.limit) || 400, 80), 500)
	};
}).handler(fetchKlines_createServerFn_handler, async ({ data }) => {
	try {
		const candles = await fetchFromBinance(data.symbol, data.interval, data.limit);
		return {
			symbol: data.symbol,
			interval: data.interval,
			source: "binance",
			fetchedAt: Date.now(),
			candles
		};
	} catch {
		return {
			symbol: data.symbol,
			interval: data.interval,
			source: "synthetic",
			fetchedAt: Date.now(),
			candles: generateSynthetic(data.symbol, data.interval, data.limit)
		};
	}
});
//#endregion
export { fetchKlines_createServerFn_handler };
