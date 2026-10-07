import Link from "next/link";
import { Users } from "lucide-react";

export interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  initials: string;
  members: string | number;
  colorScheme?: "red" | "amber";
}

interface ActiveCommunitiesProps {
  communities?: CommunityItem[];
  className?: string;
  onJoin?: (communityId: string) => void;
}

const DEFAULT_COMMUNITIES: CommunityItem[] = [

];

export function ActiveCommunities({
  communities = DEFAULT_COMMUNITIES,
  className = "",
  onJoin,
}: ActiveCommunitiesProps) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 shadow-lg backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-red-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Active Communities
          </h3>
        </div>
      </div>

      {/* Community List */}
      <div className="flex flex-col gap-2.5 text-xs">
        {communities.map((community) => {
          const isAmber = community.colorScheme === "amber";

          return (
            <div
              key={community.id}
              className="group flex items-center justify-between rounded-xl p-1.5 transition hover:bg-zinc-800/50"
            >
              <Link
                href={`/c/${community.slug}`}
                className="flex min-w-0 flex-1 items-center gap-2.5"
              >
                {/* Initials Badge */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold ${
                    isAmber
                      ? "border-amber-900/40 bg-amber-950/40 text-amber-400"
                      : "border-red-900/40 bg-red-950/40 text-red-400"
                  }`}
                >
                  {community.initials}
                </div>

                {/* Details */}
                <div className="min-w-0 truncate">
                  <p
                    className={`truncate font-semibold text-zinc-200 transition ${
                      isAmber
                        ? "group-hover:text-amber-400"
                        : "group-hover:text-red-400"
                    }`}
                  >
                    {community.name}
                  </p>
                  <p className="truncate text-[10px] text-zinc-500">
                    {community.members} members
                  </p>
                </div>
              </Link>

              {/* Join Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.(community.id);
                }}
                className="shrink-0 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-semibold text-zinc-300 transition hover:border-zinc-700 hover:text-white active:scale-95"
              >
                Join
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
