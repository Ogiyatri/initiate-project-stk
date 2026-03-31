import { create } from "zustand";
import { User } from "@/types/login";

export const SESSION_COOKIE_NAME = "accessToken";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  initializeFromStorage: () => void;
}

function setCookie(name: string, value: string, days = 7): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),

  setAccessToken: (token) => {
    if (token) {
      setCookie(SESSION_COOKIE_NAME, token);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(SESSION_COOKIE_NAME, token);
      }
    } else {
      deleteCookie(SESSION_COOKIE_NAME);
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(SESSION_COOKIE_NAME);
      }
    }
    set({ accessToken: token });
  },

  logout: () => {
    deleteCookie(SESSION_COOKIE_NAME);
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(SESSION_COOKIE_NAME);
      localStorage.removeItem("user");
    }
    set({ user: null, accessToken: null });
  },

  initializeFromStorage: () => {
    if (typeof localStorage === "undefined") return;
    const token = localStorage.getItem(SESSION_COOKIE_NAME);
    const userStr = localStorage.getItem("user");
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    if (token) {
      setCookie(SESSION_COOKIE_NAME, token);
    }
    set({ accessToken: token, user });
  },
}));
