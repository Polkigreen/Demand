"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Briefcase, MessageSquare, PlusCircle, User, LogOut, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import "../app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 glass-nav backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-teal-400 via-emerald-400 to-orange-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity">
                Demand
              </Link>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                Sweden SE
              </span>
            </div>

            <nav className="flex items-center gap-1 sm:gap-4">
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-slate-800 text-teal-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden md:inline">Feed</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/post"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/post"
                        ? "bg-slate-800 text-teal-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span className="hidden md:inline">Post Task</span>
                  </Link>

                  <Link
                    href="/chat"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/chat"
                        ? "bg-slate-800 text-teal-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden md:inline">Chat</span>
                  </Link>

                  <Link
                    href="/profile"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/profile"
                        ? "bg-slate-800 text-teal-400"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">Profile</span>
                  </Link>
                </>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold flex items-center gap-1 text-slate-200">
                      {user?.name}
                      {user?.bankidVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 fill-teal-400/20" />
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {user?.roles.join(" / ").toLowerCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 transition-all shadow-md shadow-teal-500/10"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 py-8 bg-slate-950 text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm">© 2026 Demand SE. Built for Hobbyverksamhet compliance.</span>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-slate-300">Terms</a>
              <a href="#" className="hover:text-slate-300">Privacy Policy (GDPR)</a>
              <a href="#" className="hover:text-slate-300">Skatteverket Guide</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
