"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { Snapshot } from "@/lib/types";

export interface GrowthSeries {
  name: string;
  color: string;
  data: Snapshot[];
}

interface Props {
  series: GrowthSeries[];
  metric?: "followers" | "total_views";
  showRangePicker?: boolean;
  onRangeChange?: (from: string, to: string) => void;
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function GrowthChart({
  series,
  metric = "followers",
  showRangePicker = true,
  onRangeChange,
}: Props) {
  const today = new Date();
  const ninetyAgo = new Date(today);
  ninetyAgo.setDate(today.getDate() - 90);

  const [from, setFrom] = useState(isoDay(ninetyAgo));
  const [to, setTo] = useState(isoDay(today));

  // Merge all series by timestamp for Recharts
  const tsSet = new Set<string>();
  for (const s of series) for (const p of s.data) tsSet.add(p.ts);
  const sortedTs = Array.from(tsSet).sort();

  const merged = sortedTs.map((ts) => {
    const row: Record<string, string | number | null> = { ts };
    for (const s of series) {
      const point = s.data.find((d) => d.ts === ts);
      const v = point ? (point[metric] ?? null) : null;
      row[s.name] = v as number | null;
    }
    return row;
  });

  const applyRange = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
    onRangeChange?.(f, t);
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
      {showRangePicker && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="text-xs text-neutral-400 flex items-center gap-2">
            From
            <input
              type="date"
              value={from}
              onChange={(e) => applyRange(e.target.value, to)}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-100"
            />
          </label>
          <label className="text-xs text-neutral-400 flex items-center gap-2">
            To
            <input
              type="date"
              value={to}
              onChange={(e) => applyRange(from, e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-100"
            />
          </label>
        </div>
      )}

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={merged}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis
              dataKey="ts"
              tick={{ fill: "#a3a3a3", fontSize: 11 }}
              tickFormatter={(t) => (typeof t === "string" ? t.slice(5, 10) : "")}
            />
            <YAxis
              tick={{ fill: "#a3a3a3", fontSize: 11 }}
              tickFormatter={(v) =>
                typeof v === "number" && v >= 1000
                  ? `${(v / 1000).toFixed(1)}k`
                  : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #404040",
                borderRadius: 6,
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((s) => (
              <Line
                key={s.name}
                type="monotone"
                dataKey={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                connectNulls
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
