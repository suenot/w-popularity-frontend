"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.replace(isAuthenticated ? "/dashboard" : "/login");
  }, [ready, isAuthenticated, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center text-neutral-500">
      <Loader2 size={20} className="animate-spin" />
    </div>
  );
}
