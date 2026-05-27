import { HelperProfile, AppView } from "../types";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  MessageSquare, 
  BadgeCheck, 
  CheckCircle, 
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { motion } from "motion/react";

interface CategoryViewProps {
  categoryName: string;
  setView: (view: AppView) => void;
  helpers: HelperProfile[];
  onSelectHelper: (helper: HelperProfile) => void;
  onInitiateChatFromHelper: (helper: HelperProfile) => void;
}

export default function CategoryView({ 
  categoryName, 
  setView, 
  helpers, 
  onSelectHelper,
  onInitiateChatFromHelper
}: CategoryViewProps) {
  // Filter helpers that have skills related to this category prefix (or just show all with specific matching score)
  const filteredHelpers = helpers.filter(helper => {
    if (categoryName === "Car Help") {
      return helper.skills.includes("Car Help") || helper.id === "sven" || helper.id === "maria" || helper.id === "erik" || helper.id === "lars";
    }
    if (categoryName === "Assembly") {
      return helper.skills.includes("Furniture Assembly") || helper.id === "anders" || helper.id === "sarah_m";
    }
    return true; // show all for event/pet care in this mockup
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex items-center gap-4 border-b border-[#44210c] pb-4 justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setView("home")}
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-surface border border-[#44210c]/80 transition-colors"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              {categoryName} Helpers
            </h1>
            <p className="text-xs text-gray-400">Available providers ready to serve your area in Stockholm</p>
          </div>
        </div>

        <button 
          onClick={() => setView("home")}
          className="text-xs text-brand-accent hover:underline font-bold"
        >
          Categories
        </button>
      </div>

      {/* Directory Helper Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="category-helpers-list">
        {filteredHelpers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-brand-surface rounded-2xl border border-dashed border-[#44210c] text-gray-400">
            <FolderOpen className="h-10 w-10 mx-auto text-brand-accent mb-3" />
            <p className="font-extrabold text-sm">No helpers currently listed in {categoryName}</p>
          </div>
        ) : (
          filteredHelpers.map((helper, i) => (
            <motion.div
              key={helper.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              onClick={() => onSelectHelper(helper)}
              className="bg-brand-surface rounded-2xl p-5 border border-[#44210c] glowing-shadow hover:-translate-y-1 hover:border-brand-accent/40 flex flex-col justify-between cursor-pointer transition-all gap-4 group"
            >
              <div className="flex gap-4.5">
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-brand-card border-2 border-brand-accent/30 flex-shrink-0">
                  <img 
                    src={helper.avatar} 
                    alt={helper.name} 
                    className="w-full h-full object-cover"
                  />
                  {helper.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-brand-surface p-0.5 rounded-full">
                      <BadgeCheck className="h-4 w-4 text-brand-accent" />
                    </div>
                  )}
                </div>

                {/* Details info */}
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-base text-white group-hover:text-brand-accent transition-colors">
                      {helper.name}
                    </h3>
                    <span className="text-brand-accent font-extrabold text-base whitespace-nowrap">
                      {helper.rateHour} kr/hr
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="flex items-center gap-0.5 font-bold text-yellow-400">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" /> {helper.rating}
                    </span>
                    <span className="text-gray-400 font-semibold">({helper.reviewsCount} reviews)</span>
                  </div>

                  <p className="text-[11px] text-gray-400 flex items-center gap-1 font-semibold">
                    <MapPin className="h-3 w-3 text-brand-accent" /> {helper.distance}
                  </p>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-gray-400 font-body line-clamp-2 italic leading-relaxed">
                "{helper.bio}"
              </p>

              {/* Buttons panel */}
              <div className="pt-3 border-t border-[#44210c]/30 flex gap-3.5 justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                  Typically replies inside 30m
                </span>

                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onInitiateChatFromHelper(helper);
                    }}
                    className="p-2 px-3 text-brand-accent bg-brand-accent-faded hover:bg-brand-accent/20 rounded-xl transition-colors active:scale-95"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onSelectHelper(helper)}
                    className="bg-brand-accent text-brand-bg px-4 py-2 rounded-xl font-extrabold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md"
                  >
                    View Bio Profile
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Safety Assurance banner */}
      <div className="bg-[#44210c]/40 p-5 rounded-2xl border border-[#44210c] flex items-center gap-4">
        <div className="bg-brand-accent-faded text-brand-accent p-3 rounded-xl">
          <BadgeCheck className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-extrabold text-white text-sm">Verified Credentials Protection</h4>
          <p className="text-xs text-gray-400 font-body leading-relaxed max-w-xl">
            All listed helpers have provided proof of clean criminal records to BankID and hold general commercial third-party damage liability guarantees.
          </p>
        </div>
      </div>
    </div>
  );
}
