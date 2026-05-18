"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useChannel,
  useStats,
  useSnapshots,
  usePosts,
} from "@/lib/hooks";
import { PLATFORM_COLORS } from "@/lib/platforms";
import PlatformBadge from "@/components/PlatformBadge";
import KpiCard from "@/components/KpiCard";
import GrowthChart from "@/components/GrowthChart";
import { apiDelete } from "@/lib/api";
import { ArrowLeft, ExternalLink, Loader2, Trash2 } from "lucide-react";

function fmtNum(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export default function ChannelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const { data: channel, isLoading: chLoading } = useChannel(id);
  const { data: stats } = useStats(id);
  const { data: snapshots } = useSnapshots(id);
  const { data: posts } = usePosts(id);

  const handleDelete = async () => {
    if (!confirm("Delete this channel? Historical data will be removed.")) return;
    try {
      await apiDelete(`/api/v1/channels/${id}`);
      router.push("/channels");
    } catch (e) {
      alert(`Failed to delete: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  if (chLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        <Loader2 size={20} className="animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-neutral-400">
        Channel not found.{" "}
        <Link href="/channels" className="text-indigo-400">
          Back to list
        </Link>
      </div>
    );
  }

  const color = PLATFORM_COLORS[channel.platform];

  return (
    <div className="space-y-6">
      <Link
        href="/channels"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-100"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlatformBadge platform={channel.platform} size="md" />
          <h1 className="text-2xl font-semibold text-neutral-100">
            @{channel.handle}
          </h1>
          <a
            href={channel.url}
            target="_blank"
            rel="noreferrer"
            className="text-neutral-500 hover:text-neutral-300"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm rounded-lg flex items-center gap-1.5"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard
          label="Followers"
          value={fmtNum(stats?.followers ?? channel.latest?.followers)}
          deltaPct={stats?.d7_pct ?? null}
          color={color}
        />
        <KpiCard
          label="Δ 30d"
          value={stats?.d30_pct != null ? `${stats.d30_pct.toFixed(1)}%` : "—"}
          deltaPct={stats?.d30_pct ?? null}
          color={color}
        />
        <KpiCard
          label="Δ 90d"
          value={stats?.d90_pct != null ? `${stats.d90_pct.toFixed(1)}%` : "—"}
          deltaPct={stats?.d90_pct ?? null}
          color={color}
        />
        <KpiCard
          label="CAGR 1y"
          value={
            stats?.cagr_1y_pct != null ? `${stats.cagr_1y_pct.toFixed(1)}%` : "—"
          }
          color={color}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard label="Δ 365d" value={
          stats?.d365_pct != null ? `${stats.d365_pct.toFixed(1)}%` : "—"
        } />
        <KpiCard label="Velocity 7d" value={fmtNum(stats?.velocity_7d)} />
        <KpiCard label="Velocity 28d" value={fmtNum(stats?.velocity_28d)} />
        <KpiCard label="Total views" value={fmtNum(stats?.total_views)} />
      </div>

      <GrowthChart
        series={[
          {
            name: "Followers",
            color,
            data: snapshots ?? [],
          },
        ]}
        metric="followers"
      />

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-800 text-sm font-semibold text-neutral-300">
          Recent posts
        </div>
        {!posts || posts.length === 0 ? (
          <div className="px-4 py-8 text-center text-neutral-500 text-sm">
            No posts yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-900 text-xs uppercase tracking-wider text-neutral-400">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium">Date</th>
                <th className="px-4 py-2.5 text-left font-medium">Title</th>
                <th className="px-4 py-2.5 text-right font-medium">Views</th>
                <th className="px-4 py-2.5 text-right font-medium">Likes</th>
                <th className="px-4 py-2.5 text-right font-medium">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-900/50">
                  <td className="px-4 py-2.5 text-neutral-400">
                    {p.ts?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-2.5 text-neutral-200 max-w-xl truncate">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        {p.title || p.url}
                      </a>
                    ) : (
                      p.title || "(untitled)"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">{fmtNum(p.views)}</td>
                  <td className="px-4 py-2.5 text-right">{fmtNum(p.likes)}</td>
                  <td className="px-4 py-2.5 text-right">{fmtNum(p.comments)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
