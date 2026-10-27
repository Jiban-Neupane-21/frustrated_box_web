// app/features/explore/community-slider.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CommunityCard } from "./CommunityCard";
import { SearchCommunity } from "./types";

interface CommunitySliderProps {
  communities: SearchCommunity[];
  joined: Record<string, boolean>;
  onToggleJoin: (id: string) => void;
  /** If given, a final "Explore more" tile is added at the end of the slider */
  onExploreMore?: () => void;
}

const TRACK_CLASSES =
  "flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export function CommunitySlider({
  communities,
  joined,
  onToggleJoin,
  onExploreMore,
}: CommunitySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateArrows, communities.length]);

  const slide = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrowClasses =
    "absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-zinc-950/90 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 flex items-center justify-center shadow-lg transition cursor-pointer";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => slide(-1)}
        aria-label="Previous communities"
        tabIndex={canPrev ? 0 : -1}
        className={`${arrowClasses} left-1 ${
          canPrev ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div ref={trackRef} onScroll={updateArrows} className={TRACK_CLASSES}>
        {communities.map((comm) => (
          <CommunityCard
            key={comm.id}
            comm={comm}
            variant="slide"
            isJoined={joined[comm.id] ?? comm.isJoined ?? false}
            onToggleJoin={onToggleJoin}
          />
        ))}

        {onExploreMore && (
          <button
            type="button"
            onClick={onExploreMore}
            className="w-36 shrink-0 snap-start rounded-xl border border-dashed border-zinc-800 hover:border-zinc-600 bg-zinc-950/30 text-zinc-400 hover:text-red-400 transition flex flex-col items-center justify-center gap-2 text-xs font-medium cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            Explore more
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => slide(1)}
        aria-label="Next communities"
        tabIndex={canNext ? 0 : -1}
        className={`${arrowClasses} right-1 ${
          canNext ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function CommunitySliderSkeleton() {
  return (
    <div className={`${TRACK_CLASSES} animate-pulse overflow-hidden`}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-56 h-[132px] shrink-0 rounded-xl bg-zinc-900/50 border border-zinc-900"
        />
      ))}
    </div>
  );
}