"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  Home,
  ListTodo,
  PlusCircle,
  MessageSquare,
  User,
  Hammer,
  Scale,
  Calendar,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Discover Help", icon: Home, match: ["/", "/category"] },
  { href: "/feed", label: "Demand Feed", icon: ListTodo, match: ["/feed"] },
  { href: "/post", label: "Post a Request", icon: PlusCircle, match: ["/post"] },
  { href: "/bookings", label: "My Bookings", icon: Calendar, match: ["/bookings"] },
  { href: "/chat", label: "Messaging", icon: MessageSquare, match: ["/chat"] },
  { href: "/profile", label: "Helper Profile", icon: User, match: ["/profile"] },
  { href: "/skatteverket", label: "Skatteverket", icon: Scale, match: ["/skatteverket"] },
] as const;

export default function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  const isActive = (matches: readonly string[]) =>
    matches.some((m) => pathname === m || pathname.startsWith(m + "/"));

  if (!isAuthenticated && pathname !== "/login") return null;
  if (pathname === "/login") return null;

  return (
    <>
      <aside className="fixed left-0 top-0 bottom-0 z-40 hidden h-screen w-72 flex-col border-r border-[#44210c] bg-brand-surface py-6 px-4 lg:flex shadow-2xl">
        <div className="px-4 mb-2 flex items-center gap-3">
          <div className="p-2 bg-brand-accent-faded rounded-xl">
            <Hammer className="h-6 w-6 text-brand-accent" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white">Demand</h1>
            <p className="text-xs text-brand-accent font-semibold tracking-wider uppercase">Nordic Pulse</p>
          </div>
        </div>

        <div className="mt-8 px-2">
          <div className="flex items-center gap-3 p-3 bg-brand-card rounded-2xl border border-[#44210c] mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 border-2 border-brand-accent flex items-center justify-center font-bold text-brand-accent">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Welcome back</p>
              <p className="text-sm font-bold text-white">{user?.name || "User"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex w-full items-center gap-4 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  active
                    ? "bg-brand-accent text-white shadow-lg shadow-brand-accent/20"
                    : "text-gray-300 hover:bg-brand-card hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-2">
          <Link
            href="/post"
            className="w-full bg-white text-brand-bg font-extrabold py-3.5 px-4 rounded-xl shadow-xl hover:bg-opacity-90 active:scale-[0.98] transition-all text-xs uppercase tracking-wider block text-center"
          >
            Post a Request
          </Link>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-brand-surface/90 backdrop-blur-xl border-t border-[#44210c] px-2 py-3 lg:hidden shadow-2xl rounded-t-2xl">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.match);
          const isCreate = item.href === "/post";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl active:scale-95 transition-transform ${
                active ? "bg-brand-accent text-white font-extrabold" : "text-gray-400 font-medium"
              }`}
            >
              <Icon className={`h-5 w-5 ${isCreate ? "text-brand-accent" : ""}`} />
              <span className="text-[10px] sm:text-[11px] mt-0.5">{item.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
