import { useQueries } from "@tanstack/react-query";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  DEFAULT_INTERVAL,
  DEFAULT_LOOKBACK,
  DEFAULT_RSI_PERIOD,
  DEFAULT_SYMBOL,
  INTERVALS,
  SYMBOLS,
  isInterval,
  isSymbol,
  pairLabel,
  type IntervalId,
  type SymbolId,
} from "@/lib/market/constants";
import { fetchKlines } from "@/lib/market/fetch-klines";
import {
  generateSynthetic,
  runDivergence,
  simulateHold,
  summarizeSignals,
  type Bar,
  type FamilyFilter,
  type Signal,
} from "@/lib/strategy";
import { cn, formatFullTime, formatPct, formatPrice, formatRsi, formatTime } from "@/lib/utils";
import { DeskCharts } from "./charts";
import { EquityChart } from "./equity-chart";
import { PairRadar, type RadarCardModel } from "./radar";

const STORAGE_KEY = "phan-ky-desk-v2";
const STORAGE_KEY_V1 = "phan-ky-desk-v1";

type Filter = "all" | "bullish" | "bearish";
type Range = "recent" | "all";
type StrengthFloor = 0 | 50 | 70;

type Persisted = {
  symbol: SymbolId;
  interval: IntervalId;
  lookback: number;
  rsiPeriod: number;
  family: FamilyFilter;
  minStrength: StrengthFloor;
  hold: number;
};

function isFamily(v: string): v is FamilyFilter {
  return v === "regular" || v === "hidden" || v === "both";
}

function strengthFloor(n: number): StrengthFloor {
  if (n >= 70) return 70;
  if (n >= 50) return 50;
  return 0;
}

