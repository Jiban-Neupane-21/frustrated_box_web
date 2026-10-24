import Link from "next/link";
import { Crown, Shield, Users, Flag } from "lucide-react";
import type { ManagedCommunity } from "@/types/auth";

interface ProfileCommunityCardProps {
  community: ManagedCommunity;
  isOwnProfile: boolean;
  hrefBase?: string;
}

const ROLE_STYLE: Record<
  ManagedCommunity["role"],
  { label: string; className: string; Icon: typeof Shield }
> = {
  owner: {
    label: "Owner",
    className: "text-red-300 border-red-700/40 bg-red-950/60",
    Icon: Crown,
  },
  moderator: {
    label: "Moderator",
    className: "text-amber-400 border-amber-500/30 bg-amber-950/40",
    Icon: Shield,
  },
  member: {
    label: "Member",
    className: "text-zinc-400 border-zinc-700 bg-zinc-900",
    Icon: Users,
  },
};

export default function ProfileCommunityCard({
  community,
  isOwnProfile,
  hrefBase = "/c",
}: ProfileCommunityCardProps) {
  const role = ROLE_STYLE[community.role];
  const pending = community.pendingReportsCount ?? 0;

  // Pending reports are for moderators/owners; show only on user's own profile
  const showPending = isOwnProfile && community.role !== "member" && pending > 0;

  const avatarSrc = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(
    community.slug
  )}`;

  return (
    <Link
      href={`${hrefBase}/${community.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-[#0d0d0f] p-3 transition hover:border-red-500/30 hover:bg-zinc-900/60"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarSrc}
        alt=""
        className="h-12 w-12 shrink-0 rounded-lg bg-zinc-900 object-cover"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-zinc-100 group-hover:text-white">
          {community.name}
        </p>
        <p className="truncate text-xs text-zinc-500">c/{community.slug}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${role.className}`}
        >
          <role.Icon className="h-3 w-3" />
          {role.label}
        </span>

        {showPending && (
          <span className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-950/40 px-2 py-0.5 text-[11px] font-medium text-red-400">
            <Flag className="h-3 w-3" />
            {pending} pending
          </span>
        )}
      </div>
    </Link>
  );
}