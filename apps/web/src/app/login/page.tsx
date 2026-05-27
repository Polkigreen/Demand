"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, Mail, Lock, User, Loader2, ArrowRight, Hammer } from "lucide-react";
import { loginEmail, registerEmail, googleAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [authMode, setAuthMode] = useState<"options" | "bankid" | "email">("options");
  const [personnummer, setPersonnummer] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bankIdStep, setBankIdStep] = useState<"input" | "qr" | "success">("input");
  const [countdown, setCountdown] = useState(3);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await googleAuth("mock-google-token", undefined, undefined);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBankIdInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:4000/auth/bankid/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personnummer: personnummer || undefined, platform: "web" }),
      });
      const data = await res.json();
      setLoading(false);
      setBankIdStep("qr");
      let count = 3;
      const interval = setInterval(async () => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          try {
            const collectRes = await fetch("http://localhost:4000/auth/bankid/collect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderRef: data.orderRef }),
            });
            const collectData = await collectRes.json();
            if (collectData.status === "complete") {
              setBankIdStep("success");
              const { user, accessToken, refreshToken } = collectData.completionData;
              setAuth(user, accessToken, refreshToken);
              setTimeout(() => router.push("/"), 1000);
            }
          } catch { setError("BankID verification failed"); }
        }
      }, 1000);
    } catch { setLoading(false); setError("Failed to initiate BankID"); }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = isRegister ? await registerEmail(fullName, email, password) : await loginEmail(email, password);
      setAuth(res.user, res.accessToken, res.refreshToken);
      router.push("/");
    } catch (err: any) { setError(err.message || "Authentication failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-brand-surface rounded-2xl p-8 border border-[#44210c] space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-brand-accent-faded rounded-2xl">
              <Hammer className="h-8 w-8 text-brand-accent" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {authMode === "options" && "Welcome to Demand"}
            {authMode === "bankid" && "BankID Verification"}
            {authMode === "email" && (isRegister ? "Create Account" : "Welcome Back")}
          </h2>
          <p className="text-gray-400 text-sm">
            {authMode === "options" && "Select an authentication method to continue"}
            {authMode === "bankid" && "Fast and secure digital ID verification"}
            {authMode === "email" && (isRegister ? "Sign up using email and password" : "Sign in using email and password")}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {authMode === "options" && (
          <div className="space-y-4 pt-2">
            <button onClick={() => setAuthMode("bankid")}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-card border border-[#44210c] hover:border-brand-accent hover:bg-brand-card-high text-white font-bold transition-all flex items-center justify-center gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-accent" />
              Sign in with BankID
            </button>
            <button onClick={handleGoogleLogin} disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-brand-card hover:bg-brand-card-high text-white font-bold transition-all flex items-center justify-center gap-3 border border-[#44210c]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              Sign in with Google
            </button>
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#44210c]" />
              </div>
              <span className="relative bg-brand-surface px-3 text-xs text-gray-500 uppercase tracking-widest">or fallback</span>
            </div>
            <button onClick={() => { setAuthMode("email"); setIsRegister(false); }}
              className="w-full py-3 px-4 rounded-xl bg-brand-card border border-[#44210c] hover:bg-brand-card-high text-gray-300 text-sm font-semibold transition-all flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Continue with Email
            </button>
          </div>
        )}

        {authMode === "bankid" && (
          <div className="space-y-6">
            {bankIdStep === "input" && (
              <form onSubmit={handleBankIdInitiate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Personal Identity Number (Personnummer)</label>
                  <input type="text" required placeholder="YYYYMMDDXXXX" maxLength={12}
                    value={personnummer} onChange={(e) => setPersonnummer(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-xl bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-white placeholder-gray-400" />
                  <p className="text-[10px] text-gray-500">Format: 12 digits without hyphen.</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-brand-accent text-[#210c00] font-bold transition-all hover:brightness-110 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify and Open BankID <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
            {bankIdStep === "qr" && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                <div className="p-4 bg-brand-card rounded-2xl border border-[#44210c]">
                  <div className="w-48 h-48 bg-brand-card rounded-lg flex items-center justify-center p-3 border-4 border-[#44210c]">
                    <div className="grid grid-cols-4 gap-2 w-full h-full opacity-80">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`rounded ${(i * 3 + 1) % 5 === 0 ? "bg-brand-accent" : "bg-white"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Open BankID app on your mobile device</p>
                  <p className="text-xs text-brand-accent animate-pulse flex items-center justify-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Simulating authorization (closing in {countdown}s...)
                  </p>
                </div>
              </div>
            )}
            {bankIdStep === "success" && (
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white">Successfully Verified!</h4>
                <p className="text-xs text-gray-400">Logging you in securely...</p>
              </div>
            )}
            <button onClick={() => { setAuthMode("options"); setBankIdStep("input"); }}
              className="w-full text-center text-xs text-gray-500 hover:text-brand-accent transition-colors pt-2">
              Cancel and Go Back
            </button>
          </div>
        )}

        {authMode === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-white placeholder-gray-400" />
                </div>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-white placeholder-gray-400" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-white placeholder-gray-400" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-brand-accent text-[#210c00] font-bold transition-all hover:brightness-110 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister ? "Create Account" : "Sign In")}
            </button>
            <div className="text-center pt-2">
              <button type="button" onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-brand-accent hover:text-brand-accent/80 transition-colors">
                {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
            <button type="button" onClick={() => setAuthMode("options")}
              className="w-full text-center text-xs text-gray-500 hover:text-brand-accent transition-colors pt-2">
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
