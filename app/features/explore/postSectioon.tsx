// app/features/explore/posts-section.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronRight,
  Flame,
  HeartHandshake,
  MessageSquare,
  X,
} from "lucide-react";
import { fetchTopDiscoveredPosts } from "./api";
import { ExplorePostCard } from "./explorePostCard";
import { LoadMoreButton } from "./exploreUi";
import { DiscoveryTabType, ExplorePost } from "./types";

const TRENDING_COUNT = 4;
const POPULAR_PREVIEW_COUNT = 6;
// preview ma trending (4) + popular (6) dubai chahinxa
const PREVIEW_COUNT = TRENDING_COUNT + POPULAR_PREVIEW_COUNT;
const PAGE_SIZE = 12;

const compact = new Intl.NumberFormat("en", { notation: "compact" });

/* Trending = jasma sabbhanda dherai react + comment xa */
function engagementOf(post: ExplorePost) {
  return post.relateCount + post.burnCount + post.commentCount;
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionHeader({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <h2 className="text-xl font-bold text-zinc-100">{title}</h2>
      {onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="inline-flex items-center gap-0.5 text-sm font-medium text-red-400 hover:text-red-300 transition cursor-pointer"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function Counts({ post, className = "" }: { post: ExplorePost; className?: string }) {
  return (
    <span className={`flex items-center gap-4 ${className}`}>
      <span className="flex items-center gap-1.5">
        <HeartHandshake className="w-3.5 h-3.5" />
        {compact.format(post.relateCount)}
      </span>
      <span className="flex items-center gap-1.5 text-[#ef4444]">
        <Flame className="w-3.5 h-3.5 fill-[#991b1b]/60" />
        {compact.format(post.burnCount)}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageSquare className="w-3.5 h-3.5" />
        {compact.format(post.commentCount)}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Trending row (compact, like "Trending conversations")              */
/* ------------------------------------------------------------------ */

function TrendingRow({
  post,
  rank,
  onOpen,
}: {
  post: ExplorePost;
  rank: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open trending post by ${post.author}`}
      className="flex w-full items-center gap-3 text-left cursor-pointer px-1 py-3.5 border-b border-zinc-900 hover:bg-[#991b1b]/5 transition"
    >
      <span className="w-6 shrink-0 text-lg font-bold text-[#991b1b]">
        {rank}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        {post.isSensitive ? (
          <p className="flex items-center gap-1.5 text-sm font-medium text-red-400/90">
            <AlertTriangle className="w-4 h-4" />
            Sensitive content
          </p>
        ) : (
          <p className="break-words text-[15px] font-medium leading-snug text-zinc-100 line-clamp-2">
            {post.content}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-zinc-500">
          {post.moodLabel && (
            <span className="truncate max-w-[40%] text-red-300/70">
              {post.moodLabel}
            </span>
          )}
          <Counts post={post} />
        </div>
      </div>

      <ChevronRight className="w-4 h-4 shrink-0 text-zinc-500" />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Popular row (feed style)                                            */
/* ------------------------------------------------------------------ */

function PostRow({
  post,
  onOpen,
}: {
  post: ExplorePost;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open post by ${post.author}`}
      className="block w-full text-left cursor-pointer px-1 py-4 border-b border-zinc-900 hover:bg-[#991b1b]/5 transition"
    >
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 shrink-0 rounded-full bg-[#991b1b] text-white flex items-center justify-center text-base font-semibold">
          {post.avatarSeed}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-zinc-100 truncate leading-tight">
            {post.author}
          </p>
          <p className="text-xs text-zinc-500 truncate">{post.authorTag}</p>
        </div>

        {post.moodLabel && (
          <span className="shrink-0 max-w-[40%] truncate rounded-full border border-[#991b1b]/40 bg-[#991b1b]/10 px-2.5 py-0.5 text-[11px] font-medium text-red-300/80">
            {post.moodLabel}
          </span>
        )}
      </div>

      <div className="relative mt-3">
        <p
          className={`break-words text-[17px] leading-snug text-zinc-100 line-clamp-6 ${
            post.isSensitive ? "blur-sm select-none" : ""
          }`}
        >
          {post.content}
        </p>

        {post.isSensitive && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none text-red-400/90 text-xs font-medium">
            <AlertTriangle className="w-4 h-4" />
            Sensitive content
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-8 text-sm text-zinc-400">
        <span className="flex items-center gap-2">
          <MessageSquare className="w-[18px] h-[18px]" />
          {compact.format(post.commentCount)}
        </span>
        <span className="flex items-center gap-2">
          <HeartHandshake className="w-[18px] h-[18px]" />
          {compact.format(post.relateCount)}
        </span>
        <span className="flex items-center gap-2 text-[#ef4444]">
          <Flame className="w-[18px] h-[18px] fill-[#991b1b]/60" />
          {compact.format(post.burnCount)}
        </span>
      </div>
    </button>
  );
}

function PostModal({
  post,
  onClose,
}: {
  post: ExplorePost;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Post"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050505]/90 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close post"
        className="absolute top-4 right-4 p-2 rounded-full text-zinc-300 hover:text-white hover:bg-[#991b1b]/30 transition cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <ExplorePostCard post={post} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Skeletons                                                           */
/* ------------------------------------------------------------------ */

function TrendingSkeleton({ count }: { count: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-1 py-3.5 border-b border-zinc-900 animate-pulse"
        >
          <div className="w-6 h-5 rounded bg-[#0a0a0a]" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-4/5 rounded bg-[#0a0a0a]" />
            <div className="h-2.5 w-1/3 rounded bg-[#0a0a0a]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="px-1 py-4 border-b border-zinc-900 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0a0a0a] ring-1 ring-inset ring-zinc-900" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-32 rounded bg-[#0a0a0a]" />
              <div className="h-2.5 w-20 rounded bg-[#0a0a0a]" />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-3.5 w-full rounded bg-[#0a0a0a]" />
            <div className="h-3.5 w-3/5 rounded bg-[#0a0a0a]" />
          </div>
          <div className="mt-4 flex gap-8">
            <div className="h-3 w-10 rounded bg-[#0a0a0a]" />
            <div className="h-3 w-10 rounded bg-[#0a0a0a]" />
            <div className="h-3 w-10 rounded bg-[#0a0a0a]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface DiscoveryPostsProps {
  tab: DiscoveryTabType;
  onTabChange: (tab: DiscoveryTabType) => void;
  /** "preview" = Trending (4) + Popular (6), "full" = Popular only, 12 per page + Load More */
  variant: "preview" | "full";
  /** Popular vents ko "See all" (full page kholne) */
  onExploreMore?: () => void;
  /** Trending vents ko "See all" */
  onSeeAllTrending?: () => void;
}

export function DiscoveryPosts({
  tab,
  onTabChange,
  variant,
  onExploreMore,
  onSeeAllTrending,
}: DiscoveryPostsProps) {
  const isPreview = variant === "preview";
  const limit = isPreview ? PREVIEW_COUNT : PAGE_SIZE;

  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selected, setSelected] = useState<ExplorePost | null>(null);

  const closeModal = useCallback(() => setSelected(null), []);

  // Top 4 by engagement, ani popular list bata tiniharu hataune (duplicate nahos)
  const { trending, popular } = useMemo(() => {
    if (!isPreview) return { trending: [] as ExplorePost[], popular: posts };
    const top = [...posts]
      .sort((a, b) => engagementOf(b) - engagementOf(a))
      .slice(0, TRENDING_COUNT);
    const topIds = new Set(top.map((p) => p.id));
    return {
      trending: top,
      popular: posts.filter((p) => !topIds.has(p.id)),
    };
  }, [posts, isPreview]);

  useEffect(() => {
    let ignore = false;
    setIsLoading(true);
    (async () => {
      try {
        const data = await fetchTopDiscoveredPosts({ tab, page: 1, limit });
        if (!ignore) {
          setPosts(data.posts);
          setHasMore(data.hasMore);
          setPage(1);
        }
      } catch (err) {
        if (!ignore) console.error("Failed to load posts:", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [tab, limit]);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await fetchTopDiscoveredPosts({
        tab,
        page: nextPage,
        limit,
      });
      setPosts((prev) => [...prev, ...data.posts]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ---------------- Trending vents (preview only) ---------------- */}
      {isPreview && (
        <section className="space-y-1">
          <SectionHeader title="Trending vents" onSeeAll={onSeeAllTrending} />

          {isLoading ? (
            <TrendingSkeleton count={TRENDING_COUNT} />
          ) : trending.length > 0 ? (
            <div>
              {trending.map((post, i) => (
                <TrendingRow
                  key={post.id}
                  post={post}
                  rank={i + 1}
                  onOpen={() => setSelected(post)}
                />
              ))}
            </div>
          ) : null}
        </section>
      )}

      {/* ---------------- Popular vents ---------------- */}
      <section className="space-y-2">
        <SectionHeader
          title="Popular vents"
          onSeeAll={isPreview ? onExploreMore : undefined}
        />

        {isLoading ? (
          <ListSkeleton count={isPreview ? POPULAR_PREVIEW_COUNT : limit} />
        ) : popular.length > 0 ? (
          <div className="space-y-4">
            <div>
              {popular.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  onOpen={() => setSelected(post)}
                />
              ))}
            </div>

            {variant === "full" && hasMore && (
              <LoadMoreButton
                onClick={handleLoadMore}
                loading={isLoadingMore}
                label="Load More Vents ↓"
                loadingLabel="Loading more vents..."
              />
            )}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-900 rounded-xl bg-[#0a0a0a]">
            <p className="text-sm text-zinc-400">No vents here yet.</p>
          </div>
        )}
      </section>

      {selected && <PostModal post={selected} onClose={closeModal} />}
    </div>
  );
}