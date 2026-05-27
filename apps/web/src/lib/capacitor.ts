"use client";

export function isCapacitor(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).Capacitor?.isNativePlatform();
}

export function getPlatform(): "ios" | "android" | "web" {
  if (typeof window === "undefined") return "web";
  const cap = (window as any).Capacitor;
  if (!cap?.isNativePlatform()) return "web";
  return cap.getPlatform() as "ios" | "android";
}
