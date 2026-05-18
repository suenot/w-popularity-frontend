"use client";

import { useAuth } from "@/lib/AuthContext";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  const { email, username, sub, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold text-neutral-100">Settings</h1>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-neutral-300">Account</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Email</dt>
            <dd className="text-neutral-200 truncate">{email ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Username</dt>
            <dd className="text-neutral-200 truncate">{username ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">User ID</dt>
            <dd className="text-neutral-200 font-mono text-xs truncate">
              {sub ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={logout}
        className="px-4 py-2 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 text-sm font-semibold rounded-lg flex items-center gap-2"
      >
        <LogOut size={14} /> Log out
      </button>
    </div>
  );
}
