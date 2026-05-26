"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle, AlertTriangle, FileText, MapPin, AlignLeft, DollarSign } from "lucide-react";

export default function PostRequestPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Automotive");
  const [price, setPrice] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  const categories = ["Automotive", "Events", "Furniture Assembly", "Entertainment", "Cleaning", "Garden"];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8 border border-slate-800 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Post a Help Request</h2>
          <p className="text-slate-400 text-sm">
            Fill in the details below to request assistance. Certified helpers will apply directly.
          </p>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Request Posted Successfully!</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              Redirecting you to the home feed to check active applications...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                Task Title
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Change 4 tires on Volvo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Category & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                  Compensation (SEK)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="number"
                    required
                    placeholder="Budget (e.g. 800)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-650"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-455 uppercase tracking-wider">
                Location (City / Area)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Solna, Stockholm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-wider">
                Task Details / Description
              </label>
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-4 w-4.5 h-4.5 text-slate-500" />
                <textarea
                  required
                  rows={4}
                  placeholder="Provide details about what you need done. Include tool availability, estimated duration, and dates."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>

            {/* Hobbyverksamhet warning */}
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs flex gap-3 items-start leading-relaxed">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold">Swedish Hobbyverksamhet Note:</span> Under Swedish tax regulations, helpers are responsible for declaring their income when it exceeds Skatteverket limits. Ensure clean transaction logging for safety and compliance.
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-lg shadow-teal-500/10"
            >
              Post Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
