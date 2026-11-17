// lib/userService.ts
import { ManagedUser, UserFilters, UserRole, UserStatus } from "@/types/user-management.type";

const STORAGE_KEY = "fb_admin_users";
const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_URL);
const REAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/admin/users";

// Initial seed data from user-store
const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr_01",
    name: "Jiban Neupane",
    username: "jiban",
    email: "jiban@example.com",
    role: "ADMIN",
    status: "active",
    joinedAt: "2025-08-10T10:00:00Z",
  },
  {
    id: "usr_02",
    name: "Sita Sharma",
    username: "sita_mod",
    email: "sita@example.com",
    role: "MODERATOR",
    status: "active",
    joinedAt: "2025-09-12T14:30:00Z",
  },
  {
    id: "usr_03",
    name: "Ram Thapa",
    username: "ramthapa",
    email: "ram@example.com",
    role: "USER",
    status: "active",
    joinedAt: "2026-01-05T09:15:00Z",
  },
  {
    id: "usr_04",
    name: "Hari Karki",
    username: "harik",
    email: "hari@example.com",
    role: "USER",
    status: "suspended",
    joinedAt: "2026-02-18T16:45:00Z",
  },
  {
    id: "usr_05",
    name: "Spammer Bot",
    username: "spammer99",
    email: "spam@badmail.com",
    role: "USER",
    status: "banned",
    joinedAt: "2026-03-01T11:20:00Z",
  },
];

function getStoredUsers(): ManagedUser[] {
  if (typeof window === "undefined") return INITIAL_USERS;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_USERS;
  }
}

function saveStoredUsers(items: ManagedUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const userService = {
  /**
   * १. युजरहरूको सूची ल्याउने (सर्च र फिल्टर सहित)
   */
  async getUsers(filters: UserFilters = {}, token?: string | null): Promise<ManagedUser[]> {
    if (USE_REAL_API) {
      const params = new URLSearchParams({
        role: filters.role ?? "all",
        status: filters.status ?? "all",
        q: filters.q ?? "",
      });
      const res = await fetch(`${REAL_API_BASE}?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to load users" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data.users) ? data.users : [];
    }

    // Mock Mode (Client-side / Zero Network Failure)
    await new Promise((r) => setTimeout(r, 80));
    let rows = getStoredUsers();

    if (filters.role && filters.role !== "all") {
      rows = rows.filter((u) => u.role === filters.role);
    }
    if (filters.status && filters.status !== "all") {
      rows = rows.filter((u) => u.status === filters.status);
    }
    if (filters.q && filters.q.trim()) {
      const query = filters.q.toLowerCase().trim();
      rows = rows.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.username.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }

    return rows;
  },

  /**
   * २. युजरको रोल परिवर्तन गर्ने (ADMIN, MODERATOR, USER)
   */
  async updateUserRole(
    id: string,
    role: UserRole,
    adminRole: string,
    token?: string | null
  ): Promise<ManagedUser> {
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: "role", role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");
      return data;
    }

    // Mock Mode
    await new Promise((r) => setTimeout(r, 80));
    const items = getStoredUsers();
    const index = items.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    items[index] = { ...items[index], role };
    saveStoredUsers(items);
    return items[index];
  },

  /**
   * ३. युजरको स्टेटस परिवर्तन गर्ने (active, suspended, banned)
   */
  async updateUserStatus(
    id: string,
    status: UserStatus,
    adminRole: string,
    token?: string | null
  ): Promise<ManagedUser> {
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: "status", status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");
      return data;
    }

    // Mock Mode
    await new Promise((r) => setTimeout(r, 80));
    const items = getStoredUsers();
    const index = items.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");

    items[index] = { ...items[index], status };
    saveStoredUsers(items);
    return items[index];
  },

  /**
   * ४. युजर डिलिट गर्ने
   */
  async deleteUser(
    id: string,
    adminRole: string,
    token?: string | null
  ): Promise<boolean> {
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");
      return true;
    }

    // Mock Mode
    await new Promise((r) => setTimeout(r, 80));
    const items = getStoredUsers();
    const next = items.filter((u) => u.id !== id);
    if (next.length === items.length) throw new Error("User not found");

    saveStoredUsers(next);
    return true;
  },

  /**
   * डेटा रिसेट गर्न मन लागेमा
   */
  resetMockData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};