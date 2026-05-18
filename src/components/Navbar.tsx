"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { TrendingUp } from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/channels", label: "Channels" },
  { href: "/compare", label: "Compare" },
  { href: "/settings", label: "Settings" },
];

export default function Navbar() {
  const { isAuthenticated, ready } = useAuth();
  const pathname = usePathname();

  if (!ready || !isAuthenticated) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-indigo-400 font-semibold"
        >
          <TrendingUp size={18} />
          <span>Popularity</span>
        </Link>
        <ul className="flex items-center gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
