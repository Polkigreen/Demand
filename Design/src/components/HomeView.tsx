import { TaskRequest, AppView } from "../types";
import { RECENTLY_POSTED_FEED } from "../data";
import { 
  Search, 
  MapPin, 
  Bell, 
  Car, 
  PartyPopper, 
  Wrench, 
  Dog, 
  ArrowRight, 
  ShieldCheck, 
  Shield,
  CreditCard, 
  HeartHandshake,
  MessageSquare,
  Clock
} from "lucide-react";
import { motion } from "motion/react";

interface HomeViewProps {
  setView: (view: AppView) => void;
  setSelectedCategory: (category: string) => void;
  recentTasks: TaskRequest[];
  onSelectTask: (task: TaskRequest) => void;
}

export default function HomeView({ setView, setSelectedCategory, recentTasks, onSelectTask }: HomeViewProps) {
  const categories = [
    { name: "Car Help", icon: Car, color: "bg-[#2e1500] text-brand-accent", sub: "Tires, batteries & oil" },
    { name: "Event Prep", icon: PartyPopper, color: "bg-[#251b2d] text-purple-400", sub: "Parties & holidays" },
    { name: "Assembly", icon: Wrench, color: "bg-[#182a1b] text-emerald-400", sub: "IKEA wardrobes & beds" },
    { name: "Pet Care", icon: Dog, color: "bg-[#18252a] text-cyan-400", sub: "Dog walks & sitting" }
  ];

  return (
    <div className="space-y-10 pb-4">
      {/* Top Header App Bar (For Mobile only, hidden on Desktop since sidebar handles it) */}
      <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between bg-brand-surface/85 backdrop-blur-xl px-4 lg:hidden border-b border-[#44210c]">
        <div className="flex items-center gap-3">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLfCTletWFUAXtaUbwzQ2_pKeH0X2_IX3obkq_jv_ERlkfDo-YfKjmZz7tbp_IisltPGxTXzUdeYAx0lEW63Uwz6AHcy9lU2vW8RfS0OreMPlgHD-6AIeRjuw7l4-O-khXF0zhzjUtF9djbebEZLm_TPTCK2kGDzilhM-fH4u25v41Sw6788RoZkXOEa7nsceRcofL-E79gEgM2vzzHgHyNc7DnNxaqa7WqDOQge0d2IcEdpJaOkTDHnaBboQbsKlq4_JYKYDFUHE" 
            alt="Demand logo" 
            className="h-8 w-auto"
          />
          <span className="font-extrabold text-white text-base">NeighborHelp</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setView("requests")}
            className="p-2 text-brand-accent rounded-full hover:bg-brand-card transition-colors"
          >
            <MapPin className="h-5 w-5" />
          </button>
          <button className="p-2 text-brand-accent rounded-full hover:bg-brand-card transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-brand-accent border border-brand-surface animate-pulse" />
          </button>
        </div>
      </header>

      {/* Hero Welcome Unit */}
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
              <button 
                onClick={() => setView("create")}
                className="bg-brand-accent text-[#210c00] px-8 py-3.5 rounded-full font-extrabold text-sm shadow-xl glowing-active hover:brightness-110 active:scale-[0.98] transition-all hover:pr-10 relative group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
              <button 
                onClick={() => setView("requests")}
                className="bg-brand-card text-white hover:bg-[#44210c] border border-gray-700 px-6 py-3.5 rounded-full font-bold text-sm transition-all"
              >
                Browse Gigs
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-sm md:max-w-none">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCbSB34oLfTHLPgxxdnRQhlOOoEw-ykoHBwd5rp9MwvID93nJshRhUWCknRNI1tnHBGiRhQMqQOPGYjW6AS_60XOS7kAYzzJRAUVN5KLo0xObkcMuXUvfnL8_ltbmpgB8H8LitxJPjPXgFGFeT6cC5LHZ9Od1xZ21VJKfVof2m1al57DjBKLZQT-S4m7QQh1KVFH4DSNlf4GhHPsAhY-6uPv3eMQXOv5vFJtP6cajHL4h3jBQ2TApiu7ErXr6_BJdkpYj-VoN3btk" 
              alt="Neighborhood illustration background" 
              className="w-full h-auto rounded-3xl border border-[#44210c] transform md:scale-105 transition-transform hover:scale-110 duration-500"
            />
          </div>
        </div>
      </motion.section>

      {/* Global Interactive Search Input */}
      <section className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[#ae9b8e]">
          <Search className="h-6 w-6" />
        </div>
        <input 
          type="text" 
          onClick={() => setView("requests")}
          placeholder="What do you need help with today?"
          className="w-full h-16 pl-14 pr-6 rounded-2xl bg-brand-card hover:bg-brand-card-high border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 shadow-xl transition-all cursor-pointer font-medium text-base select-none outline-none"
          readOnly
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-brand-accent-faded text-brand-accent rounded-lg text-xs font-bold">
          Search
        </div>
      </section>

      {/* Marketplace Categories Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Categories
            </h2>
            <p className="text-xs text-gray-400">Discover vetted local providers nearby</p>
          </div>
          <button 
            onClick={() => setView("requests")}
            className="text-brand-accent font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:underline"
          >
            <span>View all feed</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={i}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setView("category");
                }}
                className="bg-brand-surface border border-[#44210c] p-5 sm:p-6 rounded-2xl glowing-shadow hover:translate-y-[-4px] hover:border-brand-accent/40 hover:bg-brand-card transition-all cursor-pointer group text-center flex flex-col justify-between h-40 sm:h-44"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${cat.color} transition-transform group-hover:scale-110 shadow-lg`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <span className="block font-extrabold text-sm text-white group-hover:text-brand-accent transition-colors">
                    {cat.name}
                  </span>
                  <span className="block text-[11px] text-gray-400 mt-0.5">
                    {cat.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Grid of Gigs / Requests Feed */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
              Recently Posted Help Requests
            </h2>
            <p className="text-xs text-gray-400">Neighbors looking for support right now</p>
          </div>
          <button 
            onClick={() => setView("requests")}
            className="text-brand-accent font-bold text-xs sm:text-sm flex items-center gap-1.5 hover:underline"
          >
            <span>Explore feed</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentTasks.slice(0, 3).map((task) => (
            <div 
              key={task.id}
              onClick={() => onSelectTask(task)}
              className="bg-brand-surface rounded-2xl border border-[#44210c] p-5 glowing-shadow hover:translate-y-[-4px] hover:border-brand-accent/40 transition-all cursor-pointer flex flex-col justify-between h-[230px] group"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="bg-brand-accent-faded text-brand-accent px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide uppercase">
                    {task.category}
                  </span>
                  <span className="text-brand-accent font-extrabold text-lg">
                    {task.budget} kr
                  </span>
                </div>
                <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-brand-accent transition-colors mb-1.5">
                  {task.title}
                </h3>
                <p className="text-xs text-gray-400 font-body line-clamp-3">
                  {task.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#44210c]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-brand-card border border-brand-accent/40">
                    <img 
                      src={task.creator.avatar} 
                      alt={task.creator.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-white">{task.creator.name}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <MapPin className="h-2.5 w-2.5 text-brand-accent" /> {task.creator.distance}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-brand-accent" /> 2m ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="bg-brand-card/65 rounded-3xl p-8 border border-[#44210c] glowing-shadow relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,145,0,0.06),transparent_50%)] pointer-events-none" />
        <div className="relative z-10 text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2 font-display uppercase">
            Safe &amp; Trusted Neighbor Marketplace
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
    </div>
  );
}
