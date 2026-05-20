"use client";

import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { useChannels } from "@/lib/hooks";
import PlatformBadge from "@/components/PlatformBadge";

function fmtNum(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function fmtPct(p: number | undefined | null) {
  if (p == null) return "—";
  const sign = p > 0 ? "+" : "";
  return `${sign}${p.toFixed(1)}%`;
}

function pctColor(p: number | undefined | null) {
  if (p == null) return "text-neutral-500";
  return p >= 0 ? "text-emerald-400" : "text-rose-400";
}

export default function ChannelsPage() {
  const { data, isLoading, error } = useChannels();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-100">Channels</h1>
        <Link
          href="/channels/new"
          className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 flex items-center gap-1.5"
        >
          <Plus size={14} /> Add channel
        </Link>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12 text-neutral-500">
          <Loader2 size={18} className="animate-spin" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300 text-sm">
          Failed to load: {String(error.message ?? error)}
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-8 text-center text-neutral-500 text-sm">
          No channels yet. Add your first one to start tracking.
        </div>
      )}

      {data && data.length > 0 && (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Channel</th>
                <th className="px-4 py-3 text-right font-medium">Followers</th>
                <th className="px-4 py-3 text-right font-medium">Δ1d</th>
                <th className="px-4 py-3 text-right font-medium">Δ7d</th>
                <th className="px-4 py-3 text-right font-medium">Δ30d</th>
                <th className="px-4 py-3 text-right font-medium">Δ90d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {data.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-900/50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/channels/${c.id}`}
                      className="flex items-center gap-3 text-neutral-200 hover:text-white"
                    >
                      <PlatformBadge platform={c.platform} />
                      <span className="truncate">@{c.handle}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-neutral-200">
                    {fmtNum(c.followers)}
                  </td>
                  <td className={`px-4 py-3 text-right ${pctColor(c.d1_pct)}`}>
                    {fmtPct(c.d1_pct)}
                  </td>
                  <td className={`px-4 py-3 text-right ${pctColor(c.d7_pct)}`}>
                    {fmtPct(c.d7_pct)}
                  </td>
                  <td className={`px-4 py-3 text-right ${pctColor(c.d30_pct)}`}>
                    {fmtPct(c.d30_pct)}
                  </td>
                  <td className={`px-4 py-3 text-right ${pctColor(c.d90_pct)}`}>
                    {fmtPct(c.d90_pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
