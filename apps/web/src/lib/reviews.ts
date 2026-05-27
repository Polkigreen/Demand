import { api } from "./api";

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: { id: string; name: string };
  reviewee: { id: string; name: string };
  booking?: { request: { title: string } };
}

export function createReview(bookingId: string, data: { rating: number; comment?: string }) {
  return api<Review>(`/reviews/booking/${bookingId}`, {
    method: "POST",
    body: data,
  });
}

export function getUserReviews(userId: string) {
  return api<Review[]>(`/reviews/user/${userId}`);
}

export function getUserRating(userId: string) {
  return api<{ average: number; count: number }>(`/reviews/user/${userId}/rating`);
}
