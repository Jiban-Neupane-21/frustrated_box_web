"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Grid3x3, Lock, Bookmark, Shield, Activity } from "lucide-react";
import { getVisibleTabs, type ProfileTab } from "../types";

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  isOwnProfile: boolean;
}

const TAB_META: Record<ProfileTab, { label: string; icon: ReactNode }> = {
  public: { label: "Public", icon: <Grid3x3 className="h-5 w-5" /> },
  private: { label: "Private", icon: <Lock className="h-5 w-5" /> },
  saved: { label: "Saved", icon: <Bookmark className="h-5 w-5" /> },
  communities: { label: "Communities", icon: <Shield className="h-5 w-5" /> },
  activity: { label: "Activity", icon: <Activity className="h-5 w-5" /> },
};

export default function ProfileTabs({
  activeTab,
  onChange,
  isOwnProfile,
}: ProfileTabsProps) {
  const tabs = getVisibleTabs(isOwnProfile);

  // Fallback to the first tab if current tab is not accessible on this profile
  const current: ProfileTab = tabs.includes(activeTab) ? activeTab : tabs[0];

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    const next = tabs[(index + step + tabs.length) % tabs.length];
    onChange(next);
    document.getElementById(`profile-tab-${next}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Profile sections"
      className="mt-4 flex border-b border-zinc-800/80 px-2 sm:px-4"
    >
      {tabs.map((tab, index) => {
        const isActive = tab === current;
        const meta = TAB_META[tab];

        return (
          <button
            key={tab}
            id={`profile-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`profile-panel-${tab}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`relative flex flex-1 items-center justify-center gap-2 px-2 py-3 text-sm font-medium transition ${
              isActive ? "text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {meta.icon}
            {/* Mobile: icon only; sm and above: icon + label */}
            <span className="hidden sm:inline">{meta.label}</span>
            <span className="sr-only sm:hidden">{meta.label}</span>

            {/* Active tab indicator underline */}
            {isActive && (
              <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-red-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}