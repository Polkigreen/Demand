import { useState } from "react";
import { AppView, TaskRequest } from "../types";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Camera, 
  Upload, 
  Sparkles,
  Info,
  BadgeAlert,
  Sliders
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CreateViewProps {
  setView: (view: AppView) => void;
  onSubmitTask: (newTask: Omit<TaskRequest, "id" | "appliedCount" | "status" | "createdAt" | "creator">) => void;
}

export default function CreateView({ setView, onSubmitTask }: CreateViewProps) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TaskRequest["category"]>("Assembly");
  const [location, setLocation] = useState("Stockholm City, Sweden");
  const [date, setDate] = useState("2026-05-28");
  const [time, setTime] = useState("10:00");
  const [budget, setBudget] = useState(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const stepNames = ["Description", "Location", "Budget", "Photos"];

  const handleNext = () => {
    if (step === 1 && !description) {
      alert("Please specify what you need help with.");
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Fake posting delay
    setTimeout(() => {
      let taskTitle = title;
      if (!taskTitle) {
        // Derive title from description or pick category name
        taskTitle = description.split(".")[0];
        if (taskTitle.length > 35) {
          taskTitle = taskTitle.substring(0, 32) + "...";
        }
      }

      onSubmitTask({
        title: taskTitle,
        category,
        description,
        location,
        date,
        time,
        budget,
        urgent: false,
        photoUrl: undefined // can toggle placeholder
      });
      setIsSubmitting(false);
      setView("requests");
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      {/* Top Bar Go Back Trigger */}
      <div className="flex items-center gap-4 justify-between border-b border-[#44210c]/40 pb-4">
        <button 
          onClick={() => setView("home")}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </button>
        <span className="text-xs uppercase tracking-wider text-brand-accent font-extrabold">Post a Request</span>
        <button 
          onClick={() => setView("requests")}
          className="text-xs font-bold text-brand-accent hover:underline"
        >
          Drafts
        </button>
      </div>

      {/* Progress banner indicator */}
      <div className="bg-brand-surface p-4 sm:p-6 rounded-2xl border border-[#44210c]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs sm:text-sm font-extrabold text-brand-accent uppercase tracking-wider">
            Step {step} of 4
          </span>
          <span className="text-xs sm:text-sm text-gray-300 font-bold uppercase tracking-wider">
            {stepNames[step - 1]}
          </span>
        </div>
        
        {/* Dynamic progress bar */}
        <div className="w-full h-2.5 bg-brand-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-accent transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Step Canvas */}
      <div className="min-h-[350px] bg-brand-surface/40 p-6 sm:p-8 rounded-3xl border border-[#44210c] glowing-shadow">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  What do you need help with?
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Be as descriptive as possible so your neighbors know how they can assist.
                </p>
              </div>

              {/* Title input */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                  Give your task a clear name
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Assemble IKEA Malm 6-drawer dresser"
                  className="w-full p-4 rounded-xl bg-brand-card border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 transition-all font-medium text-sm sm:text-base outline-none"
                />
              </div>

              {/* Description box */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                  Describe the job scope
                </label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. I need help moving a heavy sofa from my upstairs living room to the basement cellar. It's quite awkward and heavy, so someone strong with experience would be awesome!"
                  rows={5}
                  className="w-full p-4 rounded-xl bg-brand-card border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 transition-all font-medium text-sm sm:text-base resize-none outline-none"
                />
              </div>

              {/* Category suggestion tags pills */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                  Select the appropriate category
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(["Assembly", "Car Help", "Event Prep", "Pet Care"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                        category === cat
                          ? "bg-brand-accent text-[#1e0d02] border-brand-accent shadow-md"
                          : "bg-brand-card text-gray-300 border-[#44210c] hover:bg-[#44210d]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  When &amp; Where?
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Pick a convenient time and specify your city location address.
                </p>
              </div>

              <div className="space-y-4">
                {/* Location text input */}
                <div className="space-y-2">
                  <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                    Location address
                  </label>
                  <div className="relative">
                    <MapPin className="h-5 w-5 text-brand-accent absolute left-4 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Södermalm, Stockholm"
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-brand-card border-2 border-transparent focus:border-brand-accent text-white placeholder-gray-400 transition-all font-medium text-sm sm:text-base outline-none"
                    />
                  </div>
                </div>

                {/* Date & Time boxes side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <Calendar className="h-4 w-4 text-brand-accent absolute left-3 top-1/2 -translate-y-1/2 sm:block hidden" />
                      <input 
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-4 sm:pl-10 pr-3 py-3.5 rounded-xl bg-brand-card border border-transparent focus:border-brand-accent text-white text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-[#ae9b8e]">
                      Preferred Time
                    </label>
                    <div className="relative">
                      <Clock className="h-4 w-4 text-brand-accent absolute left-3 top-1/2 -translate-y-1/2 sm:block hidden" />
                      <input 
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-4 sm:pl-10 pr-3 py-3.5 rounded-xl bg-brand-card border border-transparent focus:border-brand-accent text-white text-xs sm:text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Stockholm Sweden custom map graphic mockup */}
                <div className="rounded-2xl overflow-hidden h-40 border border-[#44210c] relative shadow-md">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsDvTdcCjONAESxzeaCj1OFVjV706uR9IALKLc7k7AyDKUwMXgdzHCZSThVTI6N-1UJgiGy14-frRIhODt71C5Z0uuCJXaoEiySDzhAl_0OjttgUh9YUDWva2PKrmp-fi8p2HVGBYTKn-WY68u3ukZpcyBjDlqNwmsu9IumtLu3QWLp_ZCsm4MfV5ZuoNfN_xR3Ps8wF6KL3a8xV493kPcZ3HrbxiAhaQqh1C2xPUYN-EleqTYMurWTKrb--d-1cOksJZBBsHSmfA" 
                    alt="Map view on Stockholm" 
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/85 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 bg-brand-surface border border-brand-accent/40 rounded-full px-3 py-1 font-bold text-[10px] sm:text-xs text-white shadow-lg flex items-center gap-1.5 animate-bounce">
                    <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                    <span>Selected: {location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
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
                  <input 
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    min={1}
                    className="w-full text-center font-extrabold text-4xl sm:text-5xl text-white bg-transparent border-none focus:ring-0 outline-none select-all"
                  />
                </div>

                {/* Preset pill buttons */}
                <div className="flex justify-center gap-3 w-full max-w-md">
                  {[250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBudget(preset)}
                      className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all border ${
                        budget === preset
                          ? "bg-brand-accent text-[#210c00] border-brand-accent shadow-lg"
                          : "bg-brand-surface hover:bg-[#44210d] text-gray-300 border-[#44210c]"
                      }`}
                    >
                      {preset} kr
                    </button>
                  ))}
                </div>

                {/* Info block */}
                <div className="text-center text-xs text-gray-400 font-semibold flex items-center justify-center gap-1.5 bg-[#44210d]/40 rounded-xl px-4 py-2 border border-[#522b10]">
                  <Info className="h-4 w-4 text-brand-accent shrink-0" />
                  <span>Average price for similar tasks in Stockholm: 500 kr</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display mb-1.5">
                  Add photos
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-body">
                  Photos assist your neighbors in accurately understanding the job scope.
                </p>
              </div>

              {/* Upload grids */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setUploadSuccess(true)}
                  className="aspect-square bg-brand-card hover:bg-brand-card-high border-2 border-dashed border-[#522b10] hover:border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 duration-200"
                >
                  <Camera className="h-10 w-10 text-brand-accent mb-2" />
                  <span className="font-extrabold text-xs text-white">Take Photo</span>
                </div>
                
                <div 
                  onClick={() => setUploadSuccess(true)}
                  className="aspect-square bg-brand-card hover:bg-brand-card-high border-2 border-dashed border-[#522b10] hover:border-brand-accent rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-colors active:scale-95 duration-200"
                >
                  <Upload className="h-10 w-10 text-brand-accent mb-2" />
                  <span className="font-extrabold text-xs text-white">Upload from library</span>
                </div>
              </div>

              {uploadSuccess && (
                <div className="py-2.5 px-4 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" /> Photo attached successfully!
                </div>
              )}

              {/* Pro tip helper */}
              <div className="p-4 sm:p-5 bg-brand-accent-faded/20 border border-brand-accent/20 rounded-2xl flex items-start gap-3.5">
                <Sparkles className="h-5 w-5 text-brand-accent mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-0.5">NeighborHelp Pro-tip</h4>
                  <p className="text-xs text-gray-300 font-body">
                    Clear, well-lit photos of the workspace or parts raise your response rates by over 40% on average!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back and Continue Buttons Panel */}
      <div className="flex gap-4">
        {step > 1 && (
          <button 
            type="button" 
            onClick={handlePrev}
            className="flex-1 py-4 px-6 border-2 border-[#ff9100]/30 hover:border-brand-accent text-brand-accent rounded-2xl font-bold text-sm bg-transparent hover:bg-brand-surface hover:text-white transition-all active:scale-[0.97]"
          >
            Back
          </button>
        )}
        
        {step < 4 ? (
          <button 
            type="button" 
            onClick={handleNext}
            className="flex-2 py-4 px-6 bg-white hover:bg-opacity-90 text-brand-bg rounded-2xl font-extrabold text-sm shadow-xl hover:shadow-brand-accent/10 transition-all active:scale-[0.97]"
          >
            Continue
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-2 py-4 px-6 bg-brand-accent text-[#1e0d02] rounded-2xl font-extrabold text-sm shadow-xl glowing-active hover:brightness-110 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
          >
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
