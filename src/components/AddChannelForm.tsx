"use client";

import { useMemo, useState } from "react";
import { detectChannel } from "@/lib/platforms";
import PlatformBadge from "./PlatformBadge";
import { apiPost } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AddChannelForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const detected = useMemo(() => detectChannel(url), [url]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!detected) {
      setError("Could not detect platform from URL");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/api/v1/channels", {
        platform: detected.platform,
        handle: detected.handle,
        url: detected.url,
      });
      router.push("/channels");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
          Channel URL
        </label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoFocus
          required
          placeholder="https://youtube.com/@yourchannel"
          className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {url && (
        <div className="text-sm">
          {detected ? (
            <div className="flex items-center gap-2 text-neutral-300">
              Detected:
              <PlatformBadge platform={detected.platform} />
              <span className="text-neutral-500">@{detected.handle}</span>
            </div>
          ) : (
            <div className="text-neutral-500">No supported platform detected.</div>
          )}
        </div>
      )}

      {error && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !detected}
        className="px-4 py-2 bg-indigo-500 text-white text-sm font-semibold rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        Add channel
      </button>
    </form>
  );
}
