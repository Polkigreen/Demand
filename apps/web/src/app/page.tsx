"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Car, PartyPopper, Wrench, Dog, ArrowRight, ShieldCheck, CreditCard, HeartHandshake, MessageSquare, Clock, Hammer, Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { fetchRequests, RequestItem } from "@/lib/requests";
import { applyToRequest } from "@/lib/applications";

const CATEGORIES = [
  { name: "Car Help", icon: Car, color: "bg-[#2e1500] text-brand-accent", sub: "Tires, batteries & oil" },
  { name: "Event Prep", icon: PartyPopper, color: "bg-[#251b2d] text-purple-400", sub: "Parties & holidays" },
  { name: "Assembly", icon: Wrench, color: "bg-[#182a1b] text-emerald-400", sub: "IKEA wardrobes & beds" },
  { name: "Pet Care", icon: Dog, color: "bg-[#18252a] text-cyan-400", sub: "Dog walks & sitting" },
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [recentTasks, setRecentTasks] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState<{ requestId: string; title: string } | null>(null);
  const [priceProposal, setPriceProposal] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");

  useEffect(() => {
    fetchRequests()
      .then(setRecentTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    if (!applyModal) return;
    setSubmitting(true);
    setApplyMsg("");
    try {
      await applyToRequest(applyModal.requestId, {
        priceProposal: priceProposal ? Number(priceProposal) : undefined,
        coverLetter: coverLetter || undefined,
      });
      setApplyMsg("Application sent successfully!");
      setTimeout(() => { setApplyModal(null); setPriceProposal(""); setCoverLetter(""); }, 1500);
    } catch (err: unknown) {
      setApplyMsg(err instanceof Error ? err.message : "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 pb-4">
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between bg-brand-surface/85 backdrop-blur-xl px-4 lg:hidden border-b border-[#44210c]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-brand-accent-faded rounded-lg">
            <Hammer className="h-5 w-5 text-brand-accent" />
          </div>
          <span className="font-extrabold text-white text-base">Demand</span>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-card to-brand-bg border border-[#44210c] p-6 sm:p-10 glowing-shadow"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,145,0,0.12),transparent_45%)] pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-brand-accent-faded text-brand-accent rounded-full text-xs font-bold uppercase tracking-widest">
              Stockholm Community
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] uppercase font-display">
              YOUR CITY,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-400">YOUR HELPERS</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-md leading-relaxed font-body">
              Connect with trusted neighbors for everyday tasks. Fast, safe, and right around the corner. Fully backed by local insurance coverage.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link
                href="/post"
                className="bg-brand-accent text-[#210c00] px-8 py-3.5 rounded-full font-extrabold text-sm shadow-xl glowing-active hover:brightness-110 active:scale-[0.98] transition-all hover:pr-10 relative group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                href="/feed"
                className="bg-brand-card text-white hover:bg-[#44210c] border border-gray-700 px-6 py-3.5 rounded-full font-bold text-sm transition-all"
              >
                Browse Gigs
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm md:max-w-none">
            <div className="w-full h-auto rounded-3xl border border-[#44210c] bg-brand-card/60 p-8 text-center transform md:scale-105">
              <Hammer className="h-20 w-20 text-brand-accent/40 mx-auto" />
              <p className="text-gray-500 text-sm mt-4">Neighborhood Marketplace</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="relative group">
        <Link href="/feed">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[#ae9b8e]">
            <Search className="h-6 w-6" />
          </div>
          <div className="w-full h-16 pl-14 pr-6 rounded-2xl bg-brand-card hover:bg-brand-card-high border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 shadow-xl transition-all cursor-pointer font-medium text-base flex items-center">
            <span className="text-gray-400">What do you need help with today?</span>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-accent-faded text-brand-accent rounded-lg text-xs font-bold">
            Search
          </div>
        </Link>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Categories
            </h2>
            <p className="text-xs text-gray-400">Discover vetted local providers nearby</p>
          </div>
          <Link href="/feed" className="text-brand-accent font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:underline">
            <span>View all feed</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/category?name=${encodeURIComponent(cat.name)}`}
                className="bg-brand-surface border border-[#44210c] p-5 sm:p-6 rounded-2xl glowing-shadow hover:translate-y-[-4px] hover:border-brand-accent/40 hover:bg-brand-card transition-all cursor-pointer group text-center flex flex-col justify-between h-40 sm:h-44"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110 shadow-lg`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <span className="block font-extrabold text-sm text-white group-hover:text-brand-accent transition-colors">{cat.name}</span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">{cat.sub}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Recently Posted Help Requests
            </h2>
            <p className="text-xs text-gray-400">Neighbors looking for support right now</p>
          </div>
          <Link href="/feed" className="text-brand-accent font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:underline">
            <span>Explore feed</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(loading ? Array.from<any>({ length: 3 }) : recentTasks.slice(0, 3)).map((task, i) => (
            <div
              key={i}
              className="bg-brand-surface rounded-2xl border border-[#44210c] p-5 glowing-shadow hover:translate-y-[-4px] hover:border-brand-accent/40 transition-all cursor-pointer flex flex-col justify-between h-[230px] group"
            >
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-brand-card rounded w-1/3" />
                  <div className="h-6 bg-brand-card rounded w-2/3" />
                  <div className="h-12 bg-brand-card rounded" />
                  <div className="h-6 bg-brand-card rounded w-1/2" />
                </div>
              ) : task ? (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="bg-brand-accent-faded text-brand-accent px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase">
                        {task.category}
                      </span>
                      <span className="text-brand-accent font-extrabold text-lg">{task.price} kr</span>
                    </div>
                    <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-brand-accent transition-colors mb-1.5">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-body line-clamp-3">{task.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#44210c]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-card border border-brand-accent/40 flex items-center justify-center font-bold text-xs text-brand-accent">
                        {task.requester?.name?.[0] || "?"}
                      </div>
                      <div className="leading-tight">
                        <p className="text-xs font-bold text-white">{task.requester?.name}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <MapPin className="h-2.5 w-2.5 text-brand-accent" /> {task.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-brand-accent" /> New
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-card/65 rounded-3xl p-8 border border-[#44210c] glowing-shadow relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,145,0,0.06),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-display uppercase">
            Safe & Trusted Neighbor Marketplace
          </h2>
          <p className="text-xs sm:text-sm text-gray-300">
            Every transaction is protected, each member verified, and help is nearby.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
          <div className="p-4 space-y-3">
            <div className="w-12 h-12 bg-brand-accent-faded rounded-2xl flex items-center justify-center mx-auto text-brand-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white">BankID Verified Users</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              All helpers undergo strict automated verification for your complete peace of mind.
            </p>
          </div>
          <div className="p-4 space-y-3">
            <div className="w-12 h-12 bg-teal-400/10 rounded-2xl flex items-center justify-center mx-auto text-teal-400">
              <CreditCard className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white">Escrow Secured Payments</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Funds are held safely in escrow and only released once you certify that you are 100% satisfied.
            </p>
          </div>
          <div className="p-4 space-y-3">
            <div className="w-12 h-12 bg-brand-accent-faded rounded-2xl flex items-center justify-center mx-auto text-brand-accent">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h4 className="font-extrabold text-sm text-white">Community First Ethics</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Built by neighbors, for neighbors to foster an organic, helpful culture around the city.
            </p>
          </div>
        </div>
      </section>

      {applyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#44210c]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Apply for Task</h3>
              <button onClick={() => { setApplyModal(null); setApplyMsg(""); }} className="p-1 rounded-lg hover:bg-brand-card text-gray-400">
                <Plus className="h-5 w-5 rotate-45" />
              </button>
            </div>
            <p className="text-sm text-gray-400">Applying for: <span className="font-semibold text-white">{applyModal.title}</span></p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Price Proposal (SEK, optional)</label>
                <input type="number" value={priceProposal} onChange={(e) => setPriceProposal(e.target.value)} placeholder="e.g. 500"
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-sm text-white placeholder-gray-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Cover Letter (optional)</label>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Tell the requester why you are a good fit..."
                  rows={3} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-sm text-white placeholder-gray-400 resize-none" />
              </div>
            </div>
            {applyMsg && (
              <p className={`text-sm font-medium ${applyMsg.includes("success") ? "text-emerald-400" : "text-red-400"}`}>{applyMsg}</p>
            )}
            <button onClick={handleApply} disabled={submitting}
              className="w-full py-2.5 rounded-lg bg-brand-accent text-[#210c00] font-bold transition-all hover:brightness-110 disabled:opacity-50">
              {submitting ? "Sending..." : "Send Application"}
            </button>
          </div>
        </div>
      )}

      <Link href="/post" className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 glowing-active border border-yellow-500 lg:hidden">
        <Plus className="h-7 w-7" strokeWidth={3} />
      </Link>
    </div>
  );
}
