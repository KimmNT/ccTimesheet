import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  userId: string;
  userEmail: string;
  role: string;
  userName?: string;
  // Add any other user fields from your Firestore document
}

interface UserStore {
  user: UserData | null;
  setUser: (userData: UserData) => void;
  clearUser: () => void;
  isAuthenticated: boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "user-storage", // localStorage key
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
