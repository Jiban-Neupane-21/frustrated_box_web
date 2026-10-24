import type { User } from "@/types/auth";
import type { Confession, ProfileStats, ActivityItem } from "./types";

// ============================================================
// 1. CONTRACT: Both mock and real API implement this interface
// viewerId = the logged-in user viewing the profile. In the real API,
// the server determines this from the session token.
// ============================================================

export interface ProfileApi {
  getUserByUsername(username: string): Promise<User | null>;
  getPublicVents(userId: string): Promise<Confession[]>;
  getPrivateVents(userId: string, viewerId?: string): Promise<Confession[]>;
  getUserStats(userId: string, viewerId?: string): Promise<ProfileStats>;
  getSavedVents(userId: string, viewerId?: string): Promise<Confession[]>;
  getUserActivity(userId: string, viewerId?: string): Promise<ActivityItem[]>;
}

// ============================================================
// 2. HELPERS
// ============================================================

function normalizeUsername(raw: string): string {
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    // Malformed URI sequence: fallback to raw string
  }
  return value.replace(/^@/, "").trim().toLowerCase();
}

// ============================================================
// 3. HTTP ADAPTER (Real backend API)
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include", // Cookie session auth. Use Authorization header if JWT.
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return (await res.json()) as T;
}

const httpProfileApi: ProfileApi = {
  async getUserByUsername(username) {
    const clean = normalizeUsername(username);
    const res = await fetch(
      `${API_URL}/users/by-username/${encodeURIComponent(clean)}`,
      { credentials: "include" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API ${res.status}: user lookup`);
    return (await res.json()) as User;
  },

  getPublicVents: (userId) =>
    request<Confession[]>(`/users/${userId}/confessions?visibility=public`),

  // Server inspects session/token: viewerId is not required as query param
  getPrivateVents: (userId) =>
    request<Confession[]>(`/users/${userId}/confessions?visibility=private`),

  getUserStats: (userId) => request<ProfileStats>(`/users/${userId}/stats`),

  getSavedVents: (userId) =>
    request<Confession[]>(`/users/${userId}/saved`),

  getUserActivity: (userId) =>
    request<ActivityItem[]>(`/users/${userId}/activity`),
};

// ============================================================
// 5. SWITCH: Set NEXT_PUBLIC_USE_MOCK=false in .env to use real API
// ============================================================

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Lazy proxy: defers mock import until first call.
// In production (USE_MOCK=false), mockApi.ts is never imported.
let mockApiPromise: Promise<ProfileApi> | null = null;

async function getMockApi(): Promise<ProfileApi> {
  if (!mockApiPromise) {
    mockApiPromise = import("./mockApi").then((m) => m.mockProfileApi);
  }
  return mockApiPromise;
}

const profileApi: ProfileApi = USE_MOCK
  ? new Proxy({} as ProfileApi, {
      get(_, prop) {
        return async (...args: unknown[]) => {
          const api = await getMockApi();
          return (api as unknown as Record<string, (...args: unknown[]) => Promise<unknown>>)[prop as string](...args);
        };
      },
    })
  : httpProfileApi;

// UI components import these functions directly
export const getUserByUsername = profileApi.getUserByUsername;
export const getPublicVents = profileApi.getPublicVents;
export const getPrivateVents = profileApi.getPrivateVents;
export const getUserStats = profileApi.getUserStats;
export const getSavedVents = profileApi.getSavedVents;
export const getUserActivity = profileApi.getUserActivity;