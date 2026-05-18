"use client";

import { AUTH_URL } from "./config";

const TOKEN_KEY = "auth_token";

export interface JwtPayload {
  sub?: string;
  username?: string;
  email?: string;
  role?: string;
  services?: Record<string, string>;
  exp?: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  const tok = localStorage.getItem(TOKEN_KEY);
  if (!tok) return null;
  const payload = decodeJwt(tok);
  if (payload?.exp && Date.now() / 1000 > payload.exp) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return tok;
}

async function persistToken(token: string) {
  // Mirror token into an httpOnly cookie for middleware-based protection.
  try {
    await fetch("/api/auth/callback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch {
    // best-effort; client-side localStorage is the source of truth
  }
  localStorage.setItem(TOKEN_KEY, token);
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.detail || data.error || "Invalid credentials" };
    }
    await persistToken(data.token);
    return { token: data.token };
  } catch {
    return { error: "Network error" };
  }
}

export async function registerRequest(
  email: string,
  password: string,
  username?: string,
): Promise<{ token?: string; error?: string }> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        username: username || email.split("@")[0],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { error: data.detail || data.error || "Registration failed" };
    }
    if (data.token) {
      await persistToken(data.token);
    }
    return { token: data.token };
  } catch {
    return { error: "Network error" };
  }
}

export async function logoutRequest() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    /* ignore */
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}
