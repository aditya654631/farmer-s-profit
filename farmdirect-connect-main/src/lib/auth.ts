// Demo-only auth store. Persists a fake "account" in localStorage.
// No real backend — for hackathon demo purposes only.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "farmer" | "consumer" | "admin";

export type Account = {
  id: string;
  name: string;
  phone: string;
  role: Role;
  village?: string;
  createdAt: number;
};

type AuthState = {
  user: Account | null;
  accounts: Account[]; // local "directory" of signed-up users
  signup: (data: Omit<Account, "id" | "createdAt">) => Account;
  login: (phone: string, role?: Role) => Account | null;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      signup: (data) => {
        const account: Account = {
          ...data,
          id: `u_${Date.now().toString(36)}`,
          createdAt: Date.now(),
        };
        set((s) => ({
          accounts: [...s.accounts.filter((a) => a.phone !== data.phone), account],
          user: account,
        }));
        return account;
      },
      login: (phone, role) => {
        const existing = get().accounts.find(
          (a) => a.phone === phone && (!role || a.role === role),
        );
        if (existing) {
          set({ user: existing });
          return existing;
        }
        return null;
      },
      logout: () => set({ user: null }),
    }),
    { name: "kisankart-auth" },
  ),
);

export const roleHome: Record<Role, string> = {
  farmer: "/farmer",
  consumer: "/market",
  admin: "/admin",
};
