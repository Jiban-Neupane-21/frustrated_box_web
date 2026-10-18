// app/features/explore/communities-section.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import { fetchExploreCommunities } from "./api";
import { CommunityCard } from "./CommunityCard";
import { CommunitySlider, CommunitySliderSkeleton } from "./communitySlider";
import {
  BackButton,
  LoadMoreButton,
  SectionTitle,
  TextButton,
} from "./exploreUi";
import { SearchCommunity } from "./types";

const PREVIEW_COUNT = 6;
const PAGE_SIZE = 12;

interface JoinProps {
  joined: Record<string, boolean>;
  onToggleJoin: (id: string) => void;
}

/** Plain list/grid of communities (used by "All communities" and search "Communities" tab) */
export function CommunityGrid({
  communities,
  joined,
  onToggleJoin,
}: JoinProps & { communities: SearchCommunity[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {communities.map((comm) => (
        <CommunityCard
          key={comm.id}
          comm={comm}
          isJoined={joined[comm.id] ?? comm.isJoined ?? false}
          onToggleJoin={onToggleJoin}
        />
      ))}
    </div>
  );
}

/** Explore home: 6 random communities in a left/right slider */
export function CommunitiesPreview({
  joined,
  onToggleJoin,
  onExploreMore,
}: JoinProps & { onExploreMore: () => void }) {
  const [communities, setCommunities] = useState<SearchCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchExploreCommunities({
          page: 1,
          limit: PREVIEW_COUNT,
          random: true,
        });
        if (!ignore) setCommunities(data.communities);
      } catch (err) {
        console.error("Failed to load communities:", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="space-y-3">
      <SectionTitle
        icon={<Users className="w-3.5 h-3.5 text-red-400" />}
        action={
          <TextButton onClick={onExploreMore}>
            Explore more <ArrowRight className="w-3 h-3" />
          </TextButton>
        }
      >
        Communities to explore
      </SectionTitle>

      {isLoading ? (
        <CommunitySliderSkeleton />
      ) : communities.length > 0 ? (
        <CommunitySlider
          communities={communities}
          joined={joined}
          onToggleJoin={onToggleJoin}
          onExploreMore={onExploreMore}
        />
      ) : (
        <p className="text-xs text-zinc-500 px-1">No communities yet.</p>
      )}
    </section>
  );
}

/** "Explore more" view: every community, paginated */
export function AllCommunitiesView({
  joined,
  onToggleJoin,
  onBack,
}: JoinProps & { onBack: () => void }) {
  const [communities, setCommunities] = useState<SearchCommunity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await fetchExploreCommunities({
          page: 1,
          limit: PAGE_SIZE,
        });
        if (!ignore) {
          setCommunities(data.communities);
          setHasMore(data.hasMore);
        }
      } catch (err) {
        console.error("Failed to load all communities:", err);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    try {
      const data = await fetchExploreCommunities({
        page: nextPage,
        limit: PAGE_SIZE,
      });
      setCommunities((prev) => [...prev, ...data.communities]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more communities:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="space-y-4">
      <BackButton onClick={onBack} label="Back to Explore" />
      <SectionTitle icon={<Users className="w-3.5 h-3.5 text-red-400" />}>
        All Communities
      </SectionTitle>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[76px] rounded-xl bg-zinc-900/50 border border-zinc-900"
            />
          ))}
        </div>
      ) : (
        <>
          <CommunityGrid
            communities={communities}
            joined={joined}
            onToggleJoin={onToggleJoin}
          />
          {hasMore && (
            <LoadMoreButton
              onClick={handleLoadMore}
              loading={isLoadingMore}
              label="Load More Communities ↓"
              loadingLabel="Loading more communities..."
            />
          )}
        </>
      )}
    </div>
  );
}