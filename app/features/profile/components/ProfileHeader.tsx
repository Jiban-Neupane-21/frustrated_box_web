"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, Shield, ShieldCheck, Settings, Share2, Check } from "lucide-react";
import type { User } from "@/types/auth";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  editHref?: string;
  settingsHref?: string;
}

type Authority = "ADMIN" | "OWNER" | "MODERATOR" | "USER";

// Authority role derived from user.role and managedCommunities
function getAuthority(user: User): Authority {
  if (user.role === "ADMIN") return "ADMIN";
  if (user.managedCommunities?.some((c) => c.role === "owner")) return "OWNER";
  if (user.role === "MODERATOR") return "MODERATOR";
  return "USER";
}

const AUTHORITY_STYLE: Record<
  Authority,
  { ring: string; badge?: { label: string; className: string; Icon: typeof Shield } }
> = {
  ADMIN: {
    ring: "ring-red-500 shadow-[0_0_18px_rgba(239,68,68,0.45)]",
    badge: {
      label: "Admin",
      className: "text-red-400 border-red-500/30 bg-red-950/40",
      Icon: ShieldCheck,
    },
  },
  OWNER: {
    ring: "ring-red-700",
    badge: {
      label: "Owner",
      className: "text-red-300 border-red-700/40 bg-red-950/60",
      Icon: Crown,
    },
  },
  MODERATOR: {
    ring: "ring-amber-500/70",
    badge: {
      label: "Moderator",
      className: "text-amber-400 border-amber-500/30 bg-amber-950/40",
      Icon: Shield,
    },
  },
  USER: { ring: "ring-zinc-700" },
};

export default function ProfileHeader({
  user,
  isOwnProfile,
  isFollowing = false,
  onToggleFollow,
  editHref = "/settings/profile",
  settingsHref = "/settings",
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const authority = getAuthority(user);
  const style = AUTHORITY_STYLE[authority];
  const avatarSrc =
    user.profile?.avatarUrl ??
    `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.username)}`;

  async function handleShare() {
    try {
      const url = `${window.location.origin}/profile/@${user.username}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore clipboard write failure
    }
  }

  const secondaryBtn =
    "inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-[#0d0d0f] px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-700 hover:bg-zinc-900";

  return (
    <div className="relative -mt-12 flex items-end justify-between gap-3 px-4 sm:-mt-14 sm:px-6">
      {/* Avatar + authority badge */}
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatarSrc}
          alt={`${user.name}'s avatar`}
          className={`h-24 w-24 rounded-full bg-[#0d0d0f] object-cover ring-4 sm:h-28 sm:w-28 ${style.ring}`}
        />
        {style.badge && (
          <span
            title={style.badge.label}
            className={`absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border ${style.badge.className}`}
          >
            <style.badge.Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pb-1">
        {isOwnProfile ? (
          <>
            <Link
              href={editHref}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Edit Profile
            </Link>
            <Link href={settingsHref} aria-label="Settings" className={secondaryBtn}>
              <Settings className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggleFollow}
              className={
                isFollowing
                  ? secondaryBtn
                  : "rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              }
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button type="button" onClick={handleShare} className={secondaryBtn}>
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied" : "Share"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}