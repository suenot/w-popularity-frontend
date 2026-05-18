"use client";

import useSWR from "swr";
import { apiGet } from "./api";
import type { Channel, ChannelDetail, ChannelStats, Post, Snapshot } from "./types";

const fetcher = <T,>(path: string) => apiGet<T>(path);

// Backend wraps list responses as { channels: [...] } / { snapshots: [...] } / { posts: [...] }.
// Unwrap so consumers get bare arrays.
const unwrap = async <K extends string, T>(path: string, key: K): Promise<T[]> => {
  const res = await apiGet<Record<K, T[] | null | undefined>>(path);
  const arr = res?.[key];
  return Array.isArray(arr) ? arr : [];
};

export function useChannels() {
  return useSWR<Channel[]>("/api/v1/channels", (p: string) =>
    unwrap<"channels", Channel>(p, "channels"),
  );
}

export function useChannel(id: string | null | undefined) {
  return useSWR<ChannelDetail>(
    id ? `/api/v1/channels/${id}` : null,
    fetcher,
  );
}

export function useSnapshots(
  id: string | null | undefined,
  from?: string,
  to?: string,
) {
  const qs = new URLSearchParams();
  if (from) qs.set("from", from);
  if (to) qs.set("to", to);
  const q = qs.toString();
  return useSWR<Snapshot[]>(
    id ? `/api/v1/channels/${id}/snapshots${q ? `?${q}` : ""}` : null,
    (p: string) => unwrap<"snapshots", Snapshot>(p, "snapshots"),
  );
}

export function useStats(id: string | null | undefined) {
  return useSWR<ChannelStats>(
    id ? `/api/v1/channels/${id}/stats` : null,
    fetcher,
  );
}

export function usePosts(id: string | null | undefined) {
  return useSWR<Post[]>(
    id ? `/api/v1/channels/${id}/posts` : null,
    (p: string) => unwrap<"posts", Post>(p, "posts"),
  );
}
