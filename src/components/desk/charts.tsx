import { useMemo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Bar, FamilyFilter, Signal } from "@/lib/strategy";
import { compactPrice, formatFullTime, formatPct, formatPrice, formatRsi, formatTime } from "@/lib/utils";

type ChartRow = Bar & {
  i: number;
  bullMark: number | null;
  bearMark: number | null;
  hidBullMark: number | null;
  hidBearMark: number | null;
  rsiBull: number | null;
  rsiBear: number | null;
  rsiHidBull: number | null;
  rsiHidBear: number | null;
};

function markDot(fill: string, prefix: string) {
  return (props: { cx?: number; cy?: number; value?: unknown; index?: number }) => {
    const { cx, cy, value, index } = props;
    const k = `${prefix}-${index ?? cx ?? 0}`;
    if (cx == null || cy == null || value == null) return <g key={k} />;
    const s = 5;
    return (
      <polygon
        key={k}
        points={`${cx},${cy - s} ${cx + s},${cy} ${cx},${cy + s} ${cx - s},${cy}`}
        fill={fill}
      />
    );
  };
}

function ringDot(stroke: string, prefix: string) {
  return (props: { cx?: number; cy?: number; value?: unknown; index?: number }) => {
    const { cx, cy, value, index } = props;
    const k = `${prefix}-${index ?? cx ?? 0}`;
    if (cx == null || cy == null || value == null) return <g key={k} />;
    return (
      <circle key={k} cx={cx} cy={cy} r={4.5} fill="var(--color-background)" stroke={stroke} strokeWidth={1.5} />
    );
  };
}

const bullPriceDot = markDot("var(--color-bull)", "bull-px");
const bearPriceDot = markDot("var(--color-bear)", "bear-px");
const bullRsiDot = markDot("var(--color-bull)", "bull-rsi");
const bearRsiDot = markDot("var(--color-bear)", "bear-rsi");
const hidBullPrice = ringDot("var(--color-bull)", "hb-px");
const hidBearPrice = ringDot("var(--color-bear)", "hbr-px");
const hidBullRsi = ringDot("var(--color-bull)", "hb-rsi");
const hidBearRsi = ringDot("var(--color-bear)", "hbr-rsi");

function PriceTooltip({
  active,
  payload,
  interval,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
  interval: string;
}) {
  if (!active || !payload?.[0]) return null;
  const bar = payload[0].payload;
  return (
    <div className="rounded-md bg-card px-3 py-2 text-xs shadow-[var(--shadow-border)]">
      <div className="mb-1 font-mono text-muted-foreground">{formatTime(bar.t, interval)}</div>
      <div className="flex gap-3 font-mono tabular">
        <span>C {formatPrice(bar.c)}</span>
        <span className="text-muted-foreground">H {formatPrice(bar.h)}</span>
        <span className="text-muted-foreground">L {formatPrice(bar.l)}</span>
      </div>
      <div className="mt-1 font-mono tabular text-rsi">RSI {formatRsi(bar.rsi)}</div>
      {bar.bullishDivergence ? <div className="mt-1 text-bull">Phân kỳ tăng thường</div> : null}
      {bar.bearishDivergence ? <div className="mt-1 text-bear">Phân kỳ giảm thường</div> : null}
      {bar.hiddenBullStart ? <div className="mt-1 text-bull">Phân kỳ tăng ẩn</div> : null}
      {bar.hiddenBearStart ? <div className="mt-1 text-bear">Phân kỳ giảm ẩn</div> : null}
    </div>
  );
}

