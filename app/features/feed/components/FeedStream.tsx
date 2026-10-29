"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { X, Loader2, UsersRound, Sparkles } from "lucide-react";
import { Confession, FeedSortOption } from "../types";
import { fetchFeed } from "../api";
import { ConfessionCard } from "./ConfessionCard";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// Skeleton Loading Card
function ConfessionSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-zinc-900 bg-[#070707] p-5">
      <div className="flex items-center gap-2.5 pb-3">
        <div className="h-8 w-8 rounded-full bg-zinc-800" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 rounded bg-zinc-800" />
          <div className="h-2.5 w-14 rounded bg-zinc-900" />
        </div>
      </div>
      <div className="space-y-2 py-2">
        <div className="h-3.5 w-full rounded bg-zinc-800/80" />
        <div className="h-3.5 w-4/5 rounded bg-zinc-800/80" />
        <div className="h-3.5 w-2/3 rounded bg-zinc-800/80" />
      </div>
      <div className="mt-4 flex gap-2 border-t border-zinc-900 pt-3">
        <div className="h-7 w-20 rounded-lg bg-zinc-900" />
        <div className="h-7 w-20 rounded-lg bg-zinc-900" />
      </div>
    </div>
  );
}

export function FeedStream({
  community = null,
}: {
  community?: string | null;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Confession[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  // Active filters
  const [sort, setSort] = useState<FeedSortOption>("for_you");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Intersection observer hook for bottom scroll trigger
  const { ref } = useInView({
    threshold: 0,
    rootMargin: "200px",
    onChange: (inView) => {
      if (inView && hasMore && !isLoading && !isFetchingNext && cursor) {
        loadNextPage();
      }
    },
  });

  // Load initial or filter-reset page
  // User filter change handlers (Event handlers are the right place to trigger loading state)
  const handleSortChange = (newSort: FeedSortOption) => {
    if (newSort === sort) return;

    if (newSort === "following" && !isAuthenticated) {
      Swal.fire({
        title: "Login Required",
        text: "Log in to see thoughts from authors you follow.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Log In",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#27272a",
        background: "#09090b",
        color: "#f4f4f5",
        customClass: {
          popup: "border border-zinc-800 rounded-2xl",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/login");
        }
      });
      return;
    }
    setIsLoading(true);
    setSort(newSort);
  };

  const handleTagChange = (tag: string | null) => {
    setIsLoading(true);
    setSelectedTag(tag);
  };

  // Load next paginated page
  const loadNextPage = useCallback(async () => {
    if (isFetchingNext || !hasMore || !cursor) return;
    setIsFetchingNext(true);

    try {
      const res = await fetchFeed({
        limit: 5,
        cursor,
        sort,
        tag: selectedTag,
        community,
      });
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (err) {
      console.error("Failed to load more:", err);
    } finally {
      setIsFetchingNext(false);
    }
  }, [isFetchingNext, hasMore, cursor, sort, selectedTag, community]);
  // Fetch initial feed or when filters change
  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const res = await fetchFeed({
          limit: 5,
          cursor: null,
          sort,
          tag: selectedTag,
          community,
        });

        if (!ignore) {
          setItems(res.items);
          setCursor(res.nextCursor);
          setHasMore(res.hasMore);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load feed:", err);
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
  }, [sort, selectedTag, community]);

  const SORT_TABS = [
    {
      key: "for_you",
      label: "For you",
      icon: <Sparkles className="h-4 w-4 text-amber-400" />,
    },
    {
      key: "following",
      label: "Following",
      icon: <UsersRound className="h-4 w-4 text-rose-800" />,
    },
  ] as const;

  return (
    <div className="w-full space-y-4">
      {/* Feed Filter & Sort Header Bar */}
      <div className="sticky top-14 z-30 flex flex-wrap items-center gap-2 bg-[#070707] p-2.5">
        {" "}
        {/* Sort tabs: poora width ma barabar faileko */}
        <div className="flex min-w-0 flex-1 items-center gap-1">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleSortChange(tab.key)}
              aria-label={tab.label}
              title={tab.label}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                sort === tab.key
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        {/* Selected Organic Tag Badge */}
        {selectedTag && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-950/40 px-3 py-1 text-xs text-red-300 ring-1 ring-red-900/60">
            <span>#{selectedTag}</span>
            <button
              type="button"
              onClick={() => handleTagChange(null)}
              aria-label="Clear tag filter"
              className="rounded-full p-0.5 text-red-300 hover:bg-red-900/40"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* Confessions Stream */}
      <div className="space-y-3.5">
        {isLoading ? (
          <>
            <ConfessionSkeleton />
            <ConfessionSkeleton />
            <ConfessionSkeleton />
          </>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-zinc-900 bg-[#070707] py-12 text-center px-4">
            <p className="text-sm text-zinc-400">
              {sort === "following"
                ? "You haven't followed any authors yet. Explore the feed and follow people to see their thoughts here! 👻"
                : community
                  ? "No confessions in this community yet. Be the first to vent! 🔥"
                  : "No confessions found for this filter."}
            </p>
          </div>
        ) : (
          items.map((confession) => (
            <ConfessionCard
              key={confession.id}
              confession={confession}
              onTagClick={(tag) => handleTagChange(tag)}
            />
          ))
        )}
      </div>

      {/* Infinite Scroll Trigger & Bottom States */}
      <div ref={ref} className="py-4 text-center">
        {isFetchingNext && (
          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
            <span>Digging deeper into the void...</span>
          </div>
        )}

        {!hasMore && !isLoading && items.length > 0 && (
          <p className="text-xs text-zinc-600">
            You have reached the end of the void.
          </p>
        )}
      </div>
    </div>
  );
}
