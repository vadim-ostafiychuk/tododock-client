import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set) => ({
      token: null,
      logout: () => set(() => ({ token: null })),
      setToken: (token) => set(() => ({ token })),
    }),
    {
      name: "auth",
      getStorage: () => localStorage,
    }
  )
);