export function DeskCharts({
  bars,
  interval,
  lookback,
  selected,
  range,
  family,
  onSelectIndex,
  onHoverIndex,
}: {
  bars: Bar[];
  interval: string;
  lookback: number;
  selected: Signal | null;
  range: "recent" | "all";
  family: FamilyFilter;
  onSelectIndex: (index: number) => void;
  onHoverIndex: (index: number | null) => void;
}) {
  const showRegular = family !== "hidden";
  const showHidden = family !== "regular";
  const rows: ChartRow[] = useMemo(() => {
    const start = range === "recent" ? Math.max(0, bars.length - 140) : 0;
    return bars.slice(start).map((bar, offset) => ({
      ...bar,
      i: start + offset,
      bullMark: showRegular && bar.bullishDivergence ? bar.c : null,
      bearMark: showRegular && bar.bearishDivergence ? bar.c : null,
      hidBullMark: showHidden && bar.hiddenBullStart ? bar.c : null,
      hidBearMark: showHidden && bar.hiddenBearStart ? bar.c : null,
      rsiBull: showRegular && bar.bullishDivergence ? bar.rsi : null,
      rsiBear: showRegular && bar.bearishDivergence ? bar.rsi : null,
      rsiHidBull: showHidden && bar.hiddenBullStart ? bar.rsi : null,
      rsiHidBear: showHidden && bar.hiddenBearStart ? bar.rsi : null,
    }));
  }, [bars, range, showRegular, showHidden]);

  const priceTicks = useMemo(() => {
    if (rows.length === 0) return [0];
    const lows = rows.map((r) => r.l);
    const highs = rows.map((r) => r.h);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) return [min];
    return [min, min + (max - min) / 2, max];
  }, [rows]);

  const selectedInView = selected
    ? (rows.find((r) => r.i === selected.index) ?? null)
    : null;

  const windowStart = selected ? selected.index - lookback : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="chart-price">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rows}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              const i = state?.activeTooltipIndex;
              if (typeof i === "number" && rows[i]) onHoverIndex(rows[i].i);
            }}
            onMouseLeave={() => onHoverIndex(null)}
            onClick={(state) => {
              const i = state?.activeTooltipIndex;
              if (typeof i === "number" && rows[i]) onSelectIndex(rows[i].i);
            }}
          >
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-foreground)" stopOpacity={0.14} />
                <stop offset="100%" stopColor="var(--color-foreground)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 6" />
            <XAxis
              dataKey="t"
              tickFormatter={(v: number) => formatTime(v, interval)}
              tick={{ fill: "var(--color-subtle)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis
              yAxisId="price"
              domain={["dataMin", "dataMax"]}
              orientation="right"
              width={46}
              ticks={priceTicks}
              interval={0}
              tick={{ fill: "var(--color-subtle)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => compactPrice(v)}
            />
            <Tooltip
              content={<PriceTooltip interval={interval} />}
              cursor={{ stroke: "var(--color-border)" }}
            />
            {selectedInView && windowStart != null ? (
              <ReferenceArea
                yAxisId="price"
                x1={
                  rows[0] && windowStart <= rows[0].i
                    ? rows[0].t
                    : bars[Math.max(windowStart, 0)]?.t
                }
                x2={selectedInView.t}
                fill="var(--color-foreground)"
                fillOpacity={0.04}
                ifOverflow="hidden"
              />
            ) : null}
            {selectedInView ? (
              <ReferenceLine
                yAxisId="price"
                x={selectedInView.t}
                stroke="var(--color-accent)"
                strokeDasharray="3 4"
              />
            ) : null}
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="c"
              stroke="none"
              fill="url(#priceFill)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="c"
              stroke="var(--color-foreground)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Line
              yAxisId="price"
              type="linear"
              dataKey="bullMark"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={bullPriceDot}
              activeDot={false}
            />
            <Line
              yAxisId="price"
              type="linear"
              dataKey="bearMark"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={bearPriceDot}
              activeDot={false}
            />
            <Line
              yAxisId="price"
              type="linear"
              dataKey="hidBullMark"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={hidBullPrice}
              activeDot={false}
            />
            <Line
              yAxisId="price"
              type="linear"
              dataKey="hidBearMark"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={hidBearPrice}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-rsi">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rows}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              const i = state?.activeTooltipIndex;
              if (typeof i === "number" && rows[i]) onHoverIndex(rows[i].i);
            }}
            onMouseLeave={() => onHoverIndex(null)}
            onClick={(state) => {
              const i = state?.activeTooltipIndex;
              if (typeof i === "number" && rows[i]) onSelectIndex(rows[i].i);
            }}
          >
            <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="3 6" />
            <XAxis
              dataKey="t"
              tickFormatter={(v: number) => formatTime(v, interval)}
              tick={{ fill: "var(--color-subtle)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
              minTickGap={48}
            />
            <YAxis
              yAxisId="rsi"
              domain={[0, 100]}
              orientation="right"
              width={28}
              ticks={[30, 70]}
              interval={0}
              tick={{ fill: "var(--color-subtle)", fontSize: 11, fontFamily: "IBM Plex Mono" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<PriceTooltip interval={interval} />}
              cursor={{ stroke: "var(--color-border)" }}
            />
            <ReferenceArea yAxisId="rsi" y1={30} y2={70} fill="var(--color-foreground)" fillOpacity={0.03} />
            <ReferenceLine yAxisId="rsi" y={70} stroke="var(--color-bear)" strokeOpacity={0.45} strokeDasharray="4 4" />
            <ReferenceLine yAxisId="rsi" y={30} stroke="var(--color-bull)" strokeOpacity={0.45} strokeDasharray="4 4" />
            {selectedInView ? (
              <ReferenceLine
                yAxisId="rsi"
                x={selectedInView.t}
                stroke="var(--color-accent)"
                strokeDasharray="3 4"
              />
            ) : null}
            <Line
              yAxisId="rsi"
              type="monotone"
              dataKey="rsi"
              stroke="var(--color-rsi)"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              connectNulls
            />
            <Line
              yAxisId="rsi"
              type="linear"
              dataKey="rsiBull"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={bullRsiDot}
              activeDot={false}
            />
            <Line
              yAxisId="rsi"
              type="linear"
              dataKey="rsiBear"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={bearRsiDot}
              activeDot={false}
            />
            <Line
              yAxisId="rsi"
              type="linear"
              dataKey="rsiHidBull"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={hidBullRsi}
              activeDot={false}
            />
            <Line
              yAxisId="rsi"
              type="linear"
              dataKey="rsiHidBear"
              stroke="none"
              legendType="none"
              isAnimationActive={false}
              dot={hidBearRsi}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {selected ? (
        <p className="px-1 font-mono text-xs text-muted-foreground">
          Kim cương = thường · vòng = ẩn · lookback {lookback} · {formatFullTime(selected.t)} ·{" "}
          {selected.kind === "hidden" ? "ẩn" : "thường"} · sức {selected.strength} · +5{" "}
          {formatPct(selected.ret5)}
        </p>
      ) : (
        <p className="px-1 font-mono text-xs text-muted-foreground">
          Kim cương = phân kỳ thường · vòng = nến mở đầu phân kỳ ẩn
        </p>
      )}
    </div>
  );
}
