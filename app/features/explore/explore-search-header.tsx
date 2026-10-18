"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, Sparkles } from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter?: string | null;
  onClearFilter?: () => void;
}

export function ExploreSearchHeader({
  searchQuery,
  setSearchQuery,
  activeFilter,
  onClearFilter,
}: SearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K shortcut focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full space-y-2.5">
      {/* Search Input Container */}
      <div className="relative flex items-center w-full">
        <div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
          <Search className="w-4 h-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search thoughts, #tags, or raw vents..."
          className="w-full pl-10 pr-20 py-2.5 bg-[#0a0a0a] border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900 transition-all shadow-inner"
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(activeFilter || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
          <span className="text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-500" />
            Filtering by:
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              Keyword:{" "}
              <span className="text-red-400 font-medium">{searchQuery}</span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:text-red-300 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeFilter && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-red-900/50 text-red-300">
              Mood: <span className="font-medium">{activeFilter}</span>
              {onClearFilter && (
                <button
                  type="button"
                  onClick={onClearFilter}
                  className="hover:text-red-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              if (onClearFilter) onClearFilter();
            }}
            className="text-zinc-500 hover:text-zinc-300 text-[11px] underline ml-auto transition-colors"
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
