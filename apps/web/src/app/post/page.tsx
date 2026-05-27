"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft, MapPin, Calendar, Clock, Check, Camera, Upload, Sparkles, Info } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { motion, AnimatePresence } from "motion/react";
import { createRequest } from "@/lib/requests";

export const dynamic = 'force-dynamic';

const CATEGORIES = ["Assembly", "Car Help", "Event Prep", "Pet Care"] as const;
const STEP_NAMES = ["Description", "Location", "Budget", "Photos"];

export default function CreatePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("Assembly");
  const [location, setLocation] = useState("Stockholm City, Sweden");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [budget, setBudget] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleNext = () => {
    if (step === 1 && !title && !description) { setError("Please describe what you need help with."); return; }
    setError("");
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await createRequest({
        title: title || description.split(".")[0].substring(0, 60),
        description,
        location,
        category,
        price: budget,
        latitude,
        longitude,
      });
      router.push("/feed");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to post request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4 justify-between border-b border-[#44210c]/40 pb-4">
        <button onClick={() => router.push("/feed")} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
        <span className="text-xs uppercase tracking-wider text-brand-accent font-extrabold">Post a Request</span>
      </div>

      <div className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-[#44210c]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs sm:text-sm font-extrabold text-brand-accent uppercase tracking-wider">Step {step} of 4</span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold uppercase tracking-wider">{STEP_NAMES[step - 1]}</span>
        </div>
        <div className="w-full h-2.5 bg-brand-card rounded-full overflow-hidden">
          <div className="h-full bg-brand-accent transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold text-center">
          {error}
        </div>
      )}

      <div className="min-h-[350px] bg-brand-surface/40 p-6 sm:p-8 rounded-3xl border border-[#44210c] glowing-shadow">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  What do you need help with?
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Be as descriptive as possible so your neighbors know how they can assist.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">Give your task a clear name</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Assemble IKEA Malm 6-drawer dresser"
                  className="w-full p-4 rounded-xl bg-brand-card border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 transition-all font-medium text-sm sm:text-base outline-none" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">Describe the job scope</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I need help moving a heavy sofa from my upstairs living room to the basement cellar..."
                  rows={5} className="w-full p-4 rounded-xl bg-brand-card border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 transition-all font-medium text-sm sm:text-base resize-none outline-none" />
              </div>
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">Select the appropriate category</label>
                <div className="flex flex-wrap gap-2.5">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} type="button" onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                        category === cat ? "bg-brand-accent text-[#1e0d02] border-brand-accent shadow-md" : "bg-brand-card text-gray-300 border-[#44210c] hover:bg-[#44210d]"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  When & Where?
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">Pick a convenient time and specify your city location address.</p>
              </div>
              <div className="space-y-4">
                <LocationPicker
                  value={location}
                  onChange={(addr, lat, lng) => {
                    setLocation(addr);
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">Preferred Date</label>
                    <div className="relative">
                      <Calendar className="h-4 w-4 text-brand-accent absolute left-3 top-1/2 -translate-y-1/2 sm:block hidden" />
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-4 sm:pl-10 pr-3 py-3.5 rounded-xl bg-brand-card border border-transparent focus:border-brand-accent text-white text-xs sm:text-sm outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">Preferred Time</label>
                    <div className="relative">
                      <Clock className="h-4 w-4 text-brand-accent absolute left-3 top-1/2 -translate-y-1/2 sm:block hidden" />
                      <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-4 sm:pl-10 pr-3 py-3.5 rounded-xl bg-brand-card border border-transparent focus:border-brand-accent text-white text-xs sm:text-sm outline-none" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  Set Your Budget
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Suggest a fair price for your neighbors. You can negotiate further details in chat.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-8 py-8 px-4 bg-brand-card rounded-3xl border border-[#44210c] relative shadow-inner">
                <div className="relative text-center w-full max-w-xs">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-extrabold text-2xl text-brand-accent">kr</span>
                  <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} min={1}
                    className="w-full text-center font-extrabold text-4xl sm:text-5xl text-white bg-transparent border-none focus:ring-0 outline-none" />
                </div>
                <div className="flex justify-center gap-3 w-full max-w-md">
                  {[250, 500, 1000].map((preset) => (
                    <button key={preset} type="button" onClick={() => setBudget(preset)}
                      className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border ${
                        budget === preset ? "bg-brand-accent text-[#210c00] border-brand-accent shadow-lg" : "bg-brand-surface hover:bg-[#44210d] text-gray-300 border-[#44210c]"
                      }`}>
                      {preset} kr
                    </button>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-400 font-semibold flex items-center justify-center gap-1.5 bg-[#44210d]/40 rounded-xl px-4 py-2 border border-[#522b10]">
                  <Info className="h-4 w-4 text-brand-accent shrink-0" />
                  <span>Average price for similar tasks in Stockholm: 500 kr</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">Add photos</h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Photos assist your neighbors in accurately understanding the job scope.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-brand-card hover:bg-brand-card-high border-2 border-dashed border-[#522b10] hover:border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 duration-200">
                  <Camera className="h-10 w-10 text-brand-accent mb-2" />
                  <span className="font-extrabold text-xs text-white">Take Photo</span>
                </div>
                <div className="aspect-square bg-brand-card hover:bg-brand-card-high border-2 border-dashed border-[#522b10] hover:border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 duration-200">
                  <Upload className="h-10 w-10 text-brand-accent mb-2" />
                  <span className="font-extrabold text-xs text-white">Upload from library</span>
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-brand-accent-faded/20 border border-brand-accent/20 rounded-2xl flex items-start gap-3.5">
                <Sparkles className="h-5 w-5 text-brand-accent mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-0.5">Pro-tip</h4>
                  <p className="text-xs text-gray-300 font-body">
                    Clear, well-lit photos of the workspace or parts raise your response rates by over 40% on average!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-4">
        {step > 1 && (
          <button type="button" onClick={handlePrev}
            className="flex-1 py-4 px-6 border-2 border-[#ff9100]/30 hover:border-brand-accent text-brand-accent rounded-2xl font-bold text-sm bg-transparent hover:bg-brand-surface hover:text-white transition-all active:scale-[0.97]">
            Back
          </button>
        )}
        {step < 4 ? (
          <button type="button" onClick={handleNext}
            className="flex-[2] py-4 px-6 bg-white hover:bg-opacity-90 text-brand-bg rounded-2xl font-extrabold text-sm shadow-xl hover:shadow-brand-accent/10 transition-all active:scale-[0.97]">
            Continue
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={isSubmitting}
            className="flex-[2] py-4 px-6 bg-brand-accent text-[#1e0d02] rounded-2xl font-extrabold text-sm shadow-xl glowing-active hover:brightness-110 transition-all active:scale-[0.97] flex items-center justify-center gap-2">
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-4.5 w-4.5 border-2 border-brand-bg border-t-transparent animate-spin rounded-full inline-block" />
                Posting to feed...
              </span>
            ) : (
              <span>Post Request</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
