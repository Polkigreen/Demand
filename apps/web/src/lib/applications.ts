import { api } from "./api";

export interface Application {
  id: string;
  requestId: string;
  helperId: string;
  status: string;
  priceProposal?: number;
  coverLetter?: string;
  createdAt: string;
  helper: {
    id: string;
    name: string;
    bankidVerified: boolean;
    avatarUrl?: string;
  };
}

export function getApplications(requestId: string) {
  return api<Application[]>(`/applications/request/${requestId}`);
}

export function applyToRequest(requestId: string, data: { priceProposal?: number; coverLetter?: string }) {
  return api<Application>(`/applications/request/${requestId}`, {
    method: "POST",
    body: data,
  });
}

export function acceptApplication(id: string) {
  return api<unknown>(`/applications/${id}/accept`, { method: "POST" });
}

export function rejectApplication(id: string) {
  return api<unknown>(`/applications/${id}/reject`, { method: "POST" });
}
