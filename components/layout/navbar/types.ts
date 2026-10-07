import { LucideIcon } from "lucide-react";

/**
 * Global application roles
 * - guest: Unauthenticated visitor
 * - user: Registered community member
 * - admin: Global super-admin with platform access
 */
export type GlobalRole = "guest" | "user" | "admin";

/**
 * Community-specific hierarchy
 * - member: Follower / contributor of a community
 * - moderator: Moderates flagged content within a specific community
 * - owner: Creator and chief admin of the community
 */
export type CommunityRole = "member" | "moderator" | "owner";

/**
 * Active navigation view mode
 * - consumer: Standard browsing experience (Home, Explore, Communities, Quotes)
 * - community-admin: Contextual workspace for community moderators
 * - platform-admin: Global platform console for super admins
 */
export type NavMode = "consumer" | "community-admin" | "platform-admin";

/**
 * Content creation options available in the primary CTA menu
 * - vent: Immediate anonymous stress release with pressure gauge
 * - thought: Community-level discussion and constructive rants
 * - quote: Sarcastic, dark-humor, or relatable short one-liners
 */
export type CreateActionType = "vent" | "thought" | "quote";

/**
 * Structure for items inside the "+ Create" dropdown menu
 */
export interface CreateOption {
  id: CreateActionType;
  title: string;
  description: string;
  icon: LucideIcon;
  requiresAuth: boolean;
  accentColor: string;
}

/**
 * Standard navigation link structure
 */
export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

/**
 * Details of a community managed by the current user
 */
export interface ManagedCommunity {
  id: string;
  name: string;
  slug: string;
  role: CommunityRole;
  pendingReportsCount?: number;
}

/**
 * Active user session structure
 */
export interface UserSession {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  role: GlobalRole;
  managedCommunities: ManagedCommunity[];
}