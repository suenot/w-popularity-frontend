import type { Platform } from "./platforms";

export interface Channel {
  id: string;
  platform: Platform;
  handle: string;
  url: string;
  followers?: number;
  total_views?: number;
  posts_count?: number;
  d1_pct?: number;
  d7_pct?: number;
  d30_pct?: number;
  d90_pct?: number;
  d365_pct?: number;
}

export interface Snapshot {
  ts: string;
  followers: number;
  posts_count?: number;
  total_likes?: number;
  total_views?: number;
  total_comments?: number;
  raw?: Record<string, unknown>;
}

export interface ChannelStats {
  followers: number;
  total_views: number;
  posts_count: number;
  d1_pct: number;
  d7_pct: number;
  d30_pct: number;
  d90_pct: number;
  d365_pct: number;
  cagr_1y_pct: number;
  velocity_7d: number;
  velocity_28d: number;
  raw?: Record<string, unknown>;
}

export interface Post {
  id: string;
  ts: string;
  title?: string;
  url?: string;
  views?: number;
  likes?: number;
  comments?: number;
}

export interface ChannelDetail {
  id: string;
  platform: Platform;
  handle: string;
  url: string;
  latest?: Snapshot;
}
