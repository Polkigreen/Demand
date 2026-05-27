import { api } from "./api";

export interface Booking {
  id: string;
  requestId: string;
  requesterId: string;
  helperId: string;
  status: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  request: { id: string; title: string; price: number; category: string; location: string };
  requester: { id: string; name: string; bankidVerified: boolean };
  helper: { id: string; name: string; bankidVerified: boolean };
  payment?: { id: string; status: string; amount: number };
}

export function getBookings() {
  return api<Booking[]>("/bookings");
}

export function payForBooking(id: string) {
  return api<{ paymentIntentId: string; clientSecret: string }>(`/bookings/${id}/pay`, {
    method: "POST",
  });
}

export function completeBooking(id: string) {
  return api<Booking>(`/bookings/${id}/complete`, { method: "POST" });
}

export function cancelBooking(id: string) {
  return api<Booking>(`/bookings/${id}/cancel`, { method: "POST" });
}
