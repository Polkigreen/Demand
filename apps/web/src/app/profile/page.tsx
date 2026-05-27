"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Star, MapPin, Clock, MessageSquare, BadgeCheck, ShieldCheck, Check, AlertCircle, TrendingUp, CalendarDays, Scale, Loader2 } from "lucide-react";
import { fetchProfile, updateProfile } from "@/lib/users";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [profileTab, setProfileTab] = useState<"public" | "dashboard">("public");
  const [roles, setRoles] = useState<string[]>(user?.roles || ["REQUESTER"]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then((p) => { setProfile(p); setRoles(p.roles || ["REQUESTER"]); updateUser(p); })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const toggleRole = (role: string) => {
    let newRoles = [...roles];
    if (newRoles.includes(role)) {
      if (newRoles.length > 1) newRoles = newRoles.filter((r) => r !== role);
    } else {
      newRoles.push(role);
    }
    setRoles(newRoles);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({ name: user?.name });
      updateUser({ roles });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {} finally { setLoading(false); }
  };

  const displayName = profile?.name || user?.name || "User";
  const displayEmail = profile?.email || user?.email || "";
  const isVerified = profile?.bankidVerified || user?.bankidVerified;

  if (profileLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent animate-spin rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#44210c] pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-display">
            {profileTab === "public" ? "Public Profile" : "Dashboard"}
          </h1>
          <p className="text-xs text-gray-400">
            {profileTab === "public" ? "As seen by neighbors looking on the workspace" : "Manage settings and view stats"}
          </p>
        </div>
        <div className="bg-brand-surface p-1 rounded-2xl flex border border-[#44210c]">
          <button type="button" onClick={() => setProfileTab("public")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              profileTab === "public" ? "bg-brand-accent text-[#210c00]" : "text-gray-300 hover:text-white"
            }`}>
            Profile
          </button>
          <button type="button" onClick={() => setProfileTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              profileTab === "dashboard" ? "bg-brand-accent text-[#210c00]" : "text-gray-300 hover:text-white"
            }`}>
            Dashboard
          </button>
        </div>
      </div>

      {profileTab === "public" ? (
        <div className="space-y-8">
          <div className="bg-brand-surface border border-[#44210c] p-6 sm:p-8 rounded-3xl glowing-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,145,0,0.06),transparent_50%)] pointer-events-none" />
            <div className="flex flex-col md:flex-row gap-8 relative z-10 items-start md:items-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-brand-accent/20 border-4 border-brand-accent/40 flex items-center justify-center font-bold text-4xl text-brand-accent mx-auto md:mx-0">
                {displayName[0]}
              </div>
              <div className="flex-1 space-y-3.5 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{displayName}</h2>
                      {isVerified && <BadgeCheck className="h-6 w-6 text-brand-accent" />}
                    </div>
                    {displayEmail && <p className="text-xs text-gray-400 mt-1">{displayEmail}</p>}
                  </div>
                  <div className="bg-brand-accent-faded border border-brand-accent/20 px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 self-center shrink-0">
                    <span className="font-extrabold text-lg text-brand-accent">{roles.includes("HELPER") ? "Helper" : "Requester"}</span>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  {roles.map((role) => (
                    <span key={role} className="bg-brand-card border border-[#44210c] text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#44210c]/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <p className="text-xs text-gray-400 max-w-sm text-center sm:text-left leading-relaxed">
                {isVerified ? "BankID Verified • Account in good standing" : "Complete your BankID verification to unlock full platform features."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-brand-surface border border-[#44210c] p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-base text-white uppercase tracking-wider">Account Settings</h3>
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Type / Roles</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => toggleRole("REQUESTER")}
                    className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                      roles.includes("REQUESTER") ? "border-brand-accent bg-brand-accent-faded" : "border-[#44210c] bg-brand-card hover:bg-brand-card-high"
                    }`}>
                    <div className="text-sm font-bold text-white">Requester</div>
                    <div className="text-[11px] text-gray-400">I need to post task requests and hire helpers.</div>
                  </button>
                  <button onClick={() => toggleRole("HELPER")}
                    className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                      roles.includes("HELPER") ? "border-brand-accent bg-brand-accent-faded" : "border-[#44210c] bg-brand-card hover:bg-brand-card-high"
                    }`}>
                    <div className="text-sm font-bold text-white">Helper</div>
                    <div className="text-[11px] text-gray-400">I want to apply for tasks and earn money.</div>
                  </button>
                </div>
              </div>

              {saved && <p className="text-xs font-bold text-emerald-400">Settings saved successfully!</p>}

              <button onClick={handleSave} disabled={loading}
                className="w-full py-2.5 rounded-lg bg-brand-accent text-[#210c00] font-bold transition-all hover:brightness-110 disabled:opacity-50">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="bg-brand-surface border border-[#44210c] p-6 rounded-3xl flex flex-col justify-between space-y-4">
              <h3 className="font-extrabold text-base text-white uppercase tracking-wider">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isVerified ? "bg-emerald-400/10 text-emerald-400" : "bg-brand-card text-gray-500"}`}>
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="block font-bold text-xs sm:text-sm text-white">BankID {isVerified ? "Verified" : "Pending"}</span>
                    <span className="block text-[10px] text-gray-400">{isVerified ? "Government ID Verified" : "Not yet verified"}</span>
                  </div>
                </div>
              </div>

              <Link href="/skatteverket" className="block p-4 bg-brand-accent-faded/20 border border-brand-accent/20 rounded-2xl flex items-start gap-3 hover:bg-brand-accent-faded/30 transition-colors">
                <Scale className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-white mb-0.5">Hobbyverksamhet</h4>
                  <p className="text-[10px] text-gray-300">
                    Earnings under 24,300 SEK/year may be tax-free. Open Skatteverket dashboard to track.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly earnings</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-accent">0 kr</p>
              <div className="text-[10px] text-gray-400 font-semibold">Start earning by completing tasks</div>
            </div>
            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Tasks</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">0</p>
              <div className="text-[10px] text-gray-400 font-semibold">Beginner Level</div>
            </div>
            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Roles Active</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{roles.length}</p>
              <div className="text-[10px] text-gray-400 font-semibold">{roles.join(", ")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
