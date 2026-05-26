"use client";

import { useState } from "react";
import { Search, MapPin, Tag, ShieldCheck, DollarSign, Plus, Eye } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

interface MockRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  requesterName: string;
  bankidVerified: boolean;
  createdAt: string;
}

const INITIAL_REQUESTS: MockRequest[] = [
  {
    id: "r1",
    title: "Change Winter Tires on Volvo XC60",
    description: "Need help shifting my winter tires to summer tires. I have all the tools in my garage in Solna. Takes about 30-40 mins max.",
    location: "Stockholm, Solna",
    category: "Automotive",
    price: 600,
    requesterName: "Johan Andersson",
    bankidVerified: true,
    createdAt: "2 hours ago",
  },
  {
    id: "r2",
    title: "Setup Midsummer Party Decorations",
    description: "Looking for someone to help set up lights, table arrangements, and party tents in the garden for a midsummer celebration.",
    location: "Gothenburg, Hisingen",
    category: "Events",
    price: 1800,
    requesterName: "Emma Bergqvist",
    bankidVerified: true,
    createdAt: "4 hours ago",
  },
  {
    id: "r3",
    title: "Assembling IKEA Pax Wardrobe (3 frames)",
    description: "Need an experienced furniture builder to assemble three Pax wardrobes with sliding doors. Requires patience and your own tools.",
    location: "Malmö, Limhamn",
    category: "Furniture Assembly",
    price: 1200,
    requesterName: "Lars Nilsson",
    bankidVerified: false,
    createdAt: "1 day ago",
  },
  {
    id: "r4",
    title: "Hire a Santa Claus (Jultomte) for Christmas Eve",
    description: "Seeking a reliable person to act as Santa Claus, hand out gifts to kids, and wish everyone a Merry Christmas. Suit will be provided.",
    location: "Uppsala, Centrum",
    category: "Entertainment",
    price: 1500,
    requesterName: "Karin Holmgren",
    bankidVerified: true,
    createdAt: "2 days ago",
  },
];

export default function HomeFeed() {
  const { isAuthenticated } = useAuthStore();
  const [requests, setRequests] = useState<MockRequest[]>(INITIAL_REQUESTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === "All" || r.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Automotive", "Events", "Furniture Assembly", "Entertainment"];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden py-12 px-6 sm:px-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-slate-800 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,196,180,0.15),transparent_45%)]" />
        <div className="relative max-w-3xl space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Get help or earn money in{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Sweden
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-xl">
            Post task requests with secure escrow payments, verified BankID profiles, and tax compliance trackers.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/post"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all shadow-lg shadow-teal-500/10"
            >
              <Plus className="w-5 h-5" />
              Post a Request
            </Link>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="px-5 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-slate-700"
              >
                Apply as a Helper
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/40 p-4 rounded-xl border border-slate-900 backdrop-blur-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, city, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-950 border border-slate-800 focus:border-teal-500 focus:outline-none transition-colors placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border ${
                category === cat
                  ? "bg-teal-500 border-teal-500 text-slate-950 shadow-md shadow-teal-500/5"
                  : "bg-slate-950 border-slate-850 hover:bg-slate-900 text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <div
              key={req.id}
              className="glass-card rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 hover:shadow-lg transition-all group duration-300"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-teal-400 border border-slate-700">
                    {req.category}
                  </span>
                  <div className="flex items-center text-orange-400 font-bold text-lg bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20">
                    <DollarSign className="w-4 h-4" />
                    <span>{req.price} SEK</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold group-hover:text-teal-400 transition-colors">
                  {req.title}
                </h3>

                <p className="text-slate-350 text-sm line-clamp-3 leading-relaxed">
                  {req.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-teal-400 text-sm border border-slate-700">
                    {req.requesterName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      {req.requesterName}
                      {req.bankidVerified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-400 fill-teal-400/10" title="BankID Verified Profile" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {req.location}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700" title="View Details">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 text-sm font-bold transition-all shadow-md shadow-teal-500/5"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center space-y-3 bg-slate-900/10 rounded-xl border border-slate-900 border-dashed">
            <Tag className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-slate-300">No requests found</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We couldn't find any requests fitting your filters. Try search adjustments or post your own task!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
