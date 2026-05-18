"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  label: string;
  value: number | string;
  deltaPct?: number | null;
  sparkline?: number[];
  color?: string;
}

function fmtDelta(d: number) {
  const sign = d > 0 ? "+" : "";
  return `${sign}${d.toFixed(1)}%`;
}

export default function KpiCard({
  label,
  value,
  deltaPct,
  sparkline,
  color = "#6366f1",
}: Props) {
  const deltaColor =
    deltaPct == null
      ? "text-neutral-400"
      : deltaPct >= 0
        ? "text-emerald-400"
        : "text-rose-400";

  const data = (sparkline ?? []).map((v, i) => ({ i, v }));

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col gap-2">
      <div className="text-xs uppercase tracking-wider text-neutral-400">
        {label}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-semibold text-neutral-100">{value}</div>
        {deltaPct != null && (
          <div className={`text-xs font-medium ${deltaColor}`}>
            {fmtDelta(deltaPct)}
          </div>
        )}
      </div>
      {data.length > 1 && (
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
