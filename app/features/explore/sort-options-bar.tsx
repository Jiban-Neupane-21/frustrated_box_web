"use client";

import React from "react";
import { Flame, HeartHandshake, Clock } from "lucide-react";

export type SortOptionType = "burning" | "relatable" | "latest";

interface SortOptionsBarProps {
  activeSort: SortOptionType;
  onSortChange: (sort: SortOptionType) => void;
}

export function SortOptionsBar({
  activeSort,
  onSortChange,
}: SortOptionsBarProps) {
  const tabs = [
    {
      id: "burning" as SortOptionType,
      label: "Burning Now",
      icon: Flame,
    },
    {
      id: "relatable" as SortOptionType,
      label: "Most Relatable",
      icon: HeartHandshake,
    },
    {
      id: "latest" as SortOptionType,
      label: "Latest",
      icon: Clock,
    },
  ];

  return (
    <div className="w-full flex items-center border-b border-zinc-900 pt-2 pb-1">
      <div className="flex items-center gap-1 sm:gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSort === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSortChange(tab.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                isActive ? "text-red-400" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? "text-red-500" : "text-zinc-500"
                }`}
              />
              <span>{tab.label}</span>

              {/* Active Tab Underline Indicator */}
              {isActive && (
                <div className="absolute bottom-1.5 left-0 right-0 h-0.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(220,38,38,0.7)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
