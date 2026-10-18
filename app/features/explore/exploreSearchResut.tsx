// app/features/explore/explore-search-results.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, AtSign, Flame, Hash, Users } from "lucide-react";
import { searchExploreOmni } from "./api";
import { CommunityGrid } from "./communitiesSection";
import { CommunitySlider } from "./communitySlider";
import { ExplorePostCard } from "./explorePostCard";
import {
  LoadMoreButton,
  PostsSkeleton,
  SectionTitle,
  TextButton,
} from "./exploreUi";
import { PersonRow } from "./personRow";
import {
  ExplorePost,
  SearchCategoryTab,
  SearchCommunity,
  SearchMode,
  SearchUser,
} from "./types";

const PAGE_SIZE = 12;

/**
 * The first character decides what we search:
 *   #word  -> posts by hashtag
 *   @name  -> people by username
 *   other  -> communities + confession posts
 */
export function parseQuery(raw: string): { mode: SearchMode; term: string } {
  const q = raw.trim();
  if (q.startsWith("#")) {
    return { mode: "hashtag", term: q.replace(/^#+/, "").trim() };
  }
  if (q.startsWith("@")) {
    return { mode: "username", term: q.replace(/^@+/, "").trim() };
  }
  return { mode: "text", term: q };
}

interface ExploreSearchResultsProps {
  query: string;
  joined: Record<string, boolean>;
  onToggleJoin: (id: string) => void;
  followed: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
  onClear: () => void;
}

export function ExploreSearchResults({
  query,
  joined,
  onToggleJoin,
  followed,
  onToggleFollow,
  onClear,
}: ExploreSearchResultsProps) {
  const { mode, term } = useMemo(() => parseQuery(query), [query]);

  const [activeTab, setActiveTab] = useState<SearchCategoryTab>("all");
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [people, setPeople] = useState<SearchUser[]>([]);
  const [communities, setCommunities] = useState<SearchCommunity[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // # -> posts only, @ -> people only, plain text -> all / posts / communities
  const tab: SearchCategoryTab =
    mode === "hashtag"
      ? "posts"
      : mode === "username"
        ? "people"
        : activeTab === "people"
          ? "all"
          : activeTab;

  useEffect(() => {
    // Only "#" or "@" typed so far: wait for the actual word
    if (!term) {
      setPosts([]);
      setPeople([]);
      setCommunities([]);
      setTotalPosts(0);
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    let ignore = false;
    setIsLoading(true);

    (async () => {
      try {
        const data = await searchExploreOmni({
          query: term,
          mode,
          tab,
          page: 1,
          limit: PAGE_SIZE,
        });
        if (ignore) return;
        setPosts(mode === "username" ? [] : data.posts);
        setPeople(mode === "username" ? data.people : []);
        setCommunities(mode === "text" ? data.communities : []);
        setTotalPosts(mode === "username" ? 0 : data.totalPosts);
        setHasMore(data.posts.length < data.totalPosts);
        setPage(1);
      } catch (err) {
        if (!ignore) console.error("Search failed:", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [mode, term, tab]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await searchExploreOmni({
        query: term,
        mode,
        tab,
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(posts.length + data.posts.length < data.totalPosts);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more results:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  /* ---------------------------- render ---------------------------- */

  // "#" or "@" typed, waiting for the word
  if (!term) {
    return (
      <div className="py-12 text-center border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
        <p className="text-sm text-zinc-400">
          {mode === "hashtag"
            ? "Type a tag to find posts, like #burnout"
            : "Type a username to find people, like @anonymous"}
        </p>
      </div>
    );
  }

  const showCommunities =
    mode === "text" &&
    (tab === "all" || tab === "communities") &&
    communities.length > 0;
  const showPeople = mode === "username" && people.length > 0;
  const showPosts =
    mode !== "username" &&
    (mode === "hashtag" || tab === "all" || tab === "posts") &&
    posts.length > 0;

  const noResults =
    mode === "username"
      ? people.length === 0
      : mode === "hashtag"
        ? posts.length === 0
        : tab === "posts"
          ? posts.length === 0
          : tab === "communities"
            ? communities.length === 0
            : posts.length === 0 && communities.length === 0;

  const emptyLabel =
    mode === "username"
      ? `No people found for @${term}.`
      : mode === "hashtag"
        ? `No posts tagged #${term}.`
        : tab === "communities"
          ? "No matching communities found."
          : "No matching screams found.";

  return (
    <div className="space-y-5">
      {/* Tabs: only for plain-text search (# and @ have a single result type) */}
      {mode === "text" && (
        <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2">
          {[
            { id: "all", label: "All Results" },
            { id: "posts", label: `Posts (${totalPosts})` },
            { id: "communities", label: `Communities (${communities.length})` },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as SearchCategoryTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-red-400 border border-zinc-700 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <PostsSkeleton />
      ) : (
        <div className="space-y-6 pt-1">
          {/* Communities: slider on "All", list on "Communities" tab */}
          {showCommunities && (
            <div className="space-y-3">
              <SectionTitle
                icon={<Users className="w-3.5 h-3.5 text-red-400" />}
                action={
                  tab === "all" && communities.length > 2 ? (
                    <TextButton onClick={() => setActiveTab("communities")}>
                      See all ({communities.length}){" "}
                      <ArrowRight className="w-3 h-3" />
                    </TextButton>
                  ) : undefined
                }
              >
                Matching Communities
              </SectionTitle>

              {tab === "all" ? (
                <CommunitySlider
                  communities={communities}
                  joined={joined}
                  onToggleJoin={onToggleJoin}
                />
              ) : (
                <CommunityGrid
                  communities={communities}
                  joined={joined}
                  onToggleJoin={onToggleJoin}
                />
              )}
            </div>
          )}

          {/* People (@username) */}
          {showPeople && (
            <div className="space-y-3">
              <SectionTitle
                icon={<AtSign className="w-3.5 h-3.5 text-amber-400" />}
              >
                People matching @{term} ({people.length})
              </SectionTitle>

              <div className="divide-y divide-zinc-900 border border-zinc-800/70 rounded-xl bg-zinc-900/30 overflow-hidden">
                {people.map((person) => (
                  <PersonRow
                    key={person.id}
                    person={person}
                    isFollowing={
                      followed[person.id] ?? person.isFollowing ?? false
                    }
                    onToggleFollow={onToggleFollow}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Posts (#hashtag or plain text) */}
          {showPosts && (
            <div className="space-y-4">
              {(mode === "hashtag" || tab === "all") && (
                <SectionTitle
                  icon={
                    mode === "hashtag" ? (
                      <Hash className="w-3.5 h-3.5 text-red-400" />
                    ) : (
                      <Flame className="w-3.5 h-3.5 text-red-400" />
                    )
                  }
                >
                  {mode === "hashtag"
                    ? `Posts tagged #${term} (${totalPosts})`
                    : `Matching Screams (${totalPosts})`}
                </SectionTitle>
              )}

              <div className="space-y-4">
                {posts.map((post) => (
                  <ExplorePostCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <LoadMoreButton
                  onClick={handleLoadMore}
                  loading={isLoadingMore}
                  label="Load More Screams ↓"
                  loadingLabel="Loading more screams..."
                />
              )}
            </div>
          )}

          {noResults && (
            <div className="py-16 text-center border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
              <p className="text-sm text-zinc-400">{emptyLabel}</p>
              <button
                type="button"
                onClick={onClear}
                className="mt-2 text-xs text-red-400 hover:underline cursor-pointer"
              >
                Clear search & reset filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}