function loadPersisted(): Persisted {
  const fallback: Persisted = {
    symbol: DEFAULT_SYMBOL,
    interval: DEFAULT_INTERVAL,
    lookback: DEFAULT_LOOKBACK,
    rsiPeriod: DEFAULT_RSI_PERIOD,
    family: "both",
    minStrength: 0,
    hold: 5,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY_V1);
    if (!raw) return fallback;
    const p = JSON.parse(raw) as Partial<Persisted>;
    const symbolRaw = p.symbol ?? "";
    const intervalRaw = p.interval ?? "";
    const familyRaw = p.family ?? "";
    return {
      symbol: isSymbol(symbolRaw) ? symbolRaw : DEFAULT_SYMBOL,
      interval: isInterval(intervalRaw) ? intervalRaw : DEFAULT_INTERVAL,
      lookback: clamp(Number(p.lookback) || DEFAULT_LOOKBACK, 5, 60),
      rsiPeriod: clamp(Number(p.rsiPeriod) || DEFAULT_RSI_PERIOD, 5, 28),
      family: isFamily(familyRaw) ? familyRaw : "both",
      minStrength: strengthFloor(Number(p.minStrength) || 0),
      hold: clamp(Number(p.hold) || 5, 3, 20),
    };
  } catch {
    return fallback;
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function avgLabel(n: number | null) {
  return formatPct(n);
}

export function DeskApp() {
  const [hydrated, setHydrated] = useState(false);
  const [symbol, setSymbol] = useState<SymbolId>(DEFAULT_SYMBOL);
  const [interval, setInterval] = useState<IntervalId>(DEFAULT_INTERVAL);
  const [lookback, setLookback] = useState(DEFAULT_LOOKBACK);
  const [rsiPeriod, setRsiPeriod] = useState(DEFAULT_RSI_PERIOD);
  const [family, setFamily] = useState<FamilyFilter>("both");
  const [minStrength, setMinStrength] = useState<StrengthFloor>(0);
  const [hold, setHold] = useState(5);
  const [filter, setFilter] = useState<Filter>("all");
  const [range, setRange] = useState<Range>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    const p = loadPersisted();
    setSymbol(p.symbol);
    setInterval(p.interval);
    setLookback(p.lookback);
    setRsiPeriod(p.rsiPeriod);
    setFamily(p.family);
    setMinStrength(p.minStrength);
    setHold(p.hold);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        symbol,
        interval,
        lookback,
        rsiPeriod,
        family,
        minStrength,
        hold,
      } satisfies Persisted),
    );
  }, [hydrated, symbol, interval, lookback, rsiPeriod, family, minStrength, hold]);

  const scans = useQueries({
    queries: SYMBOLS.map((s) => ({
      queryKey: ["klines", s.id, interval],
      queryFn: () => fetchKlines({ data: { symbol: s.id, interval } }),
      enabled: hydrated,
      refetchInterval: 60_000,
      staleTime: 30_000,
    })),
  });

  const activeScan = scans[SYMBOLS.findIndex((s) => s.id === symbol)];
  const fetching = scans.some((q) => q.isFetching);

  const candles = useMemo(() => {
    if (activeScan?.data?.candles?.length) return activeScan.data.candles;
    if (activeScan?.isError) return generateSynthetic(symbol, interval);
    return [];
  }, [activeScan?.data, activeScan?.isError, symbol, interval]);

  const analyzed = useMemo(
    () => runDivergence(candles, lookback, rsiPeriod, family),
    [candles, lookback, rsiPeriod, family],
  );
  const { bars } = analyzed;

  const signals = useMemo(
    () => analyzed.signals.filter((s) => s.strength >= minStrength),
    [analyzed.signals, minStrength],
  );
  const stats = useMemo(() => summarizeSignals(signals), [signals]);

  const scoped = useMemo(
    () => (filter === "all" ? signals : signals.filter((s) => s.type === filter)),
    [signals, filter],
  );
  const visibleSignals = useMemo(() => scoped.slice().reverse(), [scoped]);

  const book = useMemo(() => simulateHold(scoped, candles, hold), [scoped, candles, hold]);

  const selected =
    (selectedId ? signals.find((s) => s.id === selectedId) : null) ?? stats.last ?? null;

  const hoverBar = hoverIndex != null ? bars[hoverIndex] : null;
  const readoutBar = hoverBar ?? (selected ? bars[selected.index] : bars[bars.length - 1]);
  const lastBar = bars[bars.length - 1];
  const source = activeScan?.data?.source ?? (activeScan?.isError ? "synthetic" : null);

  const radar = useMemo<RadarCardModel[]>(() => {
    return SYMBOLS.map((s, i) => {
      const q = scans[i];
      const series = q?.data?.candles?.length
        ? q.data.candles
        : q?.isError
          ? generateSynthetic(s.id, interval)
          : [];
      if (!series.length) {
        return {
          id: s.id,
          base: s.base,
          loading: !q || q.isLoading || q.isPending,
          synthetic: false,
          price: "—",
          change: null,
          rsi: null,
          signal: null,
          barsAgo: null,
        };
      }
      const run = runDivergence(series, lookback, rsiPeriod, family);
      const kept = run.signals.filter((sig) => sig.strength >= minStrength);
      const last = kept.length ? kept[kept.length - 1]! : null;
      const tail = run.bars[run.bars.length - 1];
      const prev = run.bars[run.bars.length - 2];
      const change = tail && prev && prev.c ? (tail.c - prev.c) / prev.c : null;
      return {
        id: s.id,
        base: s.base,
        loading: false,
        synthetic: (q?.data?.source ?? "synthetic") !== "binance",
        price: tail ? formatPrice(tail.c) : "—",
        change,
        rsi: tail?.rsi ?? null,
        signal: last,
        barsAgo: last ? run.bars.length - 1 - last.index : null,
      };
    });
  }, [scans, interval, lookback, rsiPeriod, family, minStrength]);

  function selectBar(index: number) {
    const bar = bars[index];
    if (!bar) return;
    const match =
      signals.find((s) => s.index === index) ??
      signals.reduce<Signal | null>((best, s) => {
        if (!best || Math.abs(s.index - index) < Math.abs(best.index - index)) return s;
        return best;
      }, null);
    if (match) setSelectedId(match.id);
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex min-w-0 max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <h1 className="text-base font-medium tracking-tight">Phân Kỳ Desk</h1>
                <p className="text-xs text-muted-foreground">
                  Radar 8 cặp · phân kỳ thường và ẩn · lookback {lookback}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {source ? (
                <Badge variant={source === "binance" ? "accent" : "default"}>
                  {source === "binance" ? "Binance" : "Mô phỏng"}
                </Badge>
              ) : null}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  scans.forEach((q) => void q.refetch());
                }}
                disabled={fetching}
                aria-label="Tải lại dữ liệu"
              >
                <RefreshCw className={cn("size-3.5", fetching && "animate-spin")} />
                <span className="hidden sm:inline">Làm mới</span>
              </Button>
            </div>
          </div>

          <div className="flex w-full min-w-0 gap-1 overflow-x-auto pb-1">
            {SYMBOLS.map((s) => {
              const active = s.id === symbol;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setSymbol(s.id);
                    setSelectedId(null);
                  }}
                  className={cn(
                    "h-10 shrink-0 rounded-sm px-3 font-mono text-xs transition-[background-color,color] duration-[var(--motion-quick)]",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s.base}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex gap-1">
              {INTERVALS.map((tf) => {
                const active = tf.id === interval;
                return (
                  <button
                    key={tf.id}
                    type="button"
                    onClick={() => {
                      setInterval(tf.id);
                      setSelectedId(null);
                    }}
                    className={cn(
                      "h-10 min-w-11 rounded-sm px-3 text-xs font-medium transition-[background-color,color] duration-[var(--motion-quick)]",
                      active
                        ? "bg-card-2 text-foreground shadow-[var(--shadow-border)]"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tf.label}
                  </button>
                );
              })}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
              <label className="flex min-w-0 flex-1 items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                  Lookback <span className="font-mono tabular text-foreground">{lookback}</span>
                </span>
                <Slider
                  min={5}
                  max={60}
                  step={1}
                  value={[lookback]}
                  onValueChange={(v) => setLookback(v[0] ?? DEFAULT_LOOKBACK)}
                />
              </label>
              <label className="flex min-w-0 flex-1 items-center gap-3">
                <span className="w-20 shrink-0 text-xs text-muted-foreground">
                  RSI <span className="font-mono tabular text-foreground">{rsiPeriod}</span>
                </span>
                <Slider
                  min={5}
                  max={28}
                  step={1}
                  value={[rsiPeriod]}
                  onValueChange={(v) => setRsiPeriod(v[0] ?? DEFAULT_RSI_PERIOD)}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex gap-1">
              {(
                [
                  ["regular", "Thường"],
                  ["hidden", "Ẩn"],
                  ["both", "Cả hai"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFamily(id)}
                  className={cn(
                    "h-10 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
                    family === id
                      ? "bg-card-2 text-foreground shadow-[var(--shadow-border)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {(
                [
                  [0, "Mọi sức"],
                  [50, "≥ 50"],
                  [70, "≥ 70"],
                ] as const
              ).map(([floor, label]) => (
                <button
                  key={floor}
                  type="button"
                  onClick={() => setMinStrength(floor)}
                  className={cn(
                    "h-10 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
                    minStrength === floor
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full min-w-0 max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-12">
        <PairRadar
          cards={radar}
          activeId={symbol}
          onPick={(id, signalId) => {
            setSymbol(id);
            setSelectedId(signalId);
          }}
        />

        <section className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-12 lg:grid-cols-6">
          <Kpi
            label="Giá"
            value={lastBar ? formatPrice(lastBar.c) : "—"}
            hint={pairLabel(symbol)}
          />
          <Kpi
            label="RSI"
            value={formatRsi(lastBar?.rsi)}
            hint={lastBar?.rsi != null && lastBar.rsi >= 70 ? "Quá mua" : lastBar?.rsi != null && lastBar.rsi <= 30 ? "Quá bán" : "Trung tính"}
            tone={
              lastBar?.rsi != null && lastBar.rsi >= 70
                ? "bear"
                : lastBar?.rsi != null && lastBar.rsi <= 30
                  ? "bull"
                  : undefined
            }
          />
          <Kpi
            label="Bullish"
            value={String(stats.bullish)}
            hint={`TB +5 ${avgLabel(stats.avgRet5Bull)}`}
            tone="bull"
            icon={<ArrowUpRight className="size-3.5" />}
          />
          <Kpi
            label="Bearish"
            value={String(stats.bearish)}
            hint={`TB +5 ${avgLabel(stats.avgRet5Bear)}`}
            tone="bear"
            icon={<ArrowDownRight className="size-3.5" />}
          />
          <Kpi
            label="Hit rate +5"
            value={stats.hit5 == null ? "—" : `${Math.round(stats.hit5 * 100)}%`}
            hint="Đúng hướng sau 5 nến"
          />
          <Kpi
            label="Tín hiệu cuối"
            value={stats.last ? (stats.last.type === "bullish" ? "Bull" : "Bear") : "—"}
            hint={stats.last ? `${stats.last.kind === "hidden" ? "Ẩn" : "Thường"} · sức ${stats.last.strength}` : "Chưa có"}
            tone={stats.last?.type === "bullish" ? "bull" : stats.last?.type === "bearish" ? "bear" : undefined}
          />
        </section>

        <Card className="min-w-0 lg:col-span-8">
          <CardHeader className="px-4 pt-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4 text-muted-foreground" />
                {pairLabel(symbol)} · {INTERVALS.find((t) => t.id === interval)?.label}
              </CardTitle>
              <CardDescription className="mt-1">
                {readoutBar
                  ? `${formatFullTime(readoutBar.t)}  ·  C ${formatPrice(readoutBar.c)}  ·  RSI ${formatRsi(readoutBar.rsi)}`
                  : "Đang tải nến…"}
              </CardDescription>
            </div>
            <div className="flex gap-1">
              <RangeBtn active={range === "recent"} onClick={() => setRange("recent")}>
                140 nến
              </RangeBtn>
              <RangeBtn active={range === "all"} onClick={() => setRange("all")}>
                Toàn bộ
              </RangeBtn>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden pt-3">
            {(!hydrated || (activeScan?.isLoading && !candles.length)) ? (
              <div className="space-y-3">
                <Skeleton className="chart-price rounded-lg" />
                <Skeleton className="chart-rsi rounded-lg" />
              </div>
            ) : (
              <DeskCharts
                bars={bars}
                interval={interval}
                lookback={lookback}
                selected={selected}
                range={range}
                family={family}
                onSelectIndex={selectBar}
                onHoverIndex={setHoverIndex}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex min-w-0 flex-col gap-4 lg:col-span-4">
          <Card className="flex min-h-80 flex-col">
            <CardHeader className="px-4 pt-4">
              <div>
                <CardTitle>Tín hiệu</CardTitle>
                <CardDescription>Nến mở đầu mỗi chuỗi · lọc theo sức mạnh</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex min-h-0 flex-1 flex-col gap-3 pt-3">
              <div className="flex gap-1">
                {(["all", "bullish", "bearish"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    className={cn(
                      "h-9 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
                      filter === f
                        ? f === "bullish"
                          ? "bg-bull-dim text-bull"
                          : f === "bearish"
                            ? "bg-bear-dim text-bear"
                            : "bg-card-2 text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {f === "all" ? "Tất cả" : f === "bullish" ? "Tăng" : "Giảm"}
                  </button>
                ))}
              </div>
              <ScrollArea className="h-72">
                {visibleSignals.length === 0 ? (
                  <p className="px-1 py-8 text-center text-sm text-muted-foreground">
                    Không có tín hiệu trên cửa sổ này. Tăng số nến hoặc đổi lookback.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-1 pr-2">
                    {visibleSignals.map((s) => {
                      const active = selected?.id === s.id;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedId(s.id)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors duration-[var(--motion-quick)]",
                              active ? "bg-card-2" : "hover:bg-card-2/60",
                            )}
                          >
                            <span className="flex min-w-0 flex-col">
                              <span className="flex items-center gap-2">
                                <Badge variant={s.type === "bullish" ? "bull" : "bear"}>
                                  {s.type === "bullish" ? "Bull" : "Bear"}
                                </Badge>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {s.kind === "hidden" ? "Ẩn" : "Thường"} · {formatTime(s.t, interval)}
                                </span>
                              </span>
                              <span className="mt-1 font-mono text-xs tabular text-subtle">
                                RSI {formatRsi(s.rsi)} · sức {s.strength}
                              </span>
                            </span>
                            <span
                              className={cn(
                                "font-mono text-xs tabular",
                                s.ret5 == null
                                  ? "text-muted-foreground"
                                  : s.ret5 >= 0
                                    ? "text-bull"
                                    : "text-bear",
                              )}
                            >
                              {formatPct(s.ret5)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          <FormulaPanel bar={selected ? bars[selected.index] : null} lookback={lookback} />
        </div>

        <Card className="min-w-0 overflow-hidden lg:col-span-12">
          <CardHeader className="px-4 pt-4">
            <div>
              <CardTitle>Sổ mô phỏng không chồng lệnh</CardTitle>
              <CardDescription>
                Vào tại close, thoát sau {hold} nến, phí 0.10% mỗi phía.{" "}
                {book.trades} lệnh · cuối {formatPct(book.end - 1)} · DD tối đa{" "}
                {(book.maxDd * 100).toFixed(1)}%
              </CardDescription>
            </div>
            <label className="flex w-full max-w-xs items-center gap-3">
              <span className="w-16 shrink-0 text-xs text-muted-foreground">
                Giữ <span className="font-mono tabular text-foreground">{hold}</span>
              </span>
              <Slider
                min={3}
                max={20}
                step={1}
                value={[hold]}
                onValueChange={(v) => setHold(v[0] ?? 5)}
              />
            </label>
          </CardHeader>
          <CardContent className="overflow-x-auto pt-3">
            <EquityChart points={book.points} />
            <table className="mt-3 w-max min-w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 font-medium">Thời gian</th>
                  <th className="px-3 py-2 font-medium">Loại</th>
                  <th className="px-3 py-2 font-medium">Họ</th>
                  <th className="px-3 py-2 font-medium">Sức</th>
                  <th className="px-3 py-2 font-medium">Giá</th>
                  <th className="px-3 py-2 font-medium">RSI</th>
                  <th className="px-3 py-2 font-medium">+5</th>
                  <th className="px-3 py-2 font-medium">+10</th>
                  <th className="px-3 py-2 font-medium">+20</th>
                </tr>
              </thead>
              <tbody>
                {visibleSignals.slice(0, 40).map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={cn(
                      "cursor-pointer border-b border-border/60 transition-colors duration-[var(--motion-quick)] hover:bg-card-2/80",
                      selected?.id === s.id && "bg-card-2",
                    )}
                  >
                    <td className="px-3 py-2 font-mono text-xs tabular">{formatFullTime(s.t)}</td>
                    <td className="px-3 py-2">
                      <Badge variant={s.type === "bullish" ? "bull" : "bear"}>
                        {s.type === "bullish" ? "Bullish" : "Bearish"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {s.kind === "hidden" ? "Ẩn" : "Thường"}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs tabular">{s.strength}</td>
                    <td className="px-3 py-2 font-mono text-xs tabular">{formatPrice(s.close)}</td>
                    <td className="px-3 py-2 font-mono text-xs tabular">{formatRsi(s.rsi)}</td>
                    <RetCell v={s.ret5} />
                    <RetCell v={s.ret10} />
                    <RetCell v={s.ret20} />
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleSignals.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Chưa có hàng để hiển thị.</p>
            ) : null}
            <p className="px-1 pt-3 text-xs text-subtle">
              Đây là nghiên cứu trên nến đã đóng, không phải lệnh thật và không phải khuyến nghị đầu tư.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "bull" | "bear";
  icon?: ReactNode;
}) {
  return (
    <div className="stagger-item rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        {icon ? <span className={tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : ""}>{icon}</span> : null}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-lg tabular tracking-tight",
          tone === "bull" && "text-bull",
          tone === "bear" && "text-bear",
        )}
      >
        {value}
      </div>
      <div className="mt-0.5 text-xs text-subtle">{hint}</div>
    </div>
  );
}

function RangeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-sm px-3 text-xs font-medium transition-colors duration-[var(--motion-quick)]",
        active ? "bg-card-2 text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function RetCell({ v }: { v: number | null }) {
  return (
    <td
      className={cn(
        "px-3 py-2 font-mono text-xs tabular",
        v == null ? "text-muted-foreground" : v >= 0 ? "text-bull" : "text-bear",
      )}
    >
      {formatPct(v)}
    </td>
  );
}

function FormulaPanel({
  bar,
  lookback,
}: {
  bar: Bar | null | undefined;
  lookback: number;
}) {
  const closeOk = bar?.closeMax != null && bar.c >= bar.closeMax;
  const rsiWeak = bar?.rsi != null && bar.rsiMax != null && bar.rsi < bar.rsiMax;
  const closeLow = bar?.closeMin != null && bar.c <= bar.closeMin;
  const rsiStrong = bar?.rsi != null && bar.rsiMin != null && bar.rsi > bar.rsiMin;
  const hidBullPx = bar?.closeMin != null && bar.c > bar.closeMin;
  const hidBullRsi = bar?.rsi != null && bar.rsiMin != null && bar.rsi <= bar.rsiMin;
  const hidBearPx = bar?.closeMax != null && bar.c < bar.closeMax;
  const hidBearRsi = bar?.rsi != null && bar.rsiMax != null && bar.rsi >= bar.rsiMax;
  const any =
    !!bar &&
    (bar.bearishDivergence ||
      bar.bullishDivergence ||
      bar.hiddenBullish ||
      bar.hiddenBearish);

  return (
    <Card>
      <CardHeader className="px-4 pt-4">
        <div>
          <CardTitle>Logic chiến lược</CardTitle>
          <CardDescription>DIVERGENCE_LOOKBACK = {lookback}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-3 text-sm">
        <pre className="max-w-full overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground">
{`bearish = (close >= close_max) & (rsi < rsi_max)
bullish = (close <= close_min) & (rsi > rsi_min)
hid_bull = (close > close_min) & (rsi <= rsi_min)
hid_bear = (close < close_max) & (rsi >= rsi_max)`}
        </pre>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Cực trị lấy trên {lookback} nến trước, không gồm nến hiện tại. Thường là đảo chiều. Ẩn là tiếp diễn: RSI lập cực trị mới còn giá thì không.
        </p>
        {bar ? (
          <div className="rounded-lg bg-background p-3 font-mono text-xs">
            <Row ok={closeOk} label="close ≥ close_max" left={formatPrice(bar.c)} right={formatPrice(bar.closeMax ?? NaN)} />
            <Row ok={rsiWeak} label="rsi < rsi_max" left={formatRsi(bar.rsi)} right={formatRsi(bar.rsiMax)} />
            <Row ok={closeLow} label="close ≤ close_min" left={formatPrice(bar.c)} right={formatPrice(bar.closeMin ?? NaN)} />
            <Row ok={rsiStrong} label="rsi > rsi_min" left={formatRsi(bar.rsi)} right={formatRsi(bar.rsiMin)} />
            <Row ok={!!hidBullPx && !!hidBullRsi} label="hidden bull" left={formatPrice(bar.c)} right={formatRsi(bar.rsi)} />
            <Row ok={!!hidBearPx && !!hidBearRsi} label="hidden bear" left={formatPrice(bar.c)} right={formatRsi(bar.rsi)} />
            <div className="mt-2 flex flex-wrap gap-2">
              {bar.bearishDivergence ? <Badge variant="bear">bearish</Badge> : null}
              {bar.bullishDivergence ? <Badge variant="bull">bullish</Badge> : null}
              {bar.hiddenBullish ? <Badge variant="bull">hidden bull</Badge> : null}
              {bar.hiddenBearish ? <Badge variant="bear">hidden bear</Badge> : null}
              {!any ? <span className="text-muted-foreground">Không kích hoạt trên nến này</span> : null}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function Row({
  ok,
  label,
  left,
  right,
}: {
  ok: boolean;
  label: string;
  left: string;
  right: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="text-subtle">{label}</span>
      <span className={ok ? "text-bull" : "text-muted-foreground"}>
        {left} · {right}
      </span>
    </div>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="relative grid size-10 place-items-center rounded-md bg-card shadow-[var(--shadow-border)]"
    >
      <svg viewBox="0 0 32 32" className="size-6" fill="none">
        <path
          d="M4 22l5-7 4 3 6-10 4 5 5-8"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-foreground"
        />
        <path
          d="M4 24c3-1 5 3 8 1s4-5 7-2 5 4 9-1"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-bull"
        />
      </svg>
    </span>
  );
}
