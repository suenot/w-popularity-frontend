"use client";

import type { Platform } from "@/lib/platforms";

/**
 * Per-platform extra signals shipped in `snapshot.raw`.
 * Each entry is `{ key, label, render }` so we can format domain-specific
 * values nicely (badges as gold/silver/bronze chips, dates as ISO strings,
 * URLs as links, …) and ignore anything we don't recognise for that platform.
 */
type Field = {
  key: string;
  label: string;
  render?: (v: unknown) => React.ReactNode;
};

const ISO = (v: unknown) => {
  if (typeof v !== "number") return String(v);
  // Stack Exchange timestamps are unix seconds.
  return new Date(v * 1000).toISOString().slice(0, 10);
};

const URL_LINK = (v: unknown) =>
  typeof v === "string" && v ? (
    <a
      href={v}
      target="_blank"
      rel="noreferrer"
      className="text-indigo-400 hover:underline"
    >
      {v}
    </a>
  ) : (
    "—"
  );

const BADGES = (v: unknown) => {
  const b = v as { gold?: number; silver?: number; bronze?: number } | null;
  if (!b) return "—";
  return (
    <span className="inline-flex gap-1.5 text-xs">
      <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-yellow-400">
        ★ {b.gold ?? 0}
      </span>
      <span className="rounded bg-zinc-400/15 px-1.5 py-0.5 text-zinc-300">
        ★ {b.silver ?? 0}
      </span>
      <span className="rounded bg-amber-700/20 px-1.5 py-0.5 text-amber-500">
        ★ {b.bronze ?? 0}
      </span>
    </span>
  );
};

const FIELDS_BY_PLATFORM: Partial<Record<Platform, Field[]>> = {
  stackoverflow: [
    { key: "display_name", label: "Name" },
    { key: "reputation", label: "Reputation" },
    { key: "badges", label: "Badges", render: BADGES },
    { key: "question_count", label: "Questions" },
    { key: "answer_count", label: "Answers" },
    { key: "up_vote_count", label: "Upvotes given" },
    { key: "down_vote_count", label: "Downvotes given" },
    { key: "accept_rate", label: "Accept rate (%)" },
    { key: "location", label: "Location" },
    { key: "website_url", label: "Website", render: URL_LINK },
    { key: "creation_date", label: "Joined", render: ISO },
    { key: "last_access_date", label: "Last active", render: ISO },
    { key: "user_type", label: "Account type" },
    { key: "quota_remaining", label: "API quota left" },
  ],
  habr: [
    { key: "karma", label: "Karma" },
    { key: "rating", label: "Rating" },
    { key: "alias", label: "Alias" },
    { key: "fullname", label: "Full name" },
  ],
  telegram: [
    { key: "title", label: "Channel title" },
    { key: "photos", label: "Photos" },
    { key: "videos", label: "Videos" },
    { key: "links", label: "Links" },
    { key: "files", label: "Files" },
  ],
  instagram: [
    { key: "display_name", label: "Display name" },
    { key: "following", label: "Following" },
  ],
  smartlab: [
    { key: "title", label: "Display name" },
  ],
  tbank_pulse: [
    { key: "id", label: "Profile id" },
    { key: "nickname", label: "Nickname" },
    { key: "image", label: "Avatar URL", render: URL_LINK },
  ],
  x: [
    { key: "name", label: "Display name" },
    { key: "description", label: "Bio" },
    { key: "verified", label: "Verified" },
    { key: "listed_count", label: "Listed in" },
    { key: "following_count", label: "Following" },
    { key: "created_at", label: "Joined" },
  ],
  youtube: [
    { key: "channel_id", label: "Channel ID" },
    { key: "title", label: "Title" },
  ],
  facebook: [
    { key: "page_id", label: "Page ID" },
    { key: "about", label: "About" },
    { key: "link", label: "Page URL", render: URL_LINK },
    { key: "verification_status", label: "Verification" },
  ],
  linkedin: [
    { key: "headline", label: "Headline" },
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "locationName", label: "Location" },
    { key: "industryName", label: "Industry" },
    { key: "currentCompany", label: "Company" },
    { key: "connectionCount", label: "Connections" },
  ],
  reddit: [
    { key: "name", label: "Username" },
    { key: "total_karma", label: "Total karma" },
    { key: "link_karma", label: "Link karma" },
    { key: "comment_karma", label: "Comment karma" },
    { key: "awardee_karma", label: "Awardee karma" },
    { key: "awarder_karma", label: "Awarder karma" },
    { key: "user_subreddit_subscribers", label: "u/-subreddit subs" },
    { key: "is_gold", label: "Reddit Premium" },
    { key: "is_mod", label: "Moderator" },
    { key: "is_employee", label: "Reddit employee" },
    { key: "created_utc", label: "Joined", render: ISO },
    { key: "bio", label: "Bio" },
  ],
  github: [
    { key: "name", label: "Display name" },
    { key: "bio", label: "Bio" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "blog", label: "Blog", render: URL_LINK },
    { key: "twitter_username", label: "Twitter" },
    { key: "followers", label: "Followers" },
    { key: "following", label: "Following" },
    { key: "public_repos", label: "Public repos" },
    { key: "public_gists", label: "Public gists" },
    { key: "total_stars", label: "Total stars" },
    { key: "total_forks", label: "Total forks" },
    { key: "top_repos_count", label: "Repos with ★≥threshold" },
    { key: "archived_repo_count", label: "Archived repos" },
    { key: "forked_repo_count", label: "Forked repos" },
    { key: "created_at", label: "Joined" },
    { key: "top_repos", label: "Top repos", render: renderTopRepos },
    { key: "languages", label: "Languages", render: renderLangHist },
    { key: "topics_top", label: "Top topics", render: renderTopicsHist },
  ],
};

