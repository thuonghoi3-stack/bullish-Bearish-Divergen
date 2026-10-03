import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import type { EquityPoint } from "@/lib/strategy";
import { formatFullTime, formatPct } from "@/lib/utils";

export function EquityChart({ points }: { points: EquityPoint[] }) {
  if (points.length === 0) return null;
  const last = points[points.length - 1]!.equity;
  const up = last >= 1;
  const vals = points.map((p) => p.equity);
  let min = Math.min(1, ...vals);
  let max = Math.max(1, ...vals);
  if (min === max) {
    min -= 0.01;
    max += 0.01;
  }

  return (
    <div className="h-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <YAxis hide domain={[min, max]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const row = payload[0].payload as EquityPoint;
              return (
                <div className="rounded-md bg-card px-3 py-2 font-mono text-xs shadow-[var(--shadow-border)]">
                  <div className="text-muted-foreground">{formatFullTime(row.t)}</div>
                  <div className="mt-1 tabular">
                    {row.equity.toFixed(3)} · {formatPct(row.equity - 1)}
                  </div>
                </div>
              );
            }}
          />
          <ReferenceLine y={1} stroke="var(--color-border)" strokeDasharray="3 4" />
          <Line
            type="monotone"
            dataKey="equity"
            stroke={up ? "var(--color-bull)" : "var(--color-bear)"}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
