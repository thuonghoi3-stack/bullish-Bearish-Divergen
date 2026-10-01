import { i as __toESM } from "../_runtime.mjs";
import { c as require_react, n as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as isInterval, i as generateSynthetic, n as INTERVALS, o as isSymbol, r as SYMBOLS, s as pairLabel, t as DEFAULT_SYMBOL } from "./synthetic-BHuFGOVF.mjs";
import { a as Activity, i as ArrowDownRight, n as RefreshCw, r as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
import { a as Line, c as ReferenceLine, i as Area, l as ResponsiveContainer, n as YAxis, o as CartesianGrid, r as XAxis, s as ReferenceArea, t as ComposedChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Agw5vJYx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatPrice(n) {
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	const digits = abs >= 1e3 ? 2 : abs >= 1 ? 4 : 6;
	return n.toLocaleString("en-US", {
		minimumFractionDigits: abs >= 1e3 ? 2 : 0,
		maximumFractionDigits: digits
	});
}
function formatPct(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return `${n > 0 ? "+" : ""}${(n * 100).toFixed(2)}%`;
}
function formatRsi(n) {
	if (n == null || !Number.isFinite(n)) return "—";
	return n.toFixed(1);
}
function compactPrice(n) {
	if (!Number.isFinite(n)) return "";
	const abs = Math.abs(n);
	if (abs >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
	if (abs >= 1) return n.toFixed(1);
	return n.toPrecision(2);
}
function formatTime(ts, interval) {
	const d = new Date(ts);
	const pad = (v) => String(v).padStart(2, "0");
	if (interval === "1d") return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
	return `${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
function formatFullTime(ts) {
	const d = new Date(ts);
	const pad = (v) => String(v).padStart(2, "0");
	return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "bg-card-2 text-muted-foreground",
		bull: "bg-bull-dim text-bull",
		bear: "bg-bear-dim text-bear",
		accent: "bg-accent text-accent-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium outline-none transition-[color,background-color,opacity,transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-foreground hover:opacity-90",
			secondary: "bg-card text-foreground shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted-foreground hover:bg-card hover:text-foreground",
			outline: "bg-transparent text-foreground shadow-[var(--shadow-border)] hover:bg-card"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-xl bg-card text-foreground shadow-[var(--shadow-border)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-start justify-between gap-3 p-4 pb-0", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-sm font-medium tracking-tight text-foreground", className),
		...props
	});
}
function CardDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-xs text-muted-foreground", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("p-4", className),
		...props
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2 touch-none p-px select-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-card-2", className),
		...props
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex h-10 w-full touch-none items-center select-none", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1 w-full grow overflow-hidden rounded-full bg-card-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-accent" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-accent shadow-[var(--shadow-border)] outline-none ring-ring/40 transition-[box-shadow] duration-[var(--motion-quick)] focus-visible:ring-4" })]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchKlines = createServerFn({ method: "GET" }).validator((data) => {
	const d = data ?? {};
	return {
		symbol: isSymbol(d.symbol ?? "") ? d.symbol : DEFAULT_SYMBOL,
		interval: isInterval(d.interval ?? "") ? d.interval : "1h",
		limit: Math.min(Math.max(Number(d.limit) || 400, 80), 500)
	};
}).handler(createSsrRpc("1a161fec8b152c453a6ea88bfdff59b730de565863b1c7f6828224e93771bc17"));
/** Wilder RSI — matches TA-Lib / freqtrade `ta.RSI`. First value at index `period`. */
function wilderRsi(closes, period = 14) {
	const n = closes.length;
	const out = Array(n).fill(null);
	if (n <= period) return out;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const delta = closes[i] - closes[i - 1];
		if (delta >= 0) gain += delta;
		else loss -= delta;
	}
	let avgGain = gain / period;
	let avgLoss = loss / period;
	out[period] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
	for (let i = period + 1; i < n; i++) {
		const delta = closes[i] - closes[i - 1];
		const g = delta > 0 ? delta : 0;
		const l = delta < 0 ? -delta : 0;
		avgGain = (avgGain * (period - 1) + g) / period;
		avgLoss = (avgLoss * (period - 1) + l) / period;
		out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
	}
	return out;
}
/**
* pandas: series.rolling(lb).max().shift(1)
* At index i (i >= lb): max of values[i-lb .. i-1] — previous `lb` bars, excluding current.
*/
function rollingPrevMax(values, lb) {
	const n = values.length;
	const out = Array(n).fill(null);
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
function rollingPrevMin(values, lb) {
	const n = values.length;
	const out = Array(n).fill(null);
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
function fwdReturn(closes, i, horizon) {
	const future = closes[i + horizon];
	const now = closes[i];
	if (future == null || now == null || now === 0) return null;
	return (future - now) / now;
}
function mean(xs) {
	if (xs.length === 0) return null;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function runDivergence(candles, lookback, rsiPeriod) {
	const closes = candles.map((c) => c.c);
	const rsi = wilderRsi(closes, rsiPeriod);
	const closeMax = rollingPrevMax(closes, lookback);
	const closeMin = rollingPrevMin(closes, lookback);
	const rsiMax = rollingPrevMax(rsi, lookback);
	const rsiMin = rollingPrevMin(rsi, lookback);
	const bars = candles.map((candle, i) => {
		const r = rsi[i];
		const cMax = closeMax[i];
		const cMin = closeMin[i];
		const rMax = rsiMax[i];
		const rMin = rsiMin[i];
		const bearish = r != null && cMax != null && rMax != null && candle.c >= cMax && r < rMax;
		const bullish = r != null && cMin != null && rMin != null && candle.c <= cMin && r > rMin;
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
			ret20: fwdReturn(closes, i, 20)
		};
	});
	for (let i = 0; i < bars.length; i++) {
		const bar = bars[i];
		const prev = i > 0 ? bars[i - 1] : null;
		bar.signalStart = bar.bullishDivergence && !prev?.bullishDivergence || bar.bearishDivergence && !prev?.bearishDivergence;
	}
	const signals = [];
	for (let i = 0; i < bars.length; i++) {
		const bar = bars[i];
		if (!bar.signalStart) continue;
		if (bar.bullishDivergence && bar.rsi != null && bar.closeMin != null && bar.rsiMin != null) signals.push({
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
			ret20: bar.ret20
		});
		if (bar.bearishDivergence && bar.rsi != null && bar.closeMax != null && bar.rsiMax != null) signals.push({
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
			ret20: bar.ret20
		});
	}
	const scored = signals.filter((s) => s.ret5 != null);
	const hits = scored.filter((s) => s.type === "bullish" ? s.ret5 > 0 : s.ret5 < 0);
	const bullRets = signals.filter((s) => s.type === "bullish" && s.ret5 != null).map((s) => s.ret5);
	const bearRets = signals.filter((s) => s.type === "bearish" && s.ret5 != null).map((s) => s.ret5);
	return {
		bars,
		signals,
		stats: {
			bullish: signals.filter((s) => s.type === "bullish").length,
			bearish: signals.filter((s) => s.type === "bearish").length,
			total: signals.length,
			hit5: scored.length ? hits.length / scored.length : null,
			avgRet5Bull: mean(bullRets),
			avgRet5Bear: mean(bearRets),
			last: signals.length ? signals[signals.length - 1] : null
		}
	};
}
function DiamondDot({ cx, cy, value, fill }) {
	if (cx == null || cy == null || value == null) return null;
	const s = 5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
		points: `${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`,
		fill
	});
}
function PriceTooltip({ active, payload, interval }) {
	if (!active || !payload?.[0]) return null;
	const bar = payload[0].payload;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-card px-3 py-2 text-xs shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-1 font-mono text-muted-foreground",
				children: formatTime(bar.t, interval)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 font-mono tabular",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["C ", formatPrice(bar.c)] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["H ", formatPrice(bar.h)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: ["L ", formatPrice(bar.l)]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 font-mono tabular text-rsi",
				children: ["RSI ", formatRsi(bar.rsi)]
			}),
			bar.bullishDivergence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-bull",
				children: "Bullish divergence"
			}) : null,
			bar.bearishDivergence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-bear",
				children: "Bearish divergence"
			}) : null
		]
	});
}
function DeskCharts({ bars, interval, lookback, selected, range, onSelectIndex, onHoverIndex }) {
	const rows = (0, import_react.useMemo)(() => {
		const start = range === "recent" ? Math.max(0, bars.length - 140) : 0;
		return bars.slice(start).map((bar, offset) => ({
			...bar,
			i: start + offset,
			bullMark: bar.bullishDivergence ? bar.c : null,
			bearMark: bar.bearishDivergence ? bar.c : null,
			rsiBull: bar.bullishDivergence ? bar.rsi : null,
			rsiBear: bar.bearishDivergence ? bar.rsi : null
		}));
	}, [bars, range]);
	const priceTicks = (0, import_react.useMemo)(() => {
		if (rows.length === 0) return [0];
		const lows = rows.map((r) => r.l);
		const highs = rows.map((r) => r.h);
		const min = Math.min(...lows);
		const max = Math.max(...highs);
		if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
		return [
			min,
			min + (max - min) / 2,
			max
		];
	}, [rows]);
	const selectedInView = selected ? rows.find((r) => r.i === selected.index) ?? null : null;
	const windowStart = selected ? selected.index - lookback : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chart-price",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: rows,
						margin: {
							top: 8,
							right: 12,
							left: 0,
							bottom: 0
						},
						onMouseMove: (state) => {
							const i = state?.activeTooltipIndex;
							if (typeof i === "number" && rows[i]) onHoverIndex(rows[i].i);
						},
						onMouseLeave: () => onHoverIndex(null),
						onClick: (state) => {
							const i = state?.activeTooltipIndex;
							if (typeof i === "number" && rows[i]) onSelectIndex(rows[i].i);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "priceFill",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "0%",
									stopColor: "var(--color-foreground)",
									stopOpacity: .14
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "100%",
									stopColor: "var(--color-foreground)",
									stopOpacity: 0
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false,
								strokeDasharray: "3 6"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tickFormatter: (v) => formatTime(v, interval),
								tick: {
									fill: "var(--color-subtle)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 48
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "price",
								domain: ["dataMin", "dataMax"],
								orientation: "right",
								width: 46,
								ticks: priceTicks,
								interval: 0,
								tick: {
									fill: "var(--color-subtle)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (v) => compactPrice(v)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTooltip, { interval }),
								cursor: { stroke: "var(--color-border)" }
							}),
							selectedInView && windowStart != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
								yAxisId: "price",
								x1: rows[0] && windowStart <= rows[0].i ? rows[0].t : bars[Math.max(windowStart, 0)]?.t,
								x2: selectedInView.t,
								fill: "var(--color-foreground)",
								fillOpacity: .04,
								ifOverflow: "hidden"
							}) : null,
							selectedInView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								yAxisId: "price",
								x: selectedInView.t,
								stroke: "var(--color-accent)",
								strokeDasharray: "3 4"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								yAxisId: "price",
								type: "monotone",
								dataKey: "c",
								stroke: "none",
								fill: "url(#priceFill)",
								isAnimationActive: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "price",
								type: "monotone",
								dataKey: "c",
								stroke: "var(--color-foreground)",
								strokeWidth: 1.5,
								dot: false,
								isAnimationActive: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "price",
								type: "linear",
								dataKey: "bullMark",
								stroke: "none",
								legendType: "none",
								isAnimationActive: false,
								dot: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiamondDot, {
									cx: props.cx,
									cy: props.cy,
									value: props.value,
									fill: "var(--color-bull)"
								}),
								activeDot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "price",
								type: "linear",
								dataKey: "bearMark",
								stroke: "none",
								legendType: "none",
								isAnimationActive: false,
								dot: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiamondDot, {
									cx: props.cx,
									cy: props.cy,
									value: props.value,
									fill: "var(--color-bear)"
								}),
								activeDot: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "chart-rsi",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ComposedChart, {
						data: rows,
						margin: {
							top: 8,
							right: 12,
							left: 0,
							bottom: 0
						},
						onMouseMove: (state) => {
							const i = state?.activeTooltipIndex;
							if (typeof i === "number" && rows[i]) onHoverIndex(rows[i].i);
						},
						onMouseLeave: () => onHoverIndex(null),
						onClick: (state) => {
							const i = state?.activeTooltipIndex;
							if (typeof i === "number" && rows[i]) onSelectIndex(rows[i].i);
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--color-border)",
								vertical: false,
								strokeDasharray: "3 6"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "t",
								tickFormatter: (v) => formatTime(v, interval),
								tick: {
									fill: "var(--color-subtle)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								axisLine: false,
								tickLine: false,
								minTickGap: 48
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "rsi",
								domain: [0, 100],
								orientation: "right",
								width: 28,
								ticks: [30, 70],
								interval: 0,
								tick: {
									fill: "var(--color-subtle)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono"
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTooltip, { interval }),
								cursor: { stroke: "var(--color-border)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
								yAxisId: "rsi",
								y1: 30,
								y2: 70,
								fill: "var(--color-foreground)",
								fillOpacity: .03
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								yAxisId: "rsi",
								y: 70,
								stroke: "var(--color-bear)",
								strokeOpacity: .45,
								strokeDasharray: "4 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								yAxisId: "rsi",
								y: 30,
								stroke: "var(--color-bull)",
								strokeOpacity: .45,
								strokeDasharray: "4 4"
							}),
							selectedInView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
								yAxisId: "rsi",
								x: selectedInView.t,
								stroke: "var(--color-accent)",
								strokeDasharray: "3 4"
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "rsi",
								type: "monotone",
								dataKey: "rsi",
								stroke: "var(--color-rsi)",
								strokeWidth: 1.5,
								dot: false,
								isAnimationActive: false,
								connectNulls: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "rsi",
								type: "linear",
								dataKey: "rsiBull",
								stroke: "none",
								legendType: "none",
								isAnimationActive: false,
								dot: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiamondDot, {
									cx: props.cx,
									cy: props.cy,
									value: props.value,
									fill: "var(--color-bull)"
								}),
								activeDot: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "rsi",
								type: "linear",
								dataKey: "rsiBear",
								stroke: "none",
								legendType: "none",
								isAnimationActive: false,
								dot: (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiamondDot, {
									cx: props.cx,
									cy: props.cy,
									value: props.value,
									fill: "var(--color-bear)"
								}),
								activeDot: false
							})
						]
					})
				})
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-1 font-mono text-xs text-muted-foreground",
				children: [
					"Cửa sổ lookback ",
					lookback,
					" · ",
					formatFullTime(selected.t),
					" · giá ",
					formatPrice(selected.close),
					" · RSI",
					" ",
					formatRsi(selected.rsi),
					" · +5 ",
					formatPct(selected.ret5)
				]
			}) : null
		]
	});
}
var STORAGE_KEY = "phan-ky-desk-v1";
function loadPersisted() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) throw new Error("empty");
		const p = JSON.parse(raw);
		return {
			symbol: isSymbol(p.symbol ?? "") ? p.symbol : DEFAULT_SYMBOL,
			interval: isInterval(p.interval ?? "") ? p.interval : "1h",
			lookback: clamp(Number(p.lookback) || 20, 5, 60),
			rsiPeriod: clamp(Number(p.rsiPeriod) || 14, 5, 28)
		};
	} catch {
		return {
			symbol: DEFAULT_SYMBOL,
			interval: "1h",
			lookback: 20,
			rsiPeriod: 14
		};
	}
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function avgLabel(n) {
	return formatPct(n);
}
function DeskApp() {
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [symbol, setSymbol] = (0, import_react.useState)(DEFAULT_SYMBOL);
	const [interval, setInterval] = (0, import_react.useState)("1h");
	const [lookback, setLookback] = (0, import_react.useState)(20);
	const [rsiPeriod, setRsiPeriod] = (0, import_react.useState)(14);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [range, setRange] = (0, import_react.useState)("recent");
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [hoverIndex, setHoverIndex] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const p = loadPersisted();
		setSymbol(p.symbol);
		setInterval(p.interval);
		setLookback(p.lookback);
		setRsiPeriod(p.rsiPeriod);
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify({
			symbol,
			interval,
			lookback,
			rsiPeriod
		}));
	}, [
		hydrated,
		symbol,
		interval,
		lookback,
		rsiPeriod
	]);
	const market = useQuery({
		queryKey: [
			"klines",
			symbol,
			interval
		],
		queryFn: () => fetchKlines({ data: {
			symbol,
			interval
		} }),
		enabled: hydrated,
		refetchInterval: 6e4
	});
	const candles = (0, import_react.useMemo)(() => {
		if (market.data?.candles?.length) return market.data.candles;
		if (market.isError) return generateSynthetic(symbol, interval);
		return [];
	}, [
		market.data,
		market.isError,
		symbol,
		interval
	]);
	const { bars, signals, stats } = (0, import_react.useMemo)(() => runDivergence(candles, lookback, rsiPeriod), [
		candles,
		lookback,
		rsiPeriod
	]);
	const visibleSignals = (0, import_react.useMemo)(() => (filter === "all" ? signals : signals.filter((s) => s.type === filter)).slice().reverse(), [signals, filter]);
	const selected = (selectedId ? signals.find((s) => s.id === selectedId) : null) ?? stats.last ?? null;
	const readoutBar = (hoverIndex != null ? bars[hoverIndex] : null) ?? (selected ? bars[selected.index] : bars[bars.length - 1]);
	const lastBar = bars[bars.length - 1];
	const source = market.data?.source ?? (market.isError ? "synthetic" : null);
	function selectBar(index) {
		if (!bars[index]) return;
		const match = signals.find((s) => s.index === index) ?? signals.reduce((best, s) => {
			if (!best || Math.abs(s.index - index) < Math.abs(best.index - index)) return s;
			return best;
		}, null);
		if (match) setSelectedId(match.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-base font-medium tracking-tight",
								children: "Phân Kỳ Desk"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Giá × RSI · lookback ",
									lookback,
									" · cùng logic Freqtrade"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: source === "binance" ? "accent" : "default",
								children: source === "binance" ? "Binance" : "Mô phỏng"
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								onClick: () => market.refetch(),
								disabled: market.isFetching,
								"aria-label": "Tải lại dữ liệu",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-3.5", market.isFetching && "animate-spin") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Làm mới"
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-full max-w-full gap-1 overflow-x-auto pb-1",
						children: SYMBOLS.map((s) => {
							const active = s.id === symbol;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setSymbol(s.id);
									setSelectedId(null);
								},
								className: cn("h-10 shrink-0 rounded-sm px-3 font-mono text-xs transition-[background-color,color] duration-[var(--motion-quick)]", active ? "bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground"),
								children: s.base
							}, s.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: INTERVALS.map((tf) => {
								const active = tf.id === interval;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setInterval(tf.id);
										setSelectedId(null);
									},
									className: cn("h-10 min-w-11 rounded-sm px-3 text-xs font-medium transition-[background-color,color] duration-[var(--motion-quick)]", active ? "bg-card-2 text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground hover:text-foreground"),
									children: tf.label
								}, tf.id);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-0 flex-1 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-20 shrink-0 text-xs text-muted-foreground",
									children: ["Lookback ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular text-foreground",
										children: lookback
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 5,
									max: 60,
									step: 1,
									value: [lookback],
									onValueChange: (v) => setLookback(v[0] ?? 20)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-w-0 flex-1 items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-20 shrink-0 text-xs text-muted-foreground",
									children: ["RSI ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono tabular text-foreground",
										children: rsiPeriod
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 5,
									max: 28,
									step: 1,
									value: [rsiPeriod],
									onValueChange: (v) => setRsiPeriod(v[0] ?? 14)
								})]
							})]
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-12 lg:grid-cols-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Giá",
							value: lastBar ? formatPrice(lastBar.c) : "—",
							hint: pairLabel(symbol)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "RSI",
							value: formatRsi(lastBar?.rsi),
							hint: lastBar?.rsi != null && lastBar.rsi >= 70 ? "Quá mua" : lastBar?.rsi != null && lastBar.rsi <= 30 ? "Quá bán" : "Trung tính",
							tone: lastBar?.rsi != null && lastBar.rsi >= 70 ? "bear" : lastBar?.rsi != null && lastBar.rsi <= 30 ? "bull" : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Bullish",
							value: String(stats.bullish),
							hint: `TB +5 ${avgLabel(stats.avgRet5Bull)}`,
							tone: "bull",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Bearish",
							value: String(stats.bearish),
							hint: `TB +5 ${avgLabel(stats.avgRet5Bear)}`,
							tone: "bear",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "size-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Hit rate +5",
							value: stats.hit5 == null ? "—" : `${Math.round(stats.hit5 * 100)}%`,
							hint: "Đúng hướng sau 5 nến"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
							label: "Tín hiệu cuối",
							value: stats.last ? stats.last.type === "bullish" ? "Bull" : "Bear" : "—",
							hint: stats.last ? formatTime(stats.last.t, interval) : "Chưa có",
							tone: stats.last?.type === "bullish" ? "bull" : stats.last?.type === "bearish" ? "bear" : void 0
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-w-0 lg:col-span-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "px-4 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-muted-foreground" }),
								pairLabel(symbol),
								" · ",
								INTERVALS.find((t) => t.id === interval)?.label
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "mt-1",
							children: readoutBar ? `${formatFullTime(readoutBar.t)}  ·  C ${formatPrice(readoutBar.c)}  ·  RSI ${formatRsi(readoutBar.rsi)}` : "Đang tải nến…"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBtn, {
								active: range === "recent",
								onClick: () => setRange("recent"),
								children: "140 nến"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangeBtn, {
								active: range === "all",
								onClick: () => setRange("all"),
								children: "Toàn bộ"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "overflow-hidden pt-3",
						children: market.isLoading && !candles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "chart-price rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "chart-rsi rounded-lg" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskCharts, {
							bars,
							interval,
							lookback,
							selected,
							range,
							onSelectIndex: selectBar,
							onHoverIndex: setHoverIndex
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-4 lg:col-span-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex min-h-80 flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "px-4 pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tín hiệu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Chỉ lấy nến mở đầu mỗi chuỗi phân kỳ" })] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex min-h-0 flex-1 flex-col gap-3 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex gap-1",
								children: [
									"all",
									"bullish",
									"bearish"
								].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setFilter(f),
									className: cn("h-9 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]", filter === f ? f === "bullish" ? "bg-bull-dim text-bull" : f === "bearish" ? "bg-bear-dim text-bear" : "bg-card-2 text-foreground" : "text-muted-foreground hover:text-foreground"),
									children: f === "all" ? "Tất cả" : f === "bullish" ? "Tăng" : "Giảm"
								}, f))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
								className: "h-72",
								children: visibleSignals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-1 py-8 text-center text-sm text-muted-foreground",
									children: "Không có tín hiệu trên cửa sổ này. Tăng số nến hoặc đổi lookback."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "flex flex-col gap-1 pr-2",
									children: visibleSignals.map((s) => {
										const active = selected?.id === s.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setSelectedId(s.id),
											className: cn("flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors duration-[var(--motion-quick)]", active ? "bg-card-2" : "hover:bg-card-2/60"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex min-w-0 flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: s.type === "bullish" ? "bull" : "bear",
														children: s.type === "bullish" ? "Bull" : "Bear"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-mono text-xs text-muted-foreground",
														children: formatTime(s.t, interval)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mt-1 font-mono text-xs tabular text-subtle",
													children: [
														"RSI ",
														formatRsi(s.rsi),
														" · ",
														formatPrice(s.close)
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("font-mono text-xs tabular", s.ret5 == null ? "text-muted-foreground" : s.ret5 >= 0 ? "text-bull" : "text-bear"),
												children: formatPct(s.ret5)
											})]
										}) }, s.id);
									})
								})
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormulaPanel, {
						bar: selected ? bars[selected.index] : null,
						lookback
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-w-0 overflow-hidden lg:col-span-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "px-4 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Sổ lệnh mô phỏng" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Lợi nhuận nến đóng cửa sau 5 / 10 / 20 bar — không phải live trading" })] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "overflow-x-auto pt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-max min-w-full text-left text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Thời gian"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Loại"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Giá"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "RSI"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Cực trị giá"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "Cực trị RSI"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "+5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "+10"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 font-medium",
											children: "+20"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visibleSignals.slice(0, 40).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								onClick: () => setSelectedId(s.id),
								className: cn("cursor-pointer border-b border-border/60 transition-colors duration-[var(--motion-quick)] hover:bg-card-2/80", selected?.id === s.id && "bg-card-2"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs tabular",
										children: formatFullTime(s.t)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: s.type === "bullish" ? "bull" : "bear",
											children: s.type === "bullish" ? "Bullish" : "Bearish"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs tabular",
										children: formatPrice(s.close)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs tabular",
										children: formatRsi(s.rsi)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs tabular",
										children: formatPrice(s.closeExtreme)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-3 py-2 font-mono text-xs tabular",
										children: formatRsi(s.rsiExtreme)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RetCell, { v: s.ret5 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RetCell, { v: s.ret10 }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RetCell, { v: s.ret20 })
								]
							}, s.id)) })]
						}), visibleSignals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-8 text-center text-sm text-muted-foreground",
							children: "Chưa có hàng để hiển thị."
						}) : null]
					})]
				})
			]
		})]
	});
}
function Kpi({ label, value, hint, tone, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-item rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "",
					children: icon
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-1 font-mono text-lg tabular tracking-tight", tone === "bull" && "text-bull", tone === "bear" && "text-bear"),
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-0.5 text-xs text-subtle",
				children: hint
			})
		]
	});
}
function RangeBtn({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]", active ? "bg-card-2 text-foreground" : "text-muted-foreground hover:text-foreground"),
		children
	});
}
function RetCell({ v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("px-3 py-2 font-mono text-xs tabular", v == null ? "text-muted-foreground" : v >= 0 ? "text-bull" : "text-bear"),
		children: formatPct(v)
	});
}
function FormulaPanel({ bar, lookback }) {
	const closeOk = bar?.closeMax != null && bar.c >= bar.closeMax;
	const rsiWeak = bar?.rsi != null && bar.rsiMax != null && bar.rsi < bar.rsiMax;
	const closeLow = bar?.closeMin != null && bar.c <= bar.closeMin;
	const rsiStrong = bar?.rsi != null && bar.rsiMin != null && bar.rsi > bar.rsiMin;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
		className: "px-4 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Logic chiến lược" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, { children: ["DIVERGENCE_LOOKBACK = ", lookback] })] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "space-y-3 pt-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground",
				children: `close_max = close.rolling(${lookback}).max().shift(1)
rsi_max   = rsi.rolling(${lookback}).max().shift(1)
bearish   = (close >= close_max) & (rsi < rsi_max)
bullish   = (close <= close_min) & (rsi > rsi_min)`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs leading-relaxed text-muted-foreground",
				children: [
					"Nến hiện tại được so với cực trị của ",
					lookback,
					" nến trước (không gồm chính nó). Bearish: giá tạo đỉnh mới nhưng RSI không. Bullish: giá tạo đáy mới nhưng RSI không."
				]
			}),
			bar ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg bg-background p-3 font-mono text-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						ok: closeOk,
						label: "close ≥ close_max",
						left: formatPrice(bar.c),
						right: formatPrice(bar.closeMax ?? NaN)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						ok: rsiWeak,
						label: "rsi < rsi_max",
						left: formatRsi(bar.rsi),
						right: formatRsi(bar.rsiMax)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						ok: closeLow,
						label: "close ≤ close_min",
						left: formatPrice(bar.c),
						right: formatPrice(bar.closeMin ?? NaN)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						ok: rsiStrong,
						label: "rsi > rsi_min",
						left: formatRsi(bar.rsi),
						right: formatRsi(bar.rsiMin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex gap-2",
						children: [
							bar.bearishDivergence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "bear",
								children: "bearish_divergence"
							}) : null,
							bar.bullishDivergence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "bull",
								children: "bullish_divergence"
							}) : null,
							!bar.bearishDivergence && !bar.bullishDivergence ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Không kích hoạt trên nến này"
							}) : null
						]
					})
				]
			}) : null
		]
	})] });
}
function Row({ ok, label, left, right }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 py-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: ok ? "text-bull" : "text-muted-foreground",
			children: [
				left,
				" · ",
				right
			]
		})]
	});
}
function LogoMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": true,
		className: "relative grid size-10 place-items-center rounded-md bg-card shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: "size-6",
			fill: "none",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 22l5-7 4 3 6-10 4 5 5-8",
				stroke: "currentColor",
				strokeWidth: "1.5",
				className: "text-foreground"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M4 24c3-1 5 3 8 1s4-5 7-2 5 4 9-1",
				stroke: "currentColor",
				strokeWidth: "1.5",
				className: "text-bull"
			})]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskApp, {});
}
//#endregion
export { Home as component };
