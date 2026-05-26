"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { ShieldCheck, User, Scale, ArrowRight, DollarSign, Award } from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [roles, setRoles] = useState(user?.roles || ["REQUESTER"]);
  const [saved, setSaved] = useState(false);

  // Swedish hobbyverksamhet mock metrics
  const yearlyEarnings = 8400; // SEK
  const taxLimit = 24300; // SEK limit for simple declare or tax free depending on year and hobby parameters
  const percentUsed = Math.min((yearlyEarnings / taxLimit) * 100, 100);

  const toggleRole = (role: "REQUESTER" | "HELPER") => {
    let newRoles = [...roles];
    if (newRoles.includes(role)) {
      if (newRoles.length > 1) {
        newRoles = newRoles.filter((r) => r !== role);
      }
    } else {
      newRoles.push(role);
    }
    setRoles(newRoles);
  };

  const handleSave = () => {
    updateUser({ roles });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left panel - Info & Roles */}
      <div className="md:col-span-1 space-y-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-teal-500 mx-auto flex items-center justify-center font-bold text-teal-400 text-2xl">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center justify-center gap-1">
              {user?.name}
              {user?.bankidVerified && (
                <ShieldCheck className="w-5 h-5 text-teal-400 fill-teal-400/10" title="BankID Verified" />
              )}
            </h3>
            <p className="text-xs text-slate-400">{user?.email || "No email linked"}</p>
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            {user?.bankidVerified ? "BankID Verified Person" : "Unverified"}
          </div>
        </div>

        {/* Swedish Compliance Summary */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold flex items-center gap-2 text-slate-350">
            <Scale className="w-4 h-4 text-orange-400" />
            Hobbyverksamhet Tracker
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Earnings (Tax Year 2026)</span>
              <span>{yearlyEarnings} / {taxLimit} SEK</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-teal-500 h-2 rounded-full"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-450 leading-relaxed">
              If your total earnings exceed {taxLimit} SEK, you must file tax records. We track this for you to facilitate Skatteverket reporting.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel - Settings & Roles */}
      <div className="md:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl p-8 border border-slate-800 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold">Account Settings</h2>
            <p className="text-xs text-slate-400">Configure your platform roles and account properties.</p>
          </div>

          {/* Roles Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
              Profile Type / Roles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => toggleRole("REQUESTER")}
                className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                  roles.includes("REQUESTER")
                    ? "border-teal-500 bg-teal-500/5"
                    : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                }`}
              >
                <div className="text-sm font-bold">Requester</div>
                <div className="text-[11px] text-slate-400">I need to post task requests and hire helpers.</div>
              </button>

              <button
                onClick={() => toggleRole("HELPER")}
                className={`p-4 rounded-xl border text-left transition-all space-y-1 ${
                  roles.includes("HELPER")
                    ? "border-teal-500 bg-teal-500/5"
                    : "border-slate-800 bg-slate-950 hover:bg-slate-900"
                }`}
              >
                <div className="text-sm font-bold">Helper</div>
                <div className="text-[11px] text-slate-400">I want to apply for tasks and earn money.</div>
              </button>
            </div>
          </div>

          {/* Security Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Security & Identity</h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-900 flex justify-between items-center">
              <div>
                <div className="text-sm font-bold flex items-center gap-1.5">
                  Identity (Swedish Personnummer)
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Verified via BankID. Encrypted at rest.</div>
              </div>
              <span className="text-xs font-mono bg-slate-900 px-3 py-1 rounded border border-slate-800 text-slate-400">
                ****-***1234
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-900">
            {saved ? (
              <span className="text-xs font-bold text-teal-400">Settings saved successfully!</span>
            ) : (
              <span />
            )}
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-bold transition-all shadow-md shadow-teal-500/10"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
