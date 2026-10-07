import { Home, Compass, Users, Quote, CirclePlus } from "lucide-react";
import { NavLinkItem } from "@/components/layout/navbar/types";

/**
 * Primary navigation links for both guests and authenticated users.
 * - Home: Directs to the main vent box landing page
 * - Explore: Feed of public vents and top reactions
 * - Communities: Thematic venting spaces and topic hubs
 * - Quotes: Relatable dark-humor and emotional one-liners
 */
export const CONSUMER_NAV_LINKS: NavLinkItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    id: "post",
    label: "Post",
    href: "/post",
    icon: CirclePlus,
  },
  {
    id: "communities",
    label: "Communities",
    href: "/communities",
    icon: Users,
  },
  {
    id: "quotes",
    label: "Quotes",
    href: "/quotes",
    icon: Quote,
  },
];
