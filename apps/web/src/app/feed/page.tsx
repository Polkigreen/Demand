"use client";

import { useState, useEffect } from "react";
import { MapPin, Users, Clock, FolderOpen, Award, Sparkles, Plus } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { fetchRequests, RequestItem } from "@/lib/requests";
import { applyToRequest } from "@/lib/applications";

const FILTERS = [
  { id: "all", label: "All Statuses" },
  { id: "urgent", label: "Urgent Only" },
  { id: "high", label: "High Paying" },
  { id: "recurring", label: "Recurring" },
] as const;

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<"nearby" | "my">("nearby");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [tasks, setTasks] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyModal, setApplyModal] = useState<{ requestId: string; title: string } | null>(null);
  const [priceProposal, setPriceProposal] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applyMsg, setApplyMsg] = useState("");

  useEffect(() => {
    fetchRequests()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "urgent") return false;
    if (activeFilter === "high") return task.price >= 300;
    if (activeFilter === "recurring") return task.category === "Pet Care";
    return true;
  });

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
    <div className="space-y-8 pb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-display">
            Demand Feed
          </h2>
          <p className="text-sm text-gray-400">
            Manage your requests or find active tasks around Stockholm today.
          </p>
        </div>
        <div className="bg-brand-surface p-1.5 rounded-full flex self-start border border-[#44210c] shadow-inner">
          <button onClick={() => setActiveTab("my")}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === "my" ? "bg-brand-accent text-[#210c00] shadow-md" : "text-gray-300 hover:text-white"
            }`}>
            My Requests
          </button>
          <button onClick={() => setActiveTab("nearby")}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === "nearby" ? "bg-brand-accent text-[#210c00] shadow-md" : "text-gray-300 hover:text-white"
            }`}>
            Nearby Tasks
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 border-b border-[#44210c]/40">
        {FILTERS.map((chip) => (
          <button key={chip.id} onClick={() => setActiveFilter(chip.id)}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border ${
              activeFilter === chip.id
                ? "bg-brand-accent text-[#210c00] border-brand-accent shadow-md"
                : "bg-brand-card hover:bg-[#44210d] text-gray-300 border-[#44210c]"
            }`}>
            {chip.label}
          </button>
        ))}
      </div>

      {activeTab === "nearby" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-brand-surface rounded-2xl p-5 border border-[#44210c] animate-pulse space-y-4">
                <div className="h-4 bg-brand-card rounded w-1/4" />
                <div className="h-6 bg-brand-card rounded w-3/4" />
                <div className="h-10 bg-brand-card rounded" />
              </div>
            ))
          ) : filteredTasks.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-brand-surface rounded-2xl border border-dashed border-[#44210c] text-gray-400">
              <FolderOpen className="h-10 w-10 mx-auto text-brand-accent mb-3" />
              <p className="font-extrabold text-sm">No tasks matching filters found</p>
              <button onClick={() => setActiveFilter("all")} className="mt-2 text-xs text-brand-accent underline font-bold">
                Reset filters
              </button>
            </div>
          ) : (
            filteredTasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link href={`/request?id=${task.id}`} className="block bg-brand-surface rounded-2xl p-5 border border-[#44210c] glowing-shadow hover:-translate-y-1 hover:border-brand-accent/40 flex flex-col sm:flex-row gap-5 transition-all group">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-brand-card border border-[#44210c] shadow-md">
                    <div className="w-full h-full bg-brand-card flex items-center justify-center text-gray-500 text-xs">
                      {task.category?.[0] || "?"}
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-extrabold text-base text-white group-hover:text-brand-accent transition-colors line-clamp-1">
                          {task.title}
                        </h3>
                        <span className="text-brand-accent font-extrabold text-base whitespace-nowrap">
                          {task.price} kr
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed font-body line-clamp-2">
                        {task.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-400 text-xs pt-1">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-brand-accent" /> {task.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 sm:mt-0 pt-2 border-t border-[#44210c]/20">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                        <span className="text-xs font-bold text-brand-accent">Open</span>
                      </div>
                      <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setApplyModal({ requestId: task.id, title: task.title }); }}
                        className="bg-brand-accent text-brand-bg px-4 py-1.5 rounded-xl font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-accent/10 cursor-pointer">
                        Apply
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        <div className="py-16 text-center bg-brand-surface rounded-2xl border border-dashed border-[#44210c] text-gray-400">
          <FolderOpen className="h-10 w-10 mx-auto text-brand-accent mb-3" />
          <p className="font-extrabold text-sm">Your posted requests will appear here</p>
          <Link href="/post" className="mt-2 inline-block text-xs text-brand-accent underline font-bold">
            Post your first request
          </Link>
        </div>
      )}

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="md:col-span-2 bg-gradient-to-br from-brand-card to-brand-surface border border-[#44210c] p-6 sm:p-8 rounded-3xl flex flex-col justify-center relative overflow-hidden glowing-shadow">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,145,0,0.06),transparent_50%)] pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full text-yellow-400 text-xs font-extrabold">
              <Award className="h-4 w-4" /> ACTIVE PERK
            </div>
            <h4 className="text-xl font-extrabold text-white">Become a Top Helper</h4>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              Users with 5-star ratings get notified 15 minutes earlier than everyone else. Complete more tasks to level up and gain premium task slots!
            </p>
            <Link href="/profile" className="text-brand-accent font-extrabold text-sm hover:underline inline-flex items-center gap-1.5 pt-1">
              <span>Learn about levels</span>
              <Sparkles className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="bg-[#44210d] p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden border border-[#522b10] flex flex-col justify-center">
          <Award className="absolute -right-6 -bottom-6 text-white h-28 w-28 opacity-10 rotate-12" />
          <h4 className="text-lg font-extrabold text-brand-accent mb-2">Safety first</h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-body">
            Every neighbor is thoroughly verified through Swedish BankID integrations for your complete peace of mind.
          </p>
        </div>
      </section>

      <Link href="/post" className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 glowing-active border border-yellow-500 lg:hidden">
        <Plus className="h-7 w-7" strokeWidth={3} />
      </Link>

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
    </div>
  );
}
