import { api } from "./api";

export interface RequestItem {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  status: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  requester: {
    id: string;
    name: string;
    bankidVerified: boolean;
  };
}

export interface NearbyQuery {
  lat: number;
  lng: number;
  radius?: number;
}

export function fetchRequests() {
  return api<RequestItem[]>("/requests");
}

export function fetchRequest(id: string) {
  return api<RequestItem>(`/requests/${id}`);
}

export function fetchNearbyRequests(params: NearbyQuery) {
  const query = new URLSearchParams({
    lat: params.lat.toString(),
    lng: params.lng.toString(),
    radius: (params.radius ?? 10).toString(),
  });
  return api<RequestItem[]>(`/requests/nearby?${query}`);
}

export interface CreateRequestDto {
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  latitude?: number;
  longitude?: number;
}

export function createRequest(data: CreateRequestDto) {
  return api<RequestItem>("/requests", {
    method: "POST",
    body: data,
  });
}

export function updateRequest(id: string, data: Partial<CreateRequestDto>) {
  return api<RequestItem>(`/requests/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteRequest(id: string) {
  return api<void>(`/requests/${id}`, { method: "DELETE" });
}
