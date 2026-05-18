"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { KeyRound, Loader2, Mail, TrendingUp } from "lucide-react";

type AuthMethod = "otp" | "password";

export default function LoginPage() {
  const [method, setMethod] = useState<AuthMethod>("otp");
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, sendCode, verifyCode, isAuthenticated, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && isAuthenticated) router.replace("/dashboard");
  }, [ready, isAuthenticated, router]);

  const switchMethod = (m: AuthMethod) => {
    setMethod(m);
    setStep("email");
    setError(null);
    setCode("");
    setPassword("");
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);
    setLoading(true);
    const err = await sendCode(email);
    setLoading(false);
    if (err) setError(err);
    else setStep("code");
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return;
    setError(null);
    setLoading(true);
    const err = await verifyCode(email, code);
    setLoading(false);
    if (err) setError(err);
    else router.push("/dashboard");
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setLoading(true);
    const err = await login(email, password);
    setLoading(false);
    if (err) setError(err);
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8 text-indigo-400">
          <TrendingUp size={28} />
          <span className="text-2xl font-semibold">Popularity</span>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-neutral-100 text-center">
            Sign in
          </h2>

          <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            <button
              type="button"
              onClick={() => switchMethod("otp")}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                method === "otp"
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Mail size={14} /> Email code
            </button>
            <button
              type="button"
              onClick={() => switchMethod("password")}
              className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                method === "password"
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <KeyRound size={14} /> Password
            </button>
          </div>

          {method === "otp" && step === "email" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoFocus
                placeholder="you@example.com"
              />
              <ErrorBox error={error} />
              <SubmitButton loading={loading} disabled={!email}>
                Send code
              </SubmitButton>
            </form>
          )}

          {method === "otp" && step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="text-xs text-neutral-400 text-center">
                Code sent to <span className="text-neutral-200">{email}</span>
              </div>
              <Field
                label="Verification code"
                type="text"
                value={code}
                onChange={(v) => setCode(v.replace(/\D/g, "").slice(0, 6))}
                autoFocus
                placeholder="6-digit code"
                inputMode="numeric"
              />
              <ErrorBox error={error} />
              <SubmitButton loading={loading} disabled={code.length < 4}>
                Verify
              </SubmitButton>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-xs text-neutral-500 hover:text-neutral-300"
              >
                Use different email
              </button>
            </form>
          )}

          {method === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                autoFocus
                placeholder="you@example.com"
              />
              <Field
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••"
              />
              <ErrorBox error={error} />
              <SubmitButton loading={loading} disabled={!email || !password}>
                Sign in
              </SubmitButton>
            </form>
          )}

          <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-800">
            No account?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  autoFocus,
  placeholder,
  inputMode,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
  inputMode?: "numeric";
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        required
        inputMode={inputMode}
        className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-neutral-100 outline-none focus:border-indigo-500"
        placeholder={placeholder}
      />
    </div>
  );
}

function ErrorBox({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
      {error}
    </div>
  );
}

function SubmitButton({
  loading,
  disabled,
  children,
}: {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="w-full py-2.5 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
