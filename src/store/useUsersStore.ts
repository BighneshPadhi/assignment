import { create } from "zustand";
import { fetchJson } from "@/lib/api";

type Company = { name: string };

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  company: Company;
  image?: string;
  username: string;
  address?: {
    address: string;
    city: string;
    state: string;
  };
};

type UsersResponse = {
  users: User[];
  total: number;
  limit: number;
  skip: number;
};

type UsersState = {
  list: User[];
  total: number;
  loading: boolean;
  error?: string;
  cache: Record<string, UsersResponse>;
  userCache: Record<number, User>;
  fetchUsers: (params: { limit: number; skip: number; query: string }) => Promise<void>;
  fetchUser: (id: number) => Promise<User | undefined>;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  list: [],
  total: 0,
  loading: false,
  error: undefined,
  cache: {},
  userCache: {},
  fetchUsers: async ({ limit, skip, query }) => {
    const key = `users:${limit}:${skip}:${query}`;
    const cached = get().cache[key];

    // Cache list results to reduce repeated API calls and keep pagination/snappy filters fast.
    if (cached) {
      set({ list: cached.users, total: cached.total, error: undefined });
      return;
    }

    set({ loading: true, error: undefined });

    try {
      const response = query.trim()
        ? await fetchJson<UsersResponse>(
            `/users/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
          )
        : await fetchJson<UsersResponse>(`/users?limit=${limit}&skip=${skip}`);

      set((state) => ({
        list: response.users,
        total: response.total,
        cache: { ...state.cache, [key]: response },
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load users",
        loading: false,
      });
    }
  },
  fetchUser: async (id) => {
    const cached = get().userCache[id];
    if (cached) {
      return cached;
    }

    try {
      const user = await fetchJson<User>(`/users/${id}`);
      set((state) => ({
        userCache: { ...state.userCache, [id]: user },
      }));
      return user;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load user" });
      return undefined;
    }
  },
}));

export type { User };
