//#region node_modules/.nitro/vite/services/ssr/assets/synthetic-BHuFGOVF.js
var SYMBOLS = [
	{
		id: "BTCUSDT",
		base: "BTC",
		quote: "USDT",
		seed: 64250
	},
	{
		id: "ETHUSDT",
		base: "ETH",
		quote: "USDT",
		seed: 3120
	},
	{
		id: "SOLUSDT",
		base: "SOL",
		quote: "USDT",
		seed: 148
	},
	{
		id: "BNBUSDT",
		base: "BNB",
		quote: "USDT",
		seed: 590
	},
	{
		id: "XRPUSDT",
		base: "XRP",
		quote: "USDT",
		seed: .62
	},
	{
		id: "DOGEUSDT",
		base: "DOGE",
		quote: "USDT",
		seed: .14
	},
	{
		id: "AVAXUSDT",
		base: "AVAX",
		quote: "USDT",
		seed: 28
	},
	{
		id: "LINKUSDT",
		base: "LINK",
		quote: "USDT",
		seed: 14.8
	}
];
var INTERVALS = [
	{
		id: "15m",
		label: "15m",
		ms: 9e5
	},
	{
		id: "1h",
		label: "1H",
		ms: 36e5
	},
	{
		id: "4h",
		label: "4H",
		ms: 144e5
	},
	{
		id: "1d",
		label: "1D",
		ms: 864e5
	}
];
var DEFAULT_SYMBOL = "BTCUSDT";
function isSymbol(v) {
	return SYMBOLS.some((s) => s.id === v);
}
function isInterval(v) {
	return INTERVALS.some((s) => s.id === v);
}
function pairLabel(id) {
	const found = SYMBOLS.find((s) => s.id === id);
	if (!found) return id;
	return `${found.base}/${found.quote}`;
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 >>> 0;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hashString(s) {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return h >>> 0;
}
function randn(rng) {
	const u = Math.max(rng(), 1e-9);
	const v = Math.max(rng(), 1e-9);
	return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function generateSynthetic(symbol, interval, limit = 400, now = Date.now()) {
	const meta = SYMBOLS.find((s) => s.id === symbol) ?? SYMBOLS[0];
	const tf = INTERVALS.find((s) => s.id === interval) ?? INTERVALS[1];
	const rng = mulberry32(hashString(`${meta.id}:${tf.id}:v3`));
	const step = tf.ms;
	const aligned = Math.floor(now / step) * step;
	const hourScale = Math.sqrt(step / INTERVALS[1].ms);
	const vol = .0075 * hourScale;
	let price = meta.seed * (.92 + rng() * .16);
	let drift = (rng() - .5) * 8e-4 * hourScale;
	const candles = [];
	for (let i = 0; i < limit; i++) {
		if (rng() < .018) drift = (rng() - .5) * .0014 * hourScale;
		const shock = randn(rng) * vol;
		const next = Math.max(price * (1 + drift + shock), meta.seed * .12);
		const wick = vol * (.25 + rng() * .9);
		const open = price;
		const close = next;
		const high = Math.max(open, close) * (1 + rng() * wick);
		const low = Math.min(open, close) * (1 - rng() * wick);
		const t = aligned - (limit - 1 - i) * step;
		candles.push({
			t,
			o: open,
			h: high,
			l: Math.max(low, 1e-8),
			c: close,
			v: meta.seed * (80 + rng() * 420) * hourScale
		});
		price = next;
	}
	injectDivergence(candles, rng, .72, "bear");
	injectDivergence(candles, rng, .48, "bull");
	injectDivergence(candles, rng, .88, "bear");
	return candles;
}
function injectDivergence(candles, rng, loc, kind) {
	const n = candles.length;
	const center = Math.min(n - 28, Math.max(40, Math.floor(n * loc)));
	if (kind === "bear") {
		const a = candles[center - 18];
		candles[center];
		const peak1 = a.c * (1.01 + rng() * .01);
		const peak2 = peak1 * (1.012 + rng() * .01);
		stampPeak(candles, center - 18, peak1, rng);
		stampPeak(candles, center, peak2, rng);
		for (let k = center - 8; k <= center; k++) {
			const bar = candles[k];
			if (!bar) continue;
			bar.c = bar.c * (.997 + (k - (center - 8)) * .0016);
			bar.h = Math.max(bar.h, bar.c);
			bar.l = Math.min(bar.l, bar.o, bar.c);
		}
	} else {
		const trough1 = candles[center - 16].c * (.985 - rng() * .01);
		const trough2 = trough1 * (.985 - rng() * .008);
		stampTrough(candles, center - 16, trough1, rng);
		stampTrough(candles, center, trough2, rng);
		for (let k = center - 7; k <= center; k++) {
			const bar = candles[k];
			if (!bar) continue;
			bar.c = bar.c * (1.002 + (k - (center - 7)) * .0014);
			bar.l = Math.min(bar.l, bar.c);
			bar.h = Math.max(bar.h, bar.o, bar.c);
		}
	}
}
function stampPeak(candles, i, price, rng) {
	const bar = candles[i];
	if (!bar) return;
	bar.h = price;
	bar.c = price * (.996 + rng() * .003);
	bar.o = bar.c * (.994 + rng() * .004);
	bar.l = Math.min(bar.l, bar.o, bar.c);
}
function stampTrough(candles, i, price, rng) {
	const bar = candles[i];
	if (!bar) return;
	bar.l = price;
	bar.c = price * (1.002 + rng() * .003);
	bar.o = bar.c * (1.002 + rng() * .004);
	bar.h = Math.max(bar.h, bar.o, bar.c);
}
//#endregion
export { isInterval as a, generateSynthetic as i, INTERVALS as n, isSymbol as o, SYMBOLS as r, pairLabel as s, DEFAULT_SYMBOL as t };
