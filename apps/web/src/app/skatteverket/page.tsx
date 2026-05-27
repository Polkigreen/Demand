"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Scale,
  TrendingUp,
  Download,
  AlertCircle,
  CheckCircle2,
  Receipt,
  User,
  CalendarDays,
  Info,
  Loader2,
} from "lucide-react";
import { fetchHelperReport, fetchRequesterReport, type HelperReport, type RequesterReport } from "@/lib/tax";

const HOBBYVERKSAMHET_LIMIT = 24300;
const KU30_LIMIT_PER_PERSON = 10000;
const VAT_LIMIT = 120000;

export default function SkatteverketPage() {
  const { user } = useAuthStore();
  const isHelper = user?.roles?.includes("HELPER");
  const isRequester = user?.roles?.includes("REQUESTER");

  const [tab, setTab] = useState<"helper" | "requester">(isHelper ? "helper" : "requester");
  const [helperReport, setHelperReport] = useState<HelperReport | null>(null);
  const [requesterReport, setRequesterReport] = useState<RequesterReport | null>(null);
  const [helperLoading, setHelperLoading] = useState(!isHelper);
  const [requesterLoading, setRequesterLoading] = useState(!isRequester);
  const [helperYear, setHelperYear] = useState(new Date().getFullYear());
  const [requesterYear, setRequesterYear] = useState(new Date().getFullYear());

  const loadHelperReport = useCallback(async (year: number) => {
    setHelperLoading(true);
    try {
      const report = await fetchHelperReport(year);
      setHelperReport(report);
    } catch {} finally {
      setHelperLoading(false);
    }
  }, []);

  const loadRequesterReport = useCallback(async (year: number) => {
    setRequesterLoading(true);
    try {
      const report = await fetchRequesterReport(year);
      setRequesterReport(report);
    } catch {} finally {
      setRequesterLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isHelper) loadHelperReport(helperYear);
    if (isRequester) loadRequesterReport(requesterYear);
  }, [isHelper, isRequester, helperYear, requesterYear, loadHelperReport, loadRequesterReport]);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  const exportCSV = (type: "helper" | "requester") => {
    const report = type === "helper" ? helperReport : requesterReport;
    if (!report) return;

    const headers = type === "helper"
      ? ["Requester", "Amount (SEK)", "Requires KU30"]
      : ["Helper", "Amount (SEK)", "Requires KU30"];

    const rows = report.records.map((r: any) =>
      type === "helper"
        ? [`"${r.requesterName}"`, r.amount, r.exceedsKu30Limit || r.requiresKu30 ? "Yes" : "No"]
        : [`"${r.helperName}"`, r.amount, r.requiresKu30 ? "Yes" : "No"]
    );

    const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}-report-${report.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#44210c] pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight uppercase font-display flex items-center gap-3">
            <Scale className="h-7 w-7 text-brand-accent" />
            Skatteverket
          </h1>
          <p className="text-xs text-gray-400">
            Inkomstredovisning och deklarationshjälp för din hobbyverksamhet
          </p>
        </div>
        <div className="bg-brand-surface p-1 rounded-2xl flex border border-[#44210c]">
          {isHelper && (
            <button type="button" onClick={() => setTab("helper")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                tab === "helper" ? "bg-brand-accent text-[#210c00]" : "text-gray-300 hover:text-white"
              }`}>
              Helper (T2)
            </button>
          )}
          {isRequester && (
            <button type="button" onClick={() => setTab("requester")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 ${
                tab === "requester" ? "bg-brand-accent text-[#210c00]" : "text-gray-300 hover:text-white"
              }`}>
              Requester (KU30)
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {tab === "helper" && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <CalendarDays className="h-4 w-4 text-brand-accent" />
                <select
                  value={helperYear}
                  onChange={(e) => setHelperYear(Number(e.target.value))}
                  className="bg-brand-surface border border-[#44210c] text-white text-sm rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {helperLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-accent mx-auto" />
                </div>
              ) : helperReport ? (
                <div className="bg-brand-surface border border-[#44210c] rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-[#44210c]/40">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-accent" />
                        Inkomstredovisning {helperReport.year}
                      </h3>
                      <button
                        onClick={() => exportCSV("helper")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-card border border-[#44210c] text-xs font-bold text-gray-300 hover:text-white transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </button>
                    </div>

                    <div className={`p-4 rounded-2xl border ${
                      helperReport.mayRequireVatRegistration
                        ? "bg-red-400/10 border-red-400/20"
                        : helperReport.requiresT2Declaration
                        ? "bg-amber-400/10 border-amber-400/20"
                        : "bg-emerald-400/10 border-emerald-400/20"
                    }`}>
                      {helperReport.mayRequireVatRegistration ? (
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                      ) : helperReport.requiresT2Declaration ? (
                        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-extrabold text-sm text-white">
                          Totala intäkter: <span className="text-brand-accent">{helperReport.totalEarnings.toLocaleString()} SEK</span>
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {helperReport.mayRequireVatRegistration
                            ? `Över momsgränsen (${VAT_LIMIT.toLocaleString()} SEK). Du kan behöva registrera dig för moms.`
                            : helperReport.requiresT2Declaration
                            ? `Över hobbygränsen (${HOBBYVERKSAMHET_LIMIT.toLocaleString()} SEK). Deklarera överskottet på blankett T2 (SKV 2051).`
                            : `Under hobbygränsen (${HOBBYVERKSAMHET_LIMIT.toLocaleString()} SEK). Kan vara skattefritt. Om underskott (förlust) behöver du inte deklarera.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-[#44210c]/40">
                    {helperReport.records.length === 0 ? (
                      <p className="p-6 text-sm text-gray-400 text-center">Inga transaktioner detta år.</p>
                    ) : (
                      helperReport.records.map((rec, i) => (
                        <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-brand-card/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-brand-accent" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{rec.requesterName}</p>
                              <p className="text-[10px] text-gray-400">{rec.requesterId.slice(0, 8)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-sm text-white">{rec.amount.toLocaleString()} SEK</p>
                            <p className={`text-[10px] font-semibold ${rec.exceedsKu30Limit ? "text-amber-400" : "text-emerald-400"}`}>
                              {rec.exceedsKu30Limit ? "KU30 krävs" : "Under KU30-gräns"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400 text-sm">
                  Kunde inte ladda rapporten. Försök igen.
                </div>
              )}
            </>
          )}

          {tab === "requester" && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <CalendarDays className="h-4 w-4 text-brand-accent" />
                <select
                  value={requesterYear}
                  onChange={(e) => setRequesterYear(Number(e.target.value))}
                  className="bg-brand-surface border border-[#44210c] text-white text-sm rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                >
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {requesterLoading ? (
                <div className="py-16 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-accent mx-auto" />
                </div>
              ) : requesterReport ? (
                <div className="bg-brand-surface border border-[#44210c] rounded-3xl overflow-hidden">
                  <div className="p-6 border-b border-[#44210c]/40">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-brand-accent" />
                        Utbetalningsredovisning {requesterReport.year}
                      </h3>
                      <button
                        onClick={() => exportCSV("requester")}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-card border border-[#44210c] text-xs font-bold text-gray-300 hover:text-white transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-card border border-[#44210c] flex items-start gap-3">
                      <Info className="h-5 w-5 text-brand-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold text-sm text-white">
                          Totalt betalat: <span className="text-brand-accent">{requesterReport.totalPaid.toLocaleString()} SEK</span>
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          {requesterReport.totalPaid >= KU30_LIMIT_PER_PERSON
                            ? "Du har betalat över 10 000 SEK till en eller flera personer. KU30-blankett kan behövas."
                            : "Alla betalningar under 10 000 SEK per person. Ingen KU30 krävs."}
                        </p>
                      </div>
                    </div>

                    {requesterReport.records.some((r) => r.requiresKu30) && (
                      <div className="mx-6 mt-4 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-300">
                          <span className="font-bold text-white">RUT/ROT-avdrag:</span> Om tjänsten är RUT- eller ROT-berättigad kan du dra av
                          upp till 50 000 SEK per år. Tala med din utförare om de har F-skatt.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="divide-y divide-[#44210c]/40">
                    {requesterReport.records.length === 0 ? (
                      <p className="p-6 text-sm text-gray-400 text-center">Inga transaktioner detta år.</p>
                    ) : (
                      requesterReport.records.map((rec, i) => (
                        <div key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-brand-card/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-brand-accent" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{rec.helperName}</p>
                              <p className="text-[10px] text-gray-400">{rec.helperId.slice(0, 8)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-sm text-white">{rec.amount.toLocaleString()} SEK</p>
                            <p className={`text-[10px] font-semibold ${rec.requiresKu30 ? "text-amber-400" : "text-emerald-400"}`}>
                              {rec.requiresKu30 ? "KU30 krävs" : "OK"}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-400 text-sm">
                  Kunde inte ladda rapporten. Försök igen.
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-brand-surface border border-[#44210c] p-5 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Scale className="h-4 w-4 text-brand-accent" />
              Hobbyverksamhet
            </h3>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                Hobbyverksamhet är skattefri upp till <span className="font-bold text-white">{HOBBYVERKSAMHET_LIMIT.toLocaleString()} SEK</span> per år (2026).
              </p>
              <p>
                När du tjänar över gränsen deklarerar du <span className="font-bold text-white">överskottet</span> på blankett <span className="font-bold text-white">T2 (SKV 2051)</span>.
              </p>
              <p>
                Har du flera hobbyverksamheter? Redovisa varje verksamhet för sig på en egen blankett.
              </p>
              <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                <p className="text-gray-400">
                  <span className="font-bold text-white">Förlust (underskott):</span> Om hobbyverksamheten gått med förlust behöver du inte deklarera alls.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface border border-[#44210c] p-5 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-brand-accent" />
              Moms (VAT)
            </h3>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                Sålde du för mer än <span className="font-bold text-white">{VAT_LIMIT.toLocaleString()} SEK</span> under inkomståret kan det vara aktuellt att registrera sig för moms.
              </p>
              <p className="text-gray-400">
                Gränsen gäller per beskattningsår. Registrering sker hos Skatteverket.
              </p>
            </div>
          </div>

          <div className="bg-brand-surface border border-[#44210c] p-5 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Info className="h-4 w-4 text-brand-accent" />
              RUT & ROT
            </h3>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
              <p>
                Köpare kan få skattereduktion för:
              </p>
              <ul className="space-y-1 text-gray-400">
                <li><span className="font-bold text-white">RUT:</span> 50% av arbetskostnad (städ, barnpassning)</li>
                <li><span className="font-bold text-white">ROT:</span> 30% av arbetskostnad (renovering, reparation)</li>
              </ul>
              <p className="text-gray-500">
                Kräver att utföraren har F-skatt och att betalningen sker direkt.
              </p>
            </div>
          </div>

          <div className="bg-brand-surface border border-[#44210c] p-5 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Download className="h-4 w-4 text-brand-accent" />
              Deklarationsdata
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <p className="text-gray-400">
                Ladda ner CSV för att importera i ditt bokföringsprogram eller Skatteverkets e-tjänst.
              </p>
              <div className="flex gap-2">
                {isHelper && (
                  <button
                    onClick={() => exportCSV("helper")}
                    className="flex-1 py-2 rounded-lg bg-brand-accent text-[#210c00] font-bold text-xs transition-all hover:brightness-110"
                  >
                    Hämta T2-data
                  </button>
                )}
                {isRequester && (
                  <button
                    onClick={() => exportCSV("requester")}
                    className="flex-1 py-2 rounded-lg bg-brand-accent text-[#210c00] font-bold text-xs transition-all hover:brightness-110"
                  >
                    Hämta KU30-data
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
