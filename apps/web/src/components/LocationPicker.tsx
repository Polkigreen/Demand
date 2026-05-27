"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, Crosshair, Search, Loader2 } from "lucide-react";

type Coords = { lat: number; lng: number };

function getCurrentPosition(): Promise<GeolocationPosition> {
  if (typeof window !== "undefined" && "geolocation" in navigator) {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
      })
    );
  }
  return Promise.reject(new Error("Geolocation not available"));
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=sv`,
      { headers: { "User-Agent": "DemandApp/1.0" } }
    );
    const data = await res.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

async function searchAddress(query: string): Promise<{ display: string; lat: number; lng: number }[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=sv`,
      { headers: { "User-Agent": "DemandApp/1.0" } }
    );
    const data = await res.json();
    return data.map((item: any) => ({
      display: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
}

interface Props {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
}

export default function LocationPicker({ value, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState(value || "");
  const [results, setResults] = useState<{ display: string; lat: number; lng: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setSearchQuery(value || "");
  }, [value]);

  const handleSearch = useCallback(async (q: string) => {
    setSearchQuery(q);
    if (q.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    const res = await searchAddress(q);
    setResults(res);
    setShowResults(res.length > 0);
    setSearching(false);
  }, []);

  const handleSelect = (item: { display: string; lat: number; lng: number }) => {
    setSearchQuery(item.display);
    setCoords({ lat: item.lat, lng: item.lng });
    setShowResults(false);
    onChange(item.display, item.lat, item.lng);
  };

  const handleGetCurrent = async () => {
    setLocating(true);
    try {
      const pos = await getCurrentPosition();
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lng: longitude });
      const address = await reverseGeocode(latitude, longitude);
      setSearchQuery(address);
      onChange(address, latitude, longitude);
    } catch {
      setSearchQuery("Kunde inte hamta position");
    }
    setLocating(false);
  };

  return (
    <div className="relative space-y-2">
      <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        <MapPin className="h-3.5 w-3.5 text-brand-accent" />
        Plats
      </label>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Sok plats eller adress..."
            className="w-full bg-brand-surface border border-[#44210c] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-brand-accent transition-colors"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-accent animate-spin" />
          )}
        </div>
        <button
          onClick={handleGetCurrent}
          disabled={locating}
          className="bg-brand-surface border border-[#44210c] hover:border-brand-accent/50 p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50"
          title="Anvand min position"
        >
          {locating ? (
            <Loader2 className="h-5 w-5 text-brand-accent animate-spin" />
          ) : (
            <Crosshair className="h-5 w-5 text-brand-accent" />
          )}
        </button>
      </div>

      {showResults && (
        <div className="absolute z-20 top-full mt-1 left-0 right-14 bg-brand-card border border-[#44210c] rounded-xl max-h-48 overflow-y-auto shadow-xl">
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-3 py-2.5 text-xs text-gray-300 hover:bg-brand-surface hover:text-white transition-colors border-b border-[#44210c]/30 last:border-0"
            >
              {item.display}
            </button>
          ))}
        </div>
      )}

      {coords && (
        <p className="text-[10px] text-gray-500">
          {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
