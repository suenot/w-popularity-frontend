"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  loginRequest,
  registerRequest,
  logoutRequest,
  getStoredToken,
  decodeJwt,
} from "./auth";
import { SERVICE_NAME } from "./config";

export type UserRole = "admin" | "superuser" | "user";

interface AuthContextProps {
  token: string | null;
  isAuthenticated: boolean;
  sub: string | null;
  username: string | null;
  email: string | null;
  role: UserRole | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    email: string,
    password: string,
    username?: string,
  ) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) setToken(stored);
    setReady(true);
  }, []);

  const decoded = useMemo(() => (token ? decodeJwt(token) : null), [token]);

  const sub = decoded?.sub ?? null;
  const username = decoded?.username ?? decoded?.sub ?? null;
  const email = decoded?.email ?? null;
  const role = ((decoded?.services?.[SERVICE_NAME] ?? decoded?.role) ??
    null) as UserRole | null;

  const login = useCallback(async (em: string, password: string) => {
    const r = await loginRequest(em, password);
    if (r.error) return r.error;
    if (r.token) setToken(r.token);
    return null;
  }, []);

  const register = useCallback(
    async (em: string, password: string, usernameArg?: string) => {
      const r = await registerRequest(em, password, usernameArg);
      if (r.error) return r.error;
      if (r.token) setToken(r.token);
      return null;
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    setToken(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        sub,
        username,
        email,
        role,
        ready,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
