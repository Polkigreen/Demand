"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { MapPin, BadgeCheck, Clock, ArrowLeft, Loader2, Check, X, User, Star, Send } from "lucide-react";
import { fetchRequest, type RequestItem } from "@/lib/requests";
import { getApplications, applyToRequest, acceptApplication, rejectApplication, type Application } from "@/lib/applications";
import Link from "next/link";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = user?.id === request?.requester?.id;
  const isHelper = user?.roles?.includes("HELPER");
  const hasApplied = applications.some((a) => a.helperId === user?.id);

  const [showApply, setShowApply] = useState(false);
  const [priceProposal, setPriceProposal] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applyMsg, setApplyMsg] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetchRequest(id),
      getApplications(id),
    ])
      .then(([req, apps]) => {
        setRequest(req);
        setApplications(apps);
      })
      .catch(() => setError("Kunde inte ladda annonsen"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!id) return;
    setAppLoading(true);
    setApplyMsg("");
    try {
      await applyToRequest(id, {
        priceProposal: priceProposal ? Number(priceProposal) : undefined,
        coverLetter: coverLetter || undefined,
      });
      setApplyMsg("Ansökan skickad!");
      setTimeout(() => { setShowApply(false); setPriceProposal(""); setCoverLetter(""); }, 1500);
      const apps = await getApplications(id);
      setApplications(apps);
    } catch (err: unknown) {
      setApplyMsg(err instanceof Error ? err.message : "Misslyckades");
    } finally {
      setAppLoading(false);
    }
  };

  const handleAccept = async (appId: string) => {
    try {
      await acceptApplication(appId);
      const apps = await getApplications(id);
      setApplications(apps);
    } catch {}
  };

  const handleReject = async (appId: string) => {
    try {
      await rejectApplication(appId);
      const apps = await getApplications(id);
      setApplications(apps);
    } catch {}
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent mx-auto" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="py-24 text-center text-gray-400">
        <p className="font-bold">{error || "Annonsen finns inte"}</p>
        <Link href="/feed" className="text-brand-accent text-sm underline mt-2 inline-block">Tillbaka till feed</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Tillbaka
      </button>

      <div className="bg-brand-surface border border-[#44210c] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-brand-accent-faded text-brand-accent text-xs font-extrabold uppercase">
                {request.category}
              </span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase ${
                request.status === "OPEN" ? "bg-emerald-400/10 text-emerald-400" : "bg-gray-400/10 text-gray-400"
              }`}>
                {request.status}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">{request.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-brand-accent">{request.price} kr</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{request.description}</p>

        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-accent" /> {request.location}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-brand-accent" /> {new Date(request.createdAt).toLocaleDateString("sv-SE")}</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-card border border-[#44210c]">
          <div className="w-9 h-9 rounded-full bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-sm">
            {request.requester.name[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              {request.requester.name}
              {request.requester.bankidVerified && <BadgeCheck className="h-4 w-4 text-brand-accent" />}
            </p>
            <p className="text-[10px] text-gray-400">Annonsör</p>
          </div>
        </div>

        {!isOwner && isHelper && !hasApplied && request.status === "OPEN" && (
          <button onClick={() => setShowApply(true)}
            className="w-full py-3 rounded-xl bg-brand-accent text-[#210c00] font-extrabold hover:brightness-110 transition-all">
            Ansök för detta uppdrag
          </button>
        )}

        {hasApplied && (
          <div className="p-4 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center gap-3">
            <Check className="h-5 w-5 text-emerald-400" />
            <p className="text-sm font-semibold text-emerald-400">Du har redan ansökt</p>
          </div>
        )}
      </div>

      {isOwner && applications.length > 0 && (
        <div className="bg-brand-surface border border-[#44210c] rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="font-extrabold text-white uppercase tracking-wider">Ansökningar ({applications.length})</h2>
          <div className="divide-y divide-[#44210c]/40">
            {applications.map((app) => (
              <div key={app.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent">
                    {app.helper.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                      {app.helper.name}
                      {app.helper.bankidVerified && <BadgeCheck className="h-3.5 w-3.5 text-brand-accent" />}
                    </p>
                    {app.priceProposal && <p className="text-xs text-brand-accent font-bold">{app.priceProposal} kr</p>}
                    {app.coverLetter && <p className="text-xs text-gray-400 mt-0.5">{app.coverLetter}</p>}
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      <span className={`font-semibold ${
                        app.status === "PENDING" ? "text-amber-400" : app.status === "ACCEPTED" ? "text-emerald-400" : "text-red-400"
                      }`}>{app.status}</span>
                    </p>
                  </div>
                </div>
                {app.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAccept(app.id)} className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20 transition-colors">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleReject(app.id)} className="p-2 rounded-lg bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwner && applications.length === 0 && request.status === "OPEN" && (
        <div className="bg-brand-surface border border-[#44210c] rounded-3xl p-6 text-center text-gray-400">
          <User className="h-8 w-8 mx-auto mb-2 text-brand-accent" />
          <p className="text-sm font-bold">Inga ansökningar än</p>
          <p className="text-xs">Vänta på att hjälpare söker ditt uppdrag</p>
        </div>
      )}

      {showApply && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#44210c]">
            <h3 className="text-lg font-bold text-white">Ansök för uppdrag</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Prisförslag (SEK, valfritt)</label>
                <input type="number" value={priceProposal} onChange={(e) => setPriceProposal(e.target.value)} placeholder="t.ex. 500"
                  className="w-full px-3 py-2 rounded-lg bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-sm text-white placeholder-gray-400" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 block mb-1">Personligt brev (valfritt)</label>
                <textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Berätta varför du passar..."
                  rows={3} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-sm text-white placeholder-gray-400 resize-none" />
              </div>
            </div>
            {applyMsg && (
              <p className={`text-sm font-medium ${applyMsg.includes("skickad") ? "text-emerald-400" : "text-red-400"}`}>{applyMsg}</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setShowApply(false)} className="flex-1 py-2.5 rounded-lg bg-brand-card border border-[#44210c] text-gray-300 font-bold">Avbryt</button>
              <button onClick={handleApply} disabled={appLoading}
                className="flex-1 py-2.5 rounded-lg bg-brand-accent text-[#210c00] font-bold hover:brightness-110 disabled:opacity-50">
                {appLoading ? "Skickar..." : "Skicka ansökan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
