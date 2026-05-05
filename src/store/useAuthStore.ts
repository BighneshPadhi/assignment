import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
};

type AuthState = {
  token?: string;
  user?: AuthUser;
  setToken: (token?: string) => void;
  setUser: (user?: AuthUser) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clear: () => set({ token: undefined, user: undefined }),
    }),
    {
      name: "auth-storage",
    }
  )
);
