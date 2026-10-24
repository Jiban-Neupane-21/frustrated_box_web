import type { ManagedCommunity } from "@/types/auth";

// Filter for communities tab
export type CommunityFilter = "all" | ManagedCommunity["role"];

export interface ConfessionComment {
  id: string;
  confessionId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Confession {
  id: string;
  authorId: string;
  content: string;
  isAnonymous: boolean;
  communityId?: string;
  relateCount: number;
  burnCount: number;
  commentCount: number;
  createdAt: string;
}

// Profile tabs
export type ProfileTab =
  | "public"
  | "private"
  | "communities"
  | "saved"
  | "activity";

// Tabs visible only to the profile owner
export const OWNER_ONLY_TABS: ProfileTab[] = ["private", "saved", "activity"];

export function getVisibleTabs(isOwnProfile: boolean): ProfileTab[] {
  const all: ProfileTab[] = ["public", "private", "saved", "communities", "activity"];
  return isOwnProfile ? all : all.filter((t) => !OWNER_ONLY_TABS.includes(t));
}

// Stats bar metrics
export interface ProfileStats {
  ventCount: number;
  relateCount: number;
  burnCount: number;
  communityCount: number;
}

// Activity items for the activity feed tab
export type ActivityItem =
  | { type: "echo"; confession: Confession; comment: ConfessionComment; at: string }
  | { type: "relate"; confession: Confession; at: string }
  | { type: "burn"; confession: Confession; at: string };

export type ActivityFilter = "all" | "echo" | "relate" | "burn";

