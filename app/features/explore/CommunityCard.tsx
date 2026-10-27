// app/features/explore/community-card.tsx
"use client";

import Link from "next/link";
import { SearchCommunity } from "./types";

interface CommunityCardProps {
  comm: SearchCommunity;
  isJoined: boolean;
  onToggleJoin: (id: string) => void;
  /** "slide" = fixed-width card for the slider, "row" = full-width card for lists/grids */
  variant?: "slide" | "row";
}

function JoinButton({
  isJoined,
  onClick,
  className = "",
}: {
  isJoined: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
        isJoined
          ? "bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-700"
          : "bg-red-950/60 text-red-300 hover:bg-red-900/80 border border-red-800/80"
      } ${className}`}
    >
      {isJoined ? "Joined" : "Join"}
    </button>
  );
}

export function CommunityCard({
  comm,
  isJoined,
  onToggleJoin,
  variant = "row",
}: CommunityCardProps) {
  if (variant === "slide") {
    return (
      <div className="w-56 shrink-0 snap-start p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 transition flex flex-col justify-between gap-3">
        <Link
          href={`/c/${comm.slug}`}
          className="flex items-start gap-2.5 min-w-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
            {comm.initials}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-red-400 transition truncate">
              {comm.name}
            </h4>
            <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5 min-h-8">
              {comm.description}
            </p>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              {comm.membersCount.toLocaleString()} members
            </span>
          </div>
        </Link>

        <JoinButton
          isJoined={isJoined}
          onClick={() => onToggleJoin(comm.id)}
          className="w-full"
        />
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 transition flex items-start justify-between gap-3">
      <Link
        href={`/c/${comm.slug}`}
        className="flex items-start gap-2.5 min-w-0 flex-1 group"
      >
        <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
          {comm.initials}
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-red-400 transition truncate">
            {comm.name}
          </h4>
          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
            {comm.description}
          </p>
          <span className="text-[10px] text-zinc-500 mt-1 block">
            {comm.membersCount.toLocaleString()} members
          </span>
        </div>
      </Link>

      <JoinButton
        isJoined={isJoined}
        onClick={() => onToggleJoin(comm.id)}
        className="shrink-0"
      />
    </div>
  );
}