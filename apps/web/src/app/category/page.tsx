"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, MessageSquare, BadgeCheck, FolderOpen } from "lucide-react";

const MOCK_HELPERS = [
  { id: "anders", name: "Anders S.", rating: 4.9, reviewsCount: 52, distance: "Within 5km", skills: ["Furniture Assembly", "Gardening", "Plumbing"], rateHour: 250, verified: true, bio: "Handyman with 10 years of experience. I love helping my neighbors with IKEA assembly and garden work." },
  { id: "sven", name: "Sven A.", rating: 4.8, reviewsCount: 120, distance: "1.2 km away", skills: ["Car Help", "Tire Change", "Engine Tuning"], rateHour: 300, verified: true, bio: "Expert in tire changes and minor engine repairs. I bring my own professional tools." },
  { id: "maria", name: "Maria L.", rating: 4.9, reviewsCount: 84, distance: "2.5 km away", skills: ["Car Help", "Electrical Diagnostics", "Battery Service"], rateHour: 350, verified: true, bio: "Specializing in electronic diagnostics, battery replacements, and oil changes." },
  { id: "sarah_m", name: "Sarah Miller", rating: 4.9, reviewsCount: 46, distance: "1.5 km away", skills: ["Furniture Assembly", "IKEA expert", "Cabinet Hangs"], rateHour: 360, verified: true, bio: "Professional carpenter with specialized focus on IKEA and custom modular shelving assemblies." },
  { id: "erik", name: "Erik J.", rating: 4.7, reviewsCount: 42, distance: "0.8 km away", skills: ["Car Help", "Car Detailing", "Polish/Wash"], rateHour: 200, verified: false, bio: "Interior and exterior detailing pro. I'll make your car look brand new." },
  { id: "lars", name: "Lars H.", rating: 5.0, reviewsCount: 18, distance: "4.1 km away", skills: ["Car Help", "Brake Pad Install", "Fluid Flush"], rateHour: 280, verified: true, bio: "Brake pad replacement and brake fluid flushing. Quick, reliable service." },
];

const CATEGORY_SKILL_MAP: Record<string, string[]> = {
  "Car Help": ["Car Help"],
  "Assembly": ["Furniture Assembly", "IKEA expert", "Cabinet Hangs"],
  "Event Prep": ["Event Prep"],
  "Pet Care": ["Pet Care"],
};

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading category...</div>}>
      <CategoryContent />
    </Suspense>
  );
}

function CategoryContent() {
  const searchParams = useSearchParams();
  const categoryName = searchParams.get("name") || "Car Help";

  const filteredHelpers = MOCK_HELPERS.filter((h) => {
    const matchingSkills = CATEGORY_SKILL_MAP[categoryName] || [];
    return h.skills.some((s) => matchingSkills.includes(s));
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b border-[#44210c] pb-4 justify-between">
        <div className="flex items-center gap-3">
          <Link href="/"
            className="p-2 text-gray-400 hover:text-white rounded-xl bg-brand-surface border border-[#44210c]/80 transition-colors">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              {categoryName} Helpers
            </h1>
            <p className="text-xs text-gray-400">Available providers ready to serve your area in Stockholm</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHelpers.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-brand-surface rounded-2xl border border-dashed border-[#44210c] text-gray-400">
            <FolderOpen className="h-10 w-10 mx-auto text-brand-accent mb-3" />
            <p className="font-extrabold text-sm">No helpers currently listed in {categoryName}</p>
            <Link href="/" className="mt-2 inline-block text-xs text-brand-accent underline font-bold">
              Browse categories
            </Link>
          </div>
        ) : (
          filteredHelpers.map((helper, i) => (
            <div key={helper.id}
              className="bg-brand-surface rounded-2xl p-5 border border-[#44210c] glowing-shadow hover:-translate-y-1 hover:border-brand-accent/40 flex flex-col justify-between cursor-pointer transition-all gap-4 group">
              <div className="flex gap-4.5">
                <div className="relative w-16 h-16 rounded-full bg-brand-accent/20 border-2 border-brand-accent/30 flex items-center justify-center font-bold text-lg text-brand-accent flex-shrink-0">
                  {helper.name[0]}
                  {helper.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-brand-surface p-0.5 rounded-full">
                      <BadgeCheck className="h-4 w-4 text-brand-accent" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-base text-white group-hover:text-brand-accent transition-colors">{helper.name}</h3>
                    <span className="text-brand-accent font-extrabold text-base whitespace-nowrap">{helper.rateHour} kr/hr</span>
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
              <p className="text-xs text-gray-400 font-body line-clamp-2 italic leading-relaxed">&ldquo;{helper.bio}&rdquo;</p>
              <div className="pt-3 border-t border-[#44210c]/30 flex gap-3.5 justify-between items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Typically replies inside 30m</span>
                <div className="flex gap-2">
                  <Link href="/chat"
                    className="p-2 px-3 text-brand-accent bg-brand-accent-faded hover:bg-brand-accent/20 rounded-xl transition-colors active:scale-95">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

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
