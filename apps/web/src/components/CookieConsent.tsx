"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ConsentSettings = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "demand-cookie-consent";

function getSavedConsent(): ConsentSettings | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(settings: ConsentSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentSettings | null>(null);

  useEffect(() => {
    setConsent(getSavedConsent());
  }, []);

  const acceptAll = () => {
    const all: ConsentSettings = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(all);
    setConsent(all);
  };

  const acceptNecessary = () => {
    const minimal: ConsentSettings = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    saveConsent(minimal);
    setConsent(minimal);
  };

  const customize = (settings: Omit<ConsentSettings, "necessary">) => {
    const full: ConsentSettings = { necessary: true, ...settings };
    saveConsent(full);
    setConsent(full);
  };

  return { consent, acceptAll, acceptNecessary, customize };
}

export default function CookieConsent() {
  const { consent, acceptAll, acceptNecessary } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);

  if (consent !== null) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto bg-brand-card border border-[#44210c] rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">
            Cookies &amp; integritet
          </h3>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Demand anvander cookies for att webbplatsen ska fungera, for
          statistik och for att gora din upplevelse battre. Du valjer
          sjalv vilka cookies du godkanner.
        </p>

        {showDetails && (
          <div className="space-y-2 mb-4 text-xs text-gray-300 bg-brand-surface rounded-xl p-3 border border-[#44210c]/50">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Nodvandiga</span>
              <span className="text-brand-accent text-[10px]">Alltid pa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Funktionella</span>
              <span className="text-gray-400 text-[10px]">(sparar dina val)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Analys</span>
              <span className="text-gray-400 text-[10px]">(anvandarstatistik)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Marknadsforing</span>
              <span className="text-gray-400 text-[10px]">(annonser)</span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button onClick={acceptAll}
            className="flex-1 min-w-[100px] bg-brand-accent text-[#1e0d02] text-xs font-extrabold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all">
            Godkann alla
          </button>
          <button onClick={acceptNecessary}
            className="flex-1 min-w-[100px] bg-brand-surface border border-[#44210c] text-gray-300 text-xs font-extrabold px-4 py-2.5 rounded-xl hover:bg-[#44210c]/50 transition-all">
            Bara nodvandiga
          </button>
          <button onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 text-[10px] underline hover:text-white transition-colors px-2 self-center">
            {showDetails ? "Dolj detaljer" : "Visa detaljer"}
          </button>
        </div>
      </div>
    </div>
  );
}
