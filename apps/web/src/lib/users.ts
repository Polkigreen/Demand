import { api } from "./api";

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  roles: string[];
  bankidVerified: boolean;
  avatarUrl?: string;
}

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  phone?: string;
  hasFskatt?: boolean;
  orgNumber?: string;
  vatNumber?: string;
}

export function fetchProfile() {
  return api<UserProfile>("/users/me");
}

export function updateProfile(data: UpdateProfileDto) {
  return api<UserProfile>("/users/me", {
    method: "PATCH",
    body: data,
  });
}
