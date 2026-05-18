"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useChannels } from "@/lib/hooks";
import { PLATFORM_COLORS, PLATFORM_NAMES } from "@/lib/platforms";
import type { Channel } from "@/lib/types";
import PlatformBadge from "@/components/PlatformBadge";
import KpiCard from "@/components/KpiCard";
import { ArrowRight, Loader2 } from "lucide-react";

function fmtNum(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default function DashboardPage() {
  const { data, isLoading, error } = useChannels();

  const totalReach = useMemo(() => {
    if (!data) return 0;
    return data.reduce((s, c) => s + (c.followers ?? 0), 0);
  }, [data]);

  const pieData = useMemo(() => {
    if (!data) return [] as Array<{ name: string; value: number; color: string }>;
    const byPlat: Record<string, number> = {};
    for (const c of data) {
      byPlat[c.platform] = (byPlat[c.platform] ?? 0) + (c.followers ?? 0);
    }
    return Object.entries(byPlat)
      .map(([p, v]) => ({
        name: PLATFORM_NAMES[p as keyof typeof PLATFORM_NAMES] ?? p,
        value: v,
        color: PLATFORM_COLORS[p as keyof typeof PLATFORM_COLORS] ?? "#888",
      }))
      .filter((r) => r.value > 0);
  }, [data]);

  const topGrowers = useMemo<Channel[]>(() => {
    if (!data) return [];
    return [...data]
      .filter((c) => c.d30_pct != null)
      .sort((a, b) => (b.d30_pct ?? 0) - (a.d30_pct ?? 0))
      .slice(0, 5);
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-sm">
        Failed to load channels: {String(error.message ?? error)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-100">Dashboard</h1>
        <Link
          href="/channels/new"
          className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          Add channel <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard label="Total reach" value={fmtNum(totalReach)} />
        <KpiCard label="Channels" value={data?.length ?? 0} />
        <KpiCard
          label="Platforms"
          value={new Set(data?.map((c) => c.platform)).size}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            Platform mix
          </h2>
          {pieData.length === 0 ? (
            <div className="text-neutral-500 text-sm py-12 text-center">
              No data yet
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#171717",
                      border: "1px solid #404040",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">
            Top growers (30d)
          </h2>
          {topGrowers.length === 0 ? (
            <div className="text-neutral-500 text-sm py-12 text-center">
              Not enough data yet
            </div>
          ) : (
            <ul className="divide-y divide-neutral-800">
              {topGrowers.map((c) => (
                <li
                  key={c.id}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <Link
                    href={`/channels/${c.id}`}
                    className="flex items-center gap-3 min-w-0 text-neutral-200 hover:text-white"
                  >
                    <PlatformBadge platform={c.platform} />
                    <span className="truncate text-sm">@{c.handle}</span>
                  </Link>
                  <span
                    className={`text-sm font-medium ${
                      (c.d30_pct ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {(c.d30_pct ?? 0) > 0 ? "+" : ""}
                    {(c.d30_pct ?? 0).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
