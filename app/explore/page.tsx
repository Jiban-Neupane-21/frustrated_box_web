// app/explore/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserPlus,
  Flame,
  ArrowRight,
  Loader2,
  HeartHandshake,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { ExploreSearchHeader } from "@/app/features/explore/explore-search-header";
import { ExplorePostCard } from "@/app/features/explore/explore-post-card";
import {
  fetchTopDiscoveredPosts,
  searchExploreOmni,
} from "@/app/features/explore/api";
import {
  ExplorePost,
  DiscoveryTabType,
  SearchCategoryTab,
  SearchCommunity,
  SearchUser,
} from "@/app/features/explore/types";

// Discovery feed filter tabs with Lucide Icons
const DISCOVERY_TABS = [
  { id: "top-burned", label: "Most Burned", icon: Flame },
  { id: "top-relatable", label: "Most Relatable", icon: HeartHandshake },
  { id: "top-echoed", label: "Top Debated", icon: MessageSquare },
  { id: "latest", label: "Latest", icon: Sparkles },
] as const;

export default function ExplorePage() {
  // Query & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDiscoveryTab, setActiveDiscoveryTab] =
    useState<DiscoveryTabType>("top-burned");
  const [activeSearchTab, setActiveSearchTab] =
    useState<SearchCategoryTab>("all");

  // Data states
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [people, setPeople] = useState<SearchUser[]>([]);
  const [communities, setCommunities] = useState<SearchCommunity[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  // Pagination states (12 posts per page)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Local interactive states for Follow & Join toggles
  const [followedUsers, setFollowedUsers] = useState<Record<string, boolean>>(
    {},
  );
  const [joinedCommunities, setJoinedCommunities] = useState<
    Record<string, boolean>
  >({});

  const isSearchMode = searchQuery.trim().length > 0;

  // 1. Fetch explore data on initial load or when filters change
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        if (isSearchMode) {
          // Omnisearch across Posts, People, and Communities
          const data = await searchExploreOmni({
            query: searchQuery,
            tab: activeSearchTab,
            page: 1,
            limit: 12,
          });

          if (!ignore) {
            setPosts(data.posts);
            setPeople(data.people);
            setCommunities(data.communities);
            setTotalPostsCount(data.totalPosts);
            setHasMore(data.posts.length < data.totalPosts);
            setPage(1);
          }
        } else {
          // Discovery feed with pagination (12 items)
          const data = await fetchTopDiscoveredPosts({
            tab: activeDiscoveryTab,
            page: 1,
            limit: 12,
          });

          if (!ignore) {
            setPosts(data.posts);
            setPeople([]);
            setCommunities([]);
            setTotalPostsCount(data.totalCount);
            setHasMore(data.hasMore);
            setPage(1);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load explore content:", err);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [isSearchMode, searchQuery, activeSearchTab, activeDiscoveryTab]);

  // 2. Load More Posts Handler (Fetches next 12 posts)
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    try {
      if (isSearchMode) {
        const data = await searchExploreOmni({
          query: searchQuery,
          tab: activeSearchTab,
          page: nextPage,
          limit: 12,
        });
        setPosts((prev) => [...prev, ...data.posts]);
        setHasMore(posts.length + data.posts.length < data.totalPosts);
        setPage(nextPage);
      } else {
        const data = await fetchTopDiscoveredPosts({
          tab: activeDiscoveryTab,
          page: nextPage,
          limit: 12,
        });
        setPosts((prev) => [...prev, ...data.posts]);
        setHasMore(data.hasMore);
        setPage(nextPage);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Toggle user follow state
  const handleToggleFollow = (userId: string) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Toggle community join state
  const handleToggleJoin = (communityId: string) => {
    setJoinedCommunities((prev) => ({
      ...prev,
      [communityId]: !prev[communityId],
    }));
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Step 1: Search Header */}
        <ExploreSearchHeader
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setIsLoading(true);
            setSearchQuery(q);
          }}
        />

        {/* Step 2: Conditional Filter Bars (Search Tabs VS Discovery Tabs) */}
        {isSearchMode ? (
          /* Facebook-style Omnisearch Tabs */
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
            {[
              { id: "all", label: "All Results" },
              { id: "posts", label: `Posts (${totalPostsCount})` },
              { id: "people", label: `People (${people.length})` },
              {
                id: "communities",
                label: `Communities (${communities.length})`,
              },
            ].map((tab) => {
              const isActive = activeSearchTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setActiveSearchTab(tab.id as SearchCategoryTab);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-zinc-800 text-red-400 border border-zinc-700 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ) : (
          /* High-engagement Discovery Tabs */
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none no-scrollbar">
            {DISCOVERY_TABS.map((tab) => {
              const isActive = activeDiscoveryTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setActiveDiscoveryTab(tab.id);
                  }}
                  className={`relative flex flex-1 items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? "text-red-400 after:absolute after:left-2 after:right-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-red-500"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${isActive ? "text-red-400" : "text-zinc-400"}`}
                  />{" "}
                  <span className="hidden sm:inline ">{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-4 py-2 animate-pulse">
            <div className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-900" />
            <div className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-900" />
            <div className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-900" />
          </div>
        ) : (
          <div className="space-y-6 pt-1">
            {/* ========================================================= */}
            {/* 🏢 COMMUNITIES SECTION (Shown on "all" or "communities")  */}
            {/* ========================================================= */}
            {isSearchMode &&
              (activeSearchTab === "all" ||
                activeSearchTab === "communities") &&
              communities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-red-400" />
                      Matching Communities
                    </h3>
                    {activeSearchTab === "all" && communities.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoading(true);
                          setActiveSearchTab("communities");
                        }}
                        className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        See all ({communities.length}){" "}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(activeSearchTab === "all"
                      ? communities.slice(0, 2)
                      : communities
                    ).map((comm) => {
                      const isJoined =
                        joinedCommunities[comm.id] ?? comm.isJoined;

                      return (
                        <div
                          key={comm.id}
                          className="p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 transition flex items-start justify-between gap-3"
                        >
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

                          <button
                            type="button"
                            onClick={() => handleToggleJoin(comm.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer shrink-0 ${
                              isJoined
                                ? "bg-zinc-800 text-zinc-400 hover:text-red-400 border border-zinc-700"
                                : "bg-red-950/60 text-red-300 hover:bg-red-900/80 border border-red-800/80"
                            }`}
                          >
                            {isJoined ? "Joined" : "Join"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* ========================================================= */}
            {/* 👥 PEOPLE / AUTHORS SECTION (Shown on "all" or "people")   */}
            {/* ========================================================= */}
            {isSearchMode &&
              (activeSearchTab === "all" || activeSearchTab === "people") &&
              people.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                      Matching Authors
                    </h3>
                    {activeSearchTab === "all" && people.length > 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsLoading(true);
                          setActiveSearchTab("people");
                        }}
                        className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        See all ({people.length}){" "}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-zinc-900 border border-zinc-800/70 rounded-xl bg-zinc-900/30 overflow-hidden">
                    {(activeSearchTab === "all"
                      ? people.slice(0, 3)
                      : people
                    ).map((person) => {
                      const isFollowing =
                        followedUsers[person.id] ?? person.isFollowing;

                      return (
                        <div
                          key={person.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-zinc-900/50 transition"
                        >
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
                            onClick={() => handleToggleFollow(person.id)}
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
                    })}
                  </div>
                </div>
              )}

            {/* ========================================================= */}
            {/* 📑 POSTS FEED SECTION                                     */}
            {/* ========================================================= */}
            {(!isSearchMode ||
              activeSearchTab === "all" ||
              activeSearchTab === "posts") && (
              <div className="space-y-4">
                {isSearchMode && activeSearchTab === "all" && (
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 px-1 pt-2">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    Matching Screams ({totalPostsCount})
                  </h3>
                )}

                {posts.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <ExplorePostCard key={post.id} post={post} />
                      ))}
                    </div>

                    {/* Pagination / Load More Button */}
                    {hasMore && (
                      <div className="text-center pt-4 pb-2">
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer disabled:opacity-60"
                        >
                          {isLoadingMore ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                              <span>Loading more screams...</span>
                            </>
                          ) : (
                            <span>Load More Screams ↓</span>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-16 text-center border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
                    <p className="text-sm text-zinc-400">
                      No matching screams found.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        setSearchQuery("");
                        setActiveSearchTab("all");
                      }}
                      className="mt-2 text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Clear search & reset filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-8 pb-4 text-xs text-zinc-600">
          You&apos;ve reached the void&apos;s edge. Take a deep breath.
        </div>
      </div>
    </main>
  );
}
