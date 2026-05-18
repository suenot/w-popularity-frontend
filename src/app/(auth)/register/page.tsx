"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerRequest } from "@/lib/auth";
import { Loader2, TrendingUp } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError(null);
    setLoading(true);
    const r = await registerRequest(email, password);
    setLoading(false);
    if (r.error) {
      setError(r.error);
      return;
    }
    router.push("/login");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8 text-indigo-400">
          <TrendingUp size={28} />
          <span className="text-2xl font-semibold">Popularity</span>
        </div>

        <form
          onSubmit={submit}
          className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-neutral-100 text-center">
            Create account
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 outline-none focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 outline-none focus:border-indigo-500"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || password.length < 6}
            className="w-full py-2.5 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Register
          </button>

          <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-800">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
