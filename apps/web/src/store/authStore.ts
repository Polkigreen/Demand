import { create } from 'zustand';

export interface UserState {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  roles: string[];
  bankidVerified: boolean;
  avatarUrl?: string;
  personnummer?: string;
  hasFskatt?: boolean;
  orgNumber?: string;
  vatNumber?: string;
}

interface AuthState {
  user: UserState | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserState, accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<UserState>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setAuth: (user, accessToken, refreshToken) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, accessToken, refreshToken, isAuthenticated: true });
  },

  updateUser: (updatedUser) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedUser };
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newUser));
      }
      return { user: newUser };
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
  },
}));

if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userStr = localStorage.getItem('user');

  if (accessToken && refreshToken && userStr) {
    try {
      const user = JSON.parse(userStr);
      useAuthStore.setState({ user, accessToken, refreshToken, isAuthenticated: true });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
}
