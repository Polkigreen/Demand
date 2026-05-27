import { useState } from "react";
import { AppView, HelperProfile, DashboardSchedule } from "../types";
import { 
  Star, 
  MapPin, 
  Clock, 
  Coins, 
  MessageSquare, 
  BadgeCheck, 
  ShieldCheck, 
  Check, 
  AlertCircle,
  TrendingUp,
  Sparkles,
  CalendarDays,
  Hammer
} from "lucide-react";
import { motion } from "motion/react";

interface ProfileViewProps {
  setView: (view: AppView) => void;
  helper: HelperProfile;
  schedule: DashboardSchedule[];
  onToggleScheduleSlot: (dayIndex: number, slotKey: "morning" | "afternoon" | "evening") => void;
  onInitiateChat: () => void;
}

export default function ProfileView({ 
  setView, 
  helper, 
  schedule, 
  onToggleScheduleSlot,
  onInitiateChat
}: ProfileViewProps) {
  const [profileTab, setProfileTab] = useState<"public" | "dashboard">("public");

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#44210c] pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-display">
            {profileTab === "public" ? "Helper Public Profile" : "Nordic Pulse Helper Dashboard"}
          </h1>
          <p className="text-xs text-gray-400">
            {profileTab === "public" ? "As seen by neighbors looking on the workspace" : "Manage availability settings and earn statistics"}
          </p>
        </div>

        <div className="bg-brand-surface p-1 rounded-2xl flex border border-[#44210c]">
          <button 
            type="button"
            onClick={() => setProfileTab("public")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              profileTab === "public" 
                ? "bg-brand-accent text-[#210c00]" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Anders S. Profile
          </button>
          <button 
            type="button"
            onClick={() => setProfileTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              profileTab === "dashboard" 
                ? "bg-brand-accent text-[#210c00]" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Dashboard
          </button>
        </div>
      </div>

      {profileTab === "public" ? (
        /* SCREEN 4: Anders S. Public Profile */
        <div className="space-y-8" id="helper-public-profile">
          {/* Main card */}
          <div className="bg-brand-surface border border-[#44210c] p-6 sm:p-8 rounded-3xl glowing-shadow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,145,0,0.06),transparent_50%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row gap-8 relative z-10 items-start md:items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-brand-accent/40 bg-brand-card flex-shrink-0 mx-auto md:mx-0">
                <img 
                  src={helper.avatar} 
                  alt={helper.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-2 bg-emerald-500 rounded-full h-4.5 w-4.5 border-2 border-brand-surface"></div>
              </div>

              <div className="flex-1 space-y-3.5 text-center md:text-left width-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{helper.name}</h2>
                      {helper.verified && (
                        <BadgeCheck className="h-6 w-6 text-brand-accent" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5 justify-center md:justify-start">
                      <MapPin className="h-3.5 w-3.5 text-brand-accent" /> Stockholm Södermalm • {helper.distance}
                    </p>
                  </div>
                  
                  <div className="bg-brand-accent-faded border border-brand-accent/20 px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 self-center shrink-0">
                    <span className="font-extrabold text-lg text-brand-accent">{helper.rateHour} kr</span>
                    <span className="text-xs text-gray-400">/ hour</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300 justify-center md:justify-start">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Star className="h-4.5 w-4.5 fill-brand-accent text-brand-accent" /> {helper.rating} ({helper.reviewsCount} reviews)
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Clock className="h-4.5 w-4.5 text-brand-accent" /> Resp. rate: {helper.responseRate}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MessageSquare className="h-4.5 w-4.5 text-brand-accent" /> Resp. time: {helper.typicalResponseTime}
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  {helper.skills.map(skill => (
                    <span key={skill} className="bg-brand-card border border-[#44210c] text-white px-3 py-1 rounded-lg text-xs font-bold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action trigger bar */}
            <div className="mt-8 pt-6 border-t border-[#44210c]/40 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
              <p className="text-xs text-gray-400 max-w-sm text-center sm:text-left leading-relaxed">
                By hiring {helper.name}, you are backed by our 15,000 kr Stockholm protection policy.
              </p>
              <button 
                onClick={onInitiateChat}
                className="w-full sm:w-auto bg-brand-accent text-[#1e0d02] border border-yellow-500 font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-xl glowing-active hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4.5 w-4.5 text-brand-bg" /> Engage and Discuss Gigs
              </button>
            </div>
          </div>

          {/* Handyman Description & Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-brand-surface border border-[#44210c] p-6 rounded-3xl space-y-4">
              <h3 className="font-extrabold text-base text-white uppercase tracking-wider">About Me</h3>
              <p className="text-sm text-gray-300 font-body leading-relaxed">{helper.bio}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-brand-card/50 rounded-xl border border-[#44210c]/40 flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-white uppercase">Fully Insured</h5>
                    <p className="text-[10px] text-gray-400">Claims insured up to 15K kr</p>
                  </div>
                </div>
                <div className="p-3 bg-brand-card/50 rounded-xl border border-[#44210c]/40 flex items-start gap-2.5">
                  <Hammer className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold text-xs text-white uppercase">Has own tools</h5>
                    <p className="text-[10px] text-gray-400">Brings advanced drills &amp; levelers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-surface border border-[#44210c] p-6 rounded-3xl flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-extrabold text-base text-white uppercase tracking-wider">Verified Badges</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-400/10 text-emerald-400 rounded-xl">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs sm:text-sm text-white">BankID Connect</span>
                      <span className="block text-[10px] text-gray-400">Government ID Verified</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-400/10 text-emerald-400 rounded-xl">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs sm:text-sm text-white">Criminal Records clean</span>
                      <span className="block text-[10px] text-gray-400">Background Checked</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-400/10 text-emerald-400 rounded-xl">
                      <Check className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-xs sm:text-sm text-white">Fast Responder</span>
                      <span className="block text-[10px] text-gray-400">Replies inside 1 hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento grid of past examples (Public Profile Examples as depicted in Screen 4) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wide font-display">
                Past Work &amp; Project Logs
              </h3>
              <p className="text-xs text-gray-400">Browse real verified tasks completed by {helper.name} before hiring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {helper.examples.map((ex, i) => (
                <div 
                  key={i}
                  className="bg-brand-surface rounded-2xl overflow-hidden border border-[#44210c] relative h-60 hover:border-brand-accent/40 shadow-md group cursor-pointer"
                >
                  <img 
                    src={ex.imageUrl} 
                    alt={ex.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e0d02] via-[#1e0d02]/30 to-transparent flex items-end p-4.5" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 leading-tight">
                    <span className="text-[10px] bg-brand-accent-faded border border-brand-accent/20 text-brand-accent font-extrabold px-2 py-0.5 rounded uppercase">
                      verified gig
                    </span>
                    <p className="text-white text-xs sm:text-sm font-extrabold mt-1.5">{ex.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* SCREEN 7: Nordic Pulse Helper Dashboard (Alex Jensen) */
        <div className="space-y-6" id="helper-availability-dashboard">
          {/* Top Overview Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Weekly earnings</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-accent">3,450 kr</p>
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
                <TrendingUp className="h-3 w-3" /> +12% from last week
              </div>
            </div>

            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Tasks</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">95</p>
              <div className="text-[10px] text-gray-400 font-semibold">
                Level 3 Gold Helper
              </div>
            </div>

            <div className="bg-brand-surface p-5 rounded-2xl border border-[#44210c] glowing-shadow space-y-1.5">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Acceptance Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">98%</p>
              <div className="text-[10px] text-gray-400 font-semibold">
                Excellent response velocity
              </div>
            </div>
          </div>

          {/* Dynamic Schedule selection chart layout */}
          <div className="bg-brand-surface border border-[#44210c] rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#44210c] pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-accent-faded text-brand-accent rounded-xl">
                  <CalendarDays className="h-5.5 w-5.5 text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white uppercase tracking-wider">Weekly slots</h3>
                  <p className="text-xs text-gray-400">Check or uncheck your weekly windows to sync with potential clients nearby.</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Schedule slots published and active!")}
                className="bg-brand-accent text-[#210c00] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-accent/10 border border-yellow-500"
              >
                Publish Changes
              </button>
            </div>

            {/* Availability Chart Grid structure */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#44210c]">
                    <th className="py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Day of Week</th>
                    <th className="py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Morning (08:00 - 12:00)</th>
                    <th className="py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Afternoon (12:00 - 17:00)</th>
                    <th className="py-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">Evening (17:00 - 21:00)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#44210c]/30">
                  {schedule.map((dayItem, index) => (
                    <tr key={dayItem.day} className="hover:bg-brand-card/25 transition-colors">
                      <td className="py-4 font-extrabold text-white text-sm">
                        {dayItem.day}
                      </td>
                      
                      {/* Morning Toggle */}
                      <td className="py-4 text-center">
                        <input 
                          type="checkbox"
                          checked={dayItem.slots.morning}
                          onChange={() => onToggleScheduleSlot(index, "morning")}
                          className="h-5 w-5 rounded border-[#44210c] bg-brand-card checked:bg-brand-accent text-brand-accent focus:ring-transparent focus:ring-offset-transparent cursor-pointer"
                        />
                      </td>

                      {/* Afternoon Toggle */}
                      <td className="py-4 text-center">
                        <input 
                          type="checkbox"
                          checked={dayItem.slots.afternoon}
                          onChange={() => onToggleScheduleSlot(index, "afternoon")}
                          className="h-5 w-5 rounded border-[#44210c] bg-brand-card checked:bg-brand-accent text-brand-accent focus:ring-transparent focus:ring-offset-transparent cursor-pointer"
                        />
                      </td>

                      {/* Evening Toggle */}
                      <td className="py-4 text-center">
                        <input 
                          type="checkbox"
                          checked={dayItem.slots.evening}
                          onChange={() => onToggleScheduleSlot(index, "evening")}
                          className="h-5 w-5 rounded border-[#44210c] bg-brand-card checked:bg-brand-accent text-brand-accent focus:ring-transparent focus:ring-offset-transparent cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Google sync indicator banner */}
            <div className="p-4 bg-[#ff9100]/5 border border-[#ff9100]/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
              <div>
                <h5 className="font-extrabold text-xs sm:text-sm text-white mb-0.5">Google Calendar Sync active</h5>
                <p className="text-[11px] text-gray-300">
                  Any conflicts created on your Google Calendar will automatically block these helper slots from being listed.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
