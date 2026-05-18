"use client";

import { useMemo, useState } from "react";
import { useChannels } from "@/lib/hooks";
import { apiGet } from "@/lib/api";
import { PLATFORM_COLORS } from "@/lib/platforms";
import PlatformBadge from "@/components/PlatformBadge";
import GrowthChart, { type GrowthSeries } from "@/components/GrowthChart";
import type { Snapshot } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function ComparePage() {
  const { data: channels, isLoading } = useChannels();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [series, setSeries] = useState<GrowthSeries[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const ids = useMemo(() => Array.from(selected), [selected]);

  const load = async () => {
    if (!channels || ids.length === 0) return;
    setLoading(true);
    try {
      const out: GrowthSeries[] = await Promise.all(
        ids.map(async (id) => {
          const ch = channels.find((c) => c.id === id);
          const snaps = await apiGet<Snapshot[]>(
            `/api/v1/channels/${id}/snapshots`,
          );
          return {
            name: ch ? `@${ch.handle}` : id,
            color: ch ? PLATFORM_COLORS[ch.platform] : "#888",
            data: snaps,
          };
        }),
      );
      setSeries(out);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-neutral-100">Compare</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-10 text-neutral-500">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
          <p className="text-sm text-neutral-400">
            Select channels to overlay on a single growth chart.
          </p>
          <div className="flex flex-wrap gap-2">
            {channels?.map((c) => {
              const active = selected.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    active
                      ? "border-indigo-500 bg-indigo-500/10 text-neutral-100"
                      : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
                  }`}
                >
                  <PlatformBadge platform={c.platform} />
                  <span>@{c.handle}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={load}
            disabled={loading || ids.length === 0}
            className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Overlay {ids.length > 0 ? `(${ids.length})` : ""}
          </button>
        </div>
      )}

      {series.length > 0 && (
        <GrowthChart series={series} metric="followers" />
      )}
    </div>
  );
}
