"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { getBookings, payForBooking, completeBooking, cancelBooking, type Booking } from "@/lib/bookings";
import { createReview, getUserReviews, type Review } from "@/lib/reviews";
import { Loader2, MapPin, CreditCard, CheckCircle, XCircle, Calendar, Star, MessageSquare, Send } from "lucide-react";
import Link from "next/link";

export default function BookingsPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [reviewModal, setReviewModal] = useState<{ bookingId: string; helperId: string; helperName: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    Promise.all([getBookings(), getUserReviews(user?.id || "")])
      .then(([b, r]) => { setBookings(b); setReviews(r); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const hasReviewed = (bookingId: string) => reviews.some((r) => r.bookingId === bookingId);

  const handlePay = async (id: string) => {
    setActionLoading(id);
    try {
      const { clientSecret } = await payForBooking(id);
      if (clientSecret) {
        window.location.href = `/bookings?payment_success=${id}`;
      }
    } catch {} finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (id: string) => {
    setActionLoading(id);
    try {
      await completeBooking(id);
      setBookings(await getBookings());
    } catch {} finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      await cancelBooking(id);
      setBookings(await getBookings());
    } catch {} finally {
      setActionLoading(null);
    }
  };

  const handleReview = async () => {
    if (!reviewModal) return;
    setActionLoading(reviewModal.bookingId);
    setReviewMsg("");
    try {
      await createReview(reviewModal.bookingId, { rating, comment: comment || undefined });
      setReviewMsg("Omdöme skickat!");
      const r = await getUserReviews(user?.id || "");
      setReviews(r);
      setTimeout(() => { setReviewModal(null); setRating(5); setComment(""); }, 1500);
    } catch (err: unknown) {
      setReviewMsg(err instanceof Error ? err.message : "Misslyckades");
    } finally {
      setActionLoading(null);
    }
  };

  const isRequesterBooking = (b: Booking) => b.requesterId === user?.id;

  if (loading) {
    return <div className="py-24 text-center"><Loader2 className="h-8 w-8 animate-spin text-brand-accent mx-auto" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">Dina Bokningar</h1>
        <p className="text-xs text-gray-400">Hantera dina aktiva och avslutade uppdrag</p>
      </div>

      {bookings.length === 0 ? (
        <div className="py-16 text-center bg-brand-surface rounded-3xl border border-dashed border-[#44210c]">
          <Calendar className="h-10 w-10 mx-auto text-brand-accent mb-3" />
          <p className="font-extrabold text-sm text-gray-400">Inga bokningar än</p>
          <Link href="/feed" className="text-xs text-brand-accent underline font-bold mt-2 inline-block">Hitta uppdrag</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isRequester = isRequesterBooking(booking);
            const otherParty = isRequester ? booking.helper : booking.requester;
            const reviewed = hasReviewed(booking.id);

            return (
              <div key={booking.id} className="bg-brand-surface border border-[#44210c] rounded-3xl p-5 sm:p-6 space-y-4 hover:border-brand-accent/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <Link href={`/requests/${booking.requestId}`} className="font-extrabold text-white hover:text-brand-accent transition-colors line-clamp-1">
                      {booking.request.title}
                    </Link>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="h-3 w-3" /> {booking.request.location}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-extrabold text-brand-accent">{booking.request.price} kr</p>
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                      booking.status === "COMPLETED" ? "bg-emerald-400/10 text-emerald-400" :
                      booking.status === "CANCELLED" ? "bg-red-400/10 text-red-400" :
                      "bg-amber-400/10 text-amber-400"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-brand-card border border-[#44210c]">
                  <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center font-bold text-brand-accent text-xs">
                    {otherParty.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">{otherParty.name}</p>
                    <p className="text-[10px] text-gray-400">{isRequester ? "Hjälpare" : "Beställare"}</p>
                  </div>
                  {booking.payment && (
                    <span className={`text-[10px] font-bold ${
                      booking.payment.status === "PAID" ? "text-emerald-400" : "text-gray-400"
                    }`}>
                      {booking.payment.status === "PAID" ? "Betald" : booking.payment.status === "REFUNDED" ? "Återbetald" : "Obetald"}
                    </span>
                  )}
                </div>

                {booking.status === "SCHEDULED" && (
                  <div className="flex flex-wrap gap-2">
                    {isRequester && !booking.payment && (
                      <button onClick={() => handlePay(booking.id)} disabled={actionLoading === booking.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-accent text-[#210c00] font-extrabold text-xs hover:brightness-110 disabled:opacity-50 transition-all">
                        <CreditCard className="h-3.5 w-3.5" />
                        {actionLoading === booking.id ? "Bearbetar..." : "Betala"}
                      </button>
                    )}
                    {isRequester && booking.payment && booking.payment.status === "PENDING" && (
                      <button onClick={() => handleComplete(booking.id)} disabled={actionLoading === booking.id}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-extrabold text-xs hover:brightness-110 disabled:opacity-50 transition-all">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {actionLoading === booking.id ? "Bearbetar..." : "Slutför uppdrag"}
                      </button>
                    )}
                    <button onClick={() => handleCancel(booking.id)} disabled={actionLoading === booking.id}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 font-extrabold text-xs hover:bg-red-400/20 disabled:opacity-50 transition-all">
                      <XCircle className="h-3.5 w-3.5" />
                      Avbryt
                    </button>
                  </div>
                )}

                {booking.status === "COMPLETED" && !reviewed && (
                  <button onClick={() => setReviewModal({
                    bookingId: booking.id,
                    helperId: booking.helperId,
                    helperName: booking.helper.name,
                  })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-card border border-[#44210c] text-gray-300 font-bold text-xs hover:border-brand-accent/40 transition-all">
                    <Star className="h-3.5 w-3.5 text-brand-accent" />
                    Skriv omdöme
                  </button>
                )}

                {booking.status === "COMPLETED" && reviewed && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle className="h-3.5 w-3.5" /> Omdöme lämnat
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-brand-surface rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#44210c]">
            <h3 className="text-lg font-bold text-white">Omdöme för {reviewModal.helperName}</h3>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}
                  className={`p-2 rounded-lg transition-all ${n <= rating ? "text-brand-accent" : "text-gray-500"}`}>
                  <Star className="h-8 w-8" fill={n <= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Dela din upplevelse (valfritt)..."
              rows={3} className="w-full px-3 py-2 rounded-lg bg-brand-card border border-[#44210c] focus:border-brand-accent focus:outline-none text-sm text-white placeholder-gray-400 resize-none" />
            {reviewMsg && (
              <p className={`text-sm font-medium ${reviewMsg.includes("skickat") ? "text-emerald-400" : "text-red-400"}`}>{reviewMsg}</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setReviewModal(null)} className="flex-1 py-2.5 rounded-lg bg-brand-card border border-[#44210c] text-gray-300 font-bold">Avbryt</button>
              <button onClick={handleReview} disabled={actionLoading === reviewModal.bookingId}
                className="flex-1 py-2.5 rounded-lg bg-brand-accent text-[#210c00] font-bold hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2">
                {actionLoading === reviewModal.bookingId ? "Skickar..." : <>
                  <Send className="h-4 w-4" /> Skicka
                </>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
