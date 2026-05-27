"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isAuth = pathname !== "/login";

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "/manifest.json";
    document.head.appendChild(link);
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#ff9100";
    document.head.appendChild(meta);
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen text-white bg-brand-bg flex font-sans antialiased selection:bg-brand-accent selection:text-[#1e0d02]">
        <div className="fixed top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-accent/5 blur-[120px] pointer-events-none -translate-y-1/2 z-0" />
        <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-brand-accent/5 blur-[150px] pointer-events-none translate-y-1/3 z-0" />

        <Navigation />

        <main className={`flex-1 relative z-10 px-4 sm:px-8 mt-20 lg:mt-6 overflow-x-hidden ${isAuth ? "lg:pl-72 pb-24 lg:pb-8" : "min-h-screen flex items-center justify-center"}`}>
          <div className={`w-full ${!isLogin ? "max-w-5xl mx-auto" : ""}`}>
            {children}
          </div>
        </main>
        <CookieConsent />
      </body>
    </html>
  );
}
