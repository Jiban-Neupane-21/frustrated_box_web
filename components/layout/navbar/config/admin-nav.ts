import {
  BarChart3,
  ShieldCheck,
  Layers,
  UserCog,
  Sliders,
  ActivitySquare,
} from "lucide-react";
import { NavLinkItem } from "@/components/layout/navbar/types";

/**
 * Navigation tabs for the Global Platform Admin console.
 * Accessible only by users holding the 'admin' global role.
 */
export const PLATFORM_ADMIN_NAV_LINKS: NavLinkItem[] = [
  {
    id: "admin-analytics",
    label: "Stress Heatmap",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    id: "admin-moderation",
    label: "Global Safety Queue",
    href: "/admin/moderation",
    icon: ShieldCheck,
  },
  {
    id: "admin-communities",
    label: "Manage Communities",
    href: "/admin/communities",
    icon: Layers,
  },
  {
    id: "admin-users",
    label: "User Management",
    href: "/admin/users",
    icon: UserCog,
  },
  {
    id: "admin-system",
    label: "System Metrics",
    href: "/admin/system",
    icon: ActivitySquare,
  },
  {
    id: "admin-settings",
    label: "Settings & Flags",
    href: "/admin/settings",
    icon: Sliders,
  },
];
