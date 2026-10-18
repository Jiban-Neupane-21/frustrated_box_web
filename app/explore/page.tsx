// app/explore/page.tsx
"use client";

import { useState, useEffect } from "react";
import { AtSign, Hash } from "lucide-react";
import { ExploreSearchHeader } from "@/app/features/explore/explore-search-header";
import { ExploreSearchResults } from "@/app/features/explore/exploreSearchResut";
import {
  AllCommunitiesView,
  CommunitiesPreview,
} from "@/app/features/explore/communitiesSection";
import { DiscoveryPosts } from "@/app/features/explore/postSectioon";
import { BackButton } from "@/app/features/explore/exploreUi";
import { DiscoveryTabType } from "@/app/features/explore/types";

type ExploreView = "home" | "communities" | "posts";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState(""); // what the input shows
  const [debouncedQuery, setDebouncedQuery] = useState(""); // what we search
  const [view, setView] = useState<ExploreView>("home");
  const [discoveryTab, setDiscoveryTab] =
    useState<DiscoveryTabType>("top-burned");

  // Local interactive states for Follow & Join toggles
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>(
    {},
  );
  const [joinedCommunities, setJoinedCommunities] = useState<
    Record<string, boolean>
  >({});

  // Debounce typing (instant when the box is cleared)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedQuery("");
      return;
    }
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const isSearchMode = debouncedQuery.trim().length > 0;

  const toggleFollow = (id: string) =>
    setFollowedUsers((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleJoin = (id: string) =>
    setJoinedCommunities((prev) => ({ ...prev, [id]: !prev[id] }));

  const openView = (next: ExploreView) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        <ExploreSearchHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isSearchMode ? (
          <ExploreSearchResults
            query={debouncedQuery}
            joined={joinedCommunities}
            onToggleJoin={toggleJoin}
            followed={followedUsers}
            onToggleFollow={toggleFollow}
            onClear={() => setSearchQuery("")}
          />
        ) : view === "communities" ? (
          <AllCommunitiesView
            joined={joinedCommunities}
            onToggleJoin={toggleJoin}
            onBack={() => openView("home")}
          />
        ) : view === "posts" ? (
          <div className="space-y-4">
            <BackButton
              onClick={() => openView("home")}
              label="Back to Explore"
            />
            <DiscoveryPosts
              tab={discoveryTab}
              onTabChange={setDiscoveryTab}
              variant="preview"
              onExploreMore={() => openView("posts")}
              onSeeAllTrending={() => openView("posts")}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search shortcuts */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
              <button
                type="button"
                onClick={() => setSearchQuery("#")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:text-zinc-300 transition cursor-pointer"
              >
                <Hash className="w-3 h-3" /> Find posts by tag
              </button>
              <button
                type="button"
                onClick={() => setSearchQuery("@")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:text-zinc-300 transition cursor-pointer"
              >
                <AtSign className="w-3 h-3" /> Find people
              </button>
            </div>

            <CommunitiesPreview
              joined={joinedCommunities}
              onToggleJoin={toggleJoin}
              onExploreMore={() => openView("communities")}
            />

            <DiscoveryPosts
              tab={discoveryTab}
              onTabChange={setDiscoveryTab}
              variant="preview"
              onExploreMore={() => openView("posts")}
              onSeeAllTrending={() => openView("posts")}
            />
          </div>
        )}

        <div className="text-center pt-8 pb-4 text-xs text-zinc-600">
          You&apos;ve reached the void&apos;s edge. Take a deep breath.
        </div>
      </div>
    </main>
  );
}
