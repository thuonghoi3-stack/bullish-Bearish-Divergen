import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Signal } from "@/lib/strategy";
import type { SymbolId } from "@/lib/market/constants";
import { cn, formatPct, formatRsi } from "@/lib/utils";

export type RadarCardModel = {
  id: SymbolId;
  base: string;
  loading: boolean;
  synthetic: boolean;
  price: string;
  change: number | null;
  rsi: number | null;
  signal: Signal | null;
  barsAgo: number | null;
};

function ageLabel(barsAgo: number | null) {
  if (barsAgo == null) return "";
  if (barsAgo <= 0) return "nến này";
  if (barsAgo <= 2) return "mới";
  return `${barsAgo} nến`;
}

export function PairRadar({
  cards,
  activeId,
  onPick,
}: {
  cards: RadarCardModel[];
  activeId: SymbolId;
  onPick: (id: SymbolId, signalId: string | null) => void;
}) {
  const fresh = cards.filter((c) => c.signal && c.barsAgo != null && c.barsAgo <= 2).length;

  return (
    <section className="min-w-0 lg:col-span-12">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium tracking-tight">Radar 8 cặp</h2>
        <p className="text-xs text-muted-foreground">
          {fresh > 0 ? `${fresh} cặp vừa kích hoạt` : "Không có tín hiệu trong 2 nến gần nhất"}
        </p>
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
        {cards.map((card) => {
          const active = card.id === activeId;
          const freshSig = card.signal != null && card.barsAgo != null && card.barsAgo <= 2;
          return (
            <button
              key={card.id}
              type="button"
              aria-pressed={active}
              onClick={() => onPick(card.id, card.signal?.id ?? null)}
              className={cn(
                "flex h-28 w-40 shrink-0 flex-col items-start justify-between rounded-xl bg-card px-3 py-2.5 text-left shadow-[var(--shadow-border)] transition-colors duration-[var(--motion-quick)]",
                active ? "bg-card-2" : "hover:bg-card-2/70",
              )}
            >
              {card.loading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <>
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="font-mono text-xs">{card.base}</span>
                    {freshSig ? (
                      <span className={card.signal?.type === "bullish" ? "text-xs text-bull" : "text-xs text-bear"}>
                        {ageLabel(card.barsAgo)}
                      </span>
                    ) : (
                      <span className="text-xs text-subtle">{card.synthetic ? "mô phỏng" : ageLabel(card.barsAgo)}</span>
                    )}
                  </span>
                  <span className="font-mono text-sm tabular">{card.price}</span>
                  <span className="flex w-full items-center justify-between gap-2">
                    <span
                      className={cn(
                        "font-mono text-xs tabular",
                        card.change == null
                          ? "text-muted-foreground"
                          : card.change >= 0
                            ? "text-bull"
                            : "text-bear",
                      )}
                    >
                      {formatPct(card.change)}
                    </span>
                    <span className="font-mono text-xs tabular text-subtle">RSI {formatRsi(card.rsi)}</span>
                  </span>
                  {card.signal ? (
                    <span className="flex items-center gap-1.5">
                      <Badge variant={card.signal.type === "bullish" ? "bull" : "bear"}>
                        {card.signal.type === "bullish" ? "Bull" : "Bear"}
                      </Badge>
                      <span className="font-mono text-xs text-subtle">
                        {card.signal.kind === "hidden" ? "ẩn" : "thường"} · {card.signal.strength}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Chưa có tín hiệu</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
