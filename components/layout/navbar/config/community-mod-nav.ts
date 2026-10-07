import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Settings,
  ScrollText,
} from "lucide-react";
import { NavLinkItem } from "@/components/layout/navbar/types";

/**
 * Navigation tabs for the Community Moderator Workspace.
 * Dynamically prefixes routes with the target community's slug.
 *
 * @param slug - The unique URL identifier of the community (e.g. "tech-life")
 * @param pendingCount - Number of pending reported vents/flags in the queue
 */
export const getCommunityModNavLinks = (
  slug: string,
  pendingCount: number = 0,
): NavLinkItem[] => [
  {
    id: "overview",
    label: "Overview",
    href: `/c/${slug}/mod`,
    icon: LayoutDashboard,
  },
  {
    id: "queue",
    label: "Mod Queue",
    href: `/c/${slug}/mod/queue`,
    icon: ShieldAlert,
    badge: pendingCount > 0 ? pendingCount : undefined,
  },
  {
    id: "members",
    label: "Members & Bans",
    href: `/c/${slug}/mod/members`,
    icon: Users,
  },
  {
    id: "rules",
    label: "Rules & Branding",
    href: `/c/${slug}/mod/settings`,
    icon: Settings,
  },
  {
    id: "audit",
    label: "Audit Logs",
    href: `/c/${slug}/mod/audit`,
    icon: ScrollText,
  },
];
