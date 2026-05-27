import { useState } from "react";
import { TaskRequest, AppView } from "../types";
import { 
  MapPin, 
  Users, 
  Clock, 
  SlidersHorizontal,
  FolderOpen,
  Calendar,
  Sparkles,
  Award,
  Shield,
  Plus
} from "lucide-react";
import { motion } from "motion/react";

interface RequestsViewProps {
  setView: (view: AppView) => void;
  tasks: TaskRequest[];
  pastTasks: any[];
  onSelectTask: (task: TaskRequest) => void;
}

export default function RequestsView({ setView, tasks, pastTasks, onSelectTask }: RequestsViewProps) {
  const [activeTab, setActiveTab] = useState<"nearby" | "my">("nearby");
  const [activeFilter, setActiveFilter] = useState<"all" | "urgent" | "high" | "recurring">("all");

  const filterChips = [
    { id: "all", label: "All Statuses" },
    { id: "urgent", label: "Urgent Only" },
    { id: "high", label: "High Paying" },
    { id: "recurring", label: "Recurring" }
  ];

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === "urgent") return task.urgent;
    if (activeFilter === "high") return task.budget >= 300;
    if (activeFilter === "recurring") return task.category === "Pet Care"; // mockup recurring
    return true;
  });

  return (
    <div className="space-y-8 pb-4">
      {/* Header and Toggle Button Grid */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase font-display">
            Demand Feed
          </h2>
          <p className="text-sm text-gray-400">
            Manage your requests or find active tasks around Stockholm today.
          </p>
        </div>

        {/* Custom Segmented Control Pill Toggler */}
        <div className="bg-brand-surface p-1.5 rounded-full flex self-start border border-[#44210c] shadow-inner">
          <button 
            onClick={() => setActiveTab("my")}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === "my" 
                ? "bg-brand-accent text-[#210c00] shadow-md font-extrabold" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            My Requests
          </button>
          <button 
            onClick={() => setActiveTab("nearby")}
            className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-300 ${
              activeTab === "nearby" 
                ? "bg-brand-accent text-[#210c00] shadow-md font-extrabold" 
                : "text-gray-300 hover:text-white"
            }`}
          >
            Nearby Tasks
          </button>
        </div>
      </div>

      {/* Filter Chips list */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 border-b border-[#44210c]/40">
        {filterChips.map(chip => (
          <button
            key={chip.id}
            onClick={() => setActiveFilter(chip.id as any)}
            className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all border ${
              activeFilter === chip.id
                ? "bg-brand-accent text-[#210c00] border-brand-accent shadow-md"
                : "bg-brand-card hover:bg-[#44210d] text-gray-300 border-[#44210c]"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Grid listing */}
      {activeTab === "nearby" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="requests-grid">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-brand-surface rounded-2xl border border-dashed border-[#44210c] text-gray-400">
              <FolderOpen className="h-10 w-10 mx-auto text-brand-accent mb-3" />
              <p className="font-extrabold text-sm">No tasks matching filters found</p>
              <button 
                onClick={() => setActiveFilter("all")}
                className="mt-2 text-xs text-brand-accent underline font-bold"
              >
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
                onClick={() => onSelectTask(task)}
                className="bg-brand-surface rounded-2xl p-5 border border-[#44210c] glowing-shadow hover:-translate-y-1 hover:border-brand-accent/40 flex flex-col sm:flex-row gap-5 transition-all cursor-pointer group"
              >
                {/* Task Photo Indicator */}
                <div className="w-full sm:w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-xl bg-brand-card border border-[#44210c] shadow-md">
                  <img 
                    src={task.photoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCZqtuoNAsJfjkWGhgnLwGMMCfl84cZ6gGCBsczJ5PQdG7r5tKMRVado6JVs-qKriI_xVShXk5gwF4smEq-fucrRAOM5zkjQijFgpglah9UXXngx-Doe6gcJBbk8etrThNvD9gb4fhww4cqPLAmTmgC7l4rpJSm6Nqo1BwKeKa75OMMLtputEMxusMLGnAp0uU0GRNZbUrKCxHhiTYzWqwW0BbDOgNdvR3KrJPYKJL3MaTHA72W_QWeG1KkD9Yt00x7q-JlJQc5CJI"} 
                    alt={task.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {task.urgent && (
                    <span className="absolute top-2 left-2 px-2.5 py-1 bg-red-600 text-white rounded-full font-extrabold text-[10px] uppercase shadow-lg tracking-wider border border-red-500">
                      Urgent
                    </span>
                  )}
                </div>

                {/* Task description summary */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-extrabold text-base text-white group-hover:text-brand-accent transition-colors line-clamp-1">
                        {task.title}
                      </h3>
                      <span className="text-brand-accent font-extrabold text-base whitespace-nowrap">
                        {task.budget} kr
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed font-body line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-400 text-xs pt-1">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-brand-accent" /> {task.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Users className="h-3.5 w-3.5 text-brand-accent" /> {task.appliedCount} Applied
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 sm:mt-0 pt-2 border-t border-[#44210c]/20">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${task.status === "Open" ? "bg-brand-accent animate-pulse" : "bg-gray-500"}`}></span>
                      <span className={`text-xs font-bold ${task.status === "Open" ? "text-brand-accent animate-pulse" : "text-gray-400"}`}>
                        {task.status}
                      </span>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTask(task);
                      }}
                      className="bg-brand-accent text-brand-bg px-4 py-1.5 rounded-xl font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-accent/10"
                    >
                      {task.status === "Open" ? "Manage" : "View Details"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        /* Render My Requests Tab (Screen 5 Past histories + currently posted custom user requests) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastTasks.map((task) => (
              <div
                key={task.id}
                className="bg-brand-surface rounded-2xl p-4 flex gap-4 border border-[#44210c] shadow-lg group relative overflow-hidden"
              >
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-brand-card border border-[#44210c] relative">
                  <img 
                    src={task.imageUrl} 
                    alt={task.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-extrabold text-sm sm:text-base text-white">
                        {task.title}
                      </h3>
                      <span className="font-extrabold text-sm text-brand-accent">
                        {task.budget} kr
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{task.date}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-accent-faded/50 border border-brand-accent/20">
                      <span className={`w-1.5 h-1.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider ${task.status === 'Completed' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {task.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => setView("inbox")}
                      className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                    >
                      View Chat Log
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asymmetric Details Top Helper Promo Section (Shown at the bottom) */}
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
            <button 
              onClick={() => setView("profile")}
              className="text-brand-accent font-extrabold text-sm hover:underline inline-flex items-center gap-1.5 pt-1"
            >
              <span>Learn about levels</span>
              <Sparkles className="h-4 w-4" />
            </button>
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

      {/* Floating Action Button for category browsing / creation on mobile */}
      <button 
        onClick={() => setView("create")}
        className="fixed bottom-20 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-brand-accent text-brand-bg rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 glowing-active border border-yellow-500"
      >
        <Plus className="h-7 w-7 text-brand-bg" strokeWidth={3} />
      </button>
    </div>
  );
}
