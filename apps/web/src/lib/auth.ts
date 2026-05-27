import { api } from "./api";

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    name: string;
    roles: string[];
    bankidVerified: boolean;
    avatarUrl?: string;
  };
}

export function loginEmail(email: string, password: string) {
  return api<LoginResponse>("/auth/email/login", {
    method: "POST",
    body: { email, password },
  });
}

export function registerEmail(name: string, email: string, password: string) {
  return api<LoginResponse>("/auth/email/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export function googleAuth(idToken: string, email?: string, name?: string) {
  return api<LoginResponse>("/auth/google", {
    method: "POST",
    body: { idToken, email, name },
  });
}

export function refreshToken(token: string) {
  return api<LoginResponse>("/auth/refresh", {
    method: "POST",
    body: { refreshToken: token },
  });
}
