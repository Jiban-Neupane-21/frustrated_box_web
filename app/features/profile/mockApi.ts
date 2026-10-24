import type { User } from "@/types/auth";
import type { Confession, ProfileStats, ActivityItem } from "./types";
import { INITIAL_MOCK_USERS } from "@/lib/mockData";
import { MOCK_CONFESSIONS } from "@/app/features/feed/mockData";

// ============================================================
// HELPERS (duplicated from api.ts for standalone mock)
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

function getAllUsers(): User[] {
  const base = INITIAL_MOCK_USERS as unknown as User[];
  if (typeof window === "undefined") return base;

  try {
    const raw = localStorage.getItem("users");
    const stored: User[] = raw ? JSON.parse(raw) : [];
    const ids = new Set(base.map((u) => u.id));
    return [...base, ...stored.filter((u) => !ids.has(u.id))];
  } catch {
    return base;
  }
}

function getAllConfessions(): Confession[] {
  return MOCK_CONFESSIONS.map((item) => ({
    id: item.id,
    authorId: item.author.id ?? "",
    content: item.content,
    isAnonymous: item.author.isAnonymous,
    relateCount: item.relateCount,
    burnCount: item.burnCount,
    commentCount: item.echoCount,
    createdAt: item.createdAt,
  }));
}

// ============================================================
// MOCK ADAPTER
// ============================================================

export const mockProfileApi: ProfileApi = {
  async getUserByUsername(username) {
    const clean = normalizeUsername(username);
    return getAllUsers().find((u) => u.username.toLowerCase() === clean) ?? null;
  },

  async getPublicVents(userId) {
    return getAllConfessions().filter(
      (c) => c.authorId === userId && !c.isAnonymous
    );
  },

  async getPrivateVents(userId, viewerId) {
    // Visible only if viewing own profile
    if (!viewerId || viewerId !== userId) return [];
    return getAllConfessions().filter(
      (c) => c.authorId === userId && c.isAnonymous
    );
  },

  async getUserStats(userId, viewerId) {
    const isOwn = !!viewerId && viewerId === userId;
    const mine = getAllConfessions().filter(
      (c) => c.authorId === userId && (isOwn || !c.isAnonymous)
    );
    const user = getAllUsers().find((u) => u.id === userId);

    return {
      ventCount: mine.length,
      relateCount: mine.reduce((sum, c) => sum + c.relateCount, 0),
      burnCount: mine.reduce((sum, c) => sum + c.burnCount, 0),
      communityCount: user?.managedCommunities?.length ?? 0,
    };
  },

  async getSavedVents(userId, viewerId) {
    if (!viewerId || viewerId !== userId) return [];
    return getAllConfessions().slice(0, 2);
  },

  async getUserActivity(userId, viewerId) {
    if (!viewerId || viewerId !== userId) return [];
    const all = getAllConfessions();
    if (!all.length) return [];
    return [
      {
        type: "echo",
        confession: all[0],
        comment: {
          id: "cmt-1",
          confessionId: all[0].id,
          authorId: userId,
          content: "I completely relate to this!",
          createdAt: new Date().toISOString(),
        },
        at: new Date().toISOString(),
      },
      {
        type: "relate",
        confession: all[1] ?? all[0],
        at: new Date().toISOString(),
      },
    ];
  },
};

import type { ProfileApi } from "./api";