function renderTopRepos(v: unknown): React.ReactNode {
  const repos = v as Array<{
    name: string;
    full_name?: string;
    url?: string;
    stars: number;
    forks: number;
    language?: string;
    description?: string;
  }> | null;
  if (!repos || repos.length === 0) return "—";
  return (
    <ul className="space-y-1.5">
      {repos.map((r) => (
        <li key={r.full_name || r.name} className="flex items-baseline gap-2 text-xs">
          <a
            href={r.url || `https://github.com/${r.full_name || r.name}`}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-400 hover:underline"
          >
            {r.name}
          </a>
          <span className="rounded bg-yellow-500/15 px-1.5 py-0.5 text-yellow-400">
            ★ {r.stars}
          </span>
          {r.forks > 0 && (
            <span className="rounded bg-neutral-500/15 px-1.5 py-0.5 text-neutral-300">
              🍴 {r.forks}
            </span>
          )}
          {r.language && (
            <span className="text-neutral-500">{r.language}</span>
          )}
          {r.description && (
            <span className="text-neutral-400 truncate">— {r.description}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

function renderLangHist(v: unknown): React.ReactNode {
  const hist = v as Record<string, number> | null;
  if (!hist || Object.keys(hist).length === 0) return "—";
  const sorted = Object.entries(hist).sort((a, b) => b[1] - a[1]);
  return (
    <div className="flex flex-wrap gap-1.5">
      {sorted.map(([lang, n]) => (
        <span key={lang} className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-xs text-indigo-300">
          {lang} · {n}
        </span>
      ))}
    </div>
  );
}

function renderTopicsHist(v: unknown): React.ReactNode {
  const items = v as Array<{ name: string; count: number }> | null;
  if (!items || items.length === 0) return "—";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t.name} className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-xs text-emerald-300">
          {t.name} · {t.count}
        </span>
      ))}
    </div>
  );
}

function fmtValue(v: unknown): React.ReactNode {
  if (v == null || v === "") return "—";
  if (typeof v === "boolean") return v ? "yes" : "no";
  if (typeof v === "number") {
    return v >= 1000 ? v.toLocaleString("en-US") : String(v);
  }
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

export default function PlatformRawCard({
  raw,
  platform,
}: {
  raw: Record<string, unknown>;
  platform: Platform;
}) {
  const known = FIELDS_BY_PLATFORM[platform] ?? [];
  const rows = known
    .map((f) => ({
      ...f,
      value: raw[f.key],
    }))
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== "");

  // Anything in raw that we don't have a label for — show as a small dump
  // at the bottom so nothing is silently lost.
  const knownKeys = new Set(known.map((f) => f.key));
  const extra = Object.entries(raw).filter(([k]) => !knownKeys.has(k));

  if (rows.length === 0 && extra.length === 0) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      <div className="px-4 py-3 border-b border-neutral-800 text-sm font-semibold text-neutral-300 capitalize">
        {platform.replace(/_/g, " ")} details
      </div>
      {rows.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 px-4 py-3 text-sm">
          {rows.map((r) => (
            <div key={r.key} className="flex items-baseline gap-2">
              <dt className="min-w-32 text-xs uppercase tracking-wider text-neutral-500">
                {r.label}
              </dt>
              <dd className="flex-1 text-neutral-100">
                {r.render ? r.render(r.value) : fmtValue(r.value)}
              </dd>
            </div>
          ))}
        </dl>
      )}
      {extra.length > 0 && (
        <details className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-500">
          <summary className="cursor-pointer hover:text-neutral-300">
            Raw JSON ({extra.length} extra fields)
          </summary>
          <pre className="mt-2 overflow-x-auto rounded bg-neutral-950 p-3 text-[11px] text-neutral-400">
            {JSON.stringify(Object.fromEntries(extra), null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
