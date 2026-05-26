"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";

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
  
  // BankID State
  const [bankIdStep, setBankIdStep] = useState<"input" | "qr" | "success">("input");
  const [countdown, setCountdown] = useState(3);

  const handleGoogleLogin = () => {
    setLoading(true);
    // Simulated Google OAuth login
    setTimeout(() => {
      setAuth(
        {
          id: "g1",
          name: "Saga Lindgren",
          email: "saga.lindgren@gmail.com",
          roles: ["REQUESTER"],
          bankidVerified: false,
        },
        "mock-google-access-token",
        "mock-google-refresh-token"
      );
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  const handleBankIdInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to POST /auth/bankid/initiate
    setTimeout(() => {
      setLoading(false);
      setBankIdStep("qr");
      
      // Simulate polling POST /auth/bankid/collect
      let count = 3;
      const interval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          setBankIdStep("success");
          setTimeout(() => {
            setAuth(
              {
                id: "b1",
                name: "Karl Eriksson",
                personnummer: personnummer || "198811124567",
                roles: ["REQUESTER", "HELPER"],
                bankidVerified: true,
              },
              "mock-bankid-access-token",
              "mock-bankid-refresh-token"
            );
            router.push("/");
          }, 1000);
        }
      }, 1000);
    }, 1500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setAuth(
        {
          id: "e1",
          name: isRegister ? fullName : "Johan Andersson",
          email,
          roles: ["REQUESTER"],
          bankidVerified: false,
        },
        "mock-email-access-token",
        "mock-email-refresh-token"
      );
      setLoading(false);
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">
            {authMode === "options" && "Welcome to Demand"}
            {authMode === "bankid" && "BankID Verification"}
            {authMode === "email" && (isRegister ? "Create Account" : "Welcome Back")}
          </h2>
          <p className="text-slate-400 text-sm">
            {authMode === "options" && "Select an authentication method to continue"}
            {authMode === "bankid" && "Fast and secure digital ID verification"}
            {authMode === "email" && (isRegister ? "Sign up using email and password" : "Sign in using email and password")}
          </p>
        </div>

        {/* Options Screen */}
        {authMode === "options" && (
          <div className="space-y-4 pt-2">
            <button
              onClick={() => setAuthMode("bankid")}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 border border-slate-850 hover:border-teal-500 hover:bg-slate-950 text-white font-bold transition-all flex items-center justify-center gap-3"
            >
              <ShieldCheck className="w-5 h-5 text-teal-400 fill-teal-400/10" />
              Sign in with BankID
            </button>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold transition-all flex items-center justify-center gap-3 shadow-md shadow-white/5"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24">
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
                <div className="w-full border-t border-slate-900" />
              </div>
              <span className="relative bg-slate-950 px-3 text-xs text-slate-500 uppercase tracking-widest">
                or fallback
              </span>
            </div>

            <button
              onClick={() => {
                setAuthMode("email");
                setIsRegister(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-slate-900 hover:bg-slate-900 text-slate-350 text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Continue with Email
            </button>
          </div>
        )}

        {/* BankID Screen */}
        {authMode === "bankid" && (
          <div className="space-y-6">
            {bankIdStep === "input" && (
              <form onSubmit={handleBankIdInitiate} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Personal Identity Number (Personnummer)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="YYYYMMDDXXXX"
                    maxLength={12}
                    value={personnummer}
                    onChange={(e) => setPersonnummer(e.target.value.replace(/\D/g, ""))}
                    className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-650"
                  />
                  <p className="text-[10px] text-slate-500">
                    Format: 12 digits without hyphen. We verify using official BankID testing guidelines.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Verify and Open BankID
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {bankIdStep === "qr" && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                <div className="relative p-4 bg-white rounded-2xl border border-slate-200 shadow-md">
                  {/* Mock QR Code representation */}
                  <div className="w-48 h-48 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold p-3 border-4 border-slate-900">
                    <div className="grid grid-cols-4 gap-2 w-full h-full opacity-80">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded ${
                            (i * 3 + 1) % 5 === 0 ? "bg-teal-400" : "bg-slate-950"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] rounded-2xl flex items-center justify-center" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Open BankID app on your mobile device</p>
                  <p className="text-xs text-teal-400 animate-pulse flex items-center justify-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Simulating authorization (closing in {countdown}s...)
                  </p>
                </div>
              </div>
            )}

            {bankIdStep === "success" && (
              <div className="flex flex-col items-center justify-center text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-teal-400" />
                </div>
                <h4 className="text-lg font-bold">Successfully Verified!</h4>
                <p className="text-xs text-slate-400">Logging you in securely...</p>
              </div>
            )}

            <button
              onClick={() => {
                setAuthMode("options");
                setBankIdStep("input");
              }}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2"
            >
              Cancel and Go Back
            </button>
          </div>
        )}

        {/* Email Screen */}
        {authMode === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isRegister ? "Create Account" : "Sign In"
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
              >
                {isRegister ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAuthMode("options")}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2"
            >
              Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
