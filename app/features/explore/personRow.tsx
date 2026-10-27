// app/features/explore/person-row.tsx
"use client";

import { UserCheck, UserPlus } from "lucide-react";
import { SearchUser } from "./types";

interface PersonRowProps {
  person: SearchUser;
  isFollowing: boolean;
  onToggleFollow: (id: string) => void;
}

export function PersonRow({
  person,
  isFollowing,
  onToggleFollow,
}: PersonRowProps) {
  return (
    <div className="p-3 flex items-center justify-between gap-3 hover:bg-zinc-900/50 transition">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
          {person.alias.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-zinc-200 truncate">
            {person.alias}
          </p>
          <p className="text-[11px] text-zinc-500 truncate">
            @{person.username} • {person.postCount} vents
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onToggleFollow(person.id)}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
          isFollowing
            ? "bg-zinc-800 text-zinc-300 border border-zinc-700"
            : "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck className="w-3 h-3 text-red-400" />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus className="w-3 h-3" />
            <span>Follow</span>
          </>
        )}
      </button>
    </div>
  );
}