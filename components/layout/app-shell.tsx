"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import { DesktopSidebar } from "./sidebar";
import { RightPanel } from "./right-panel";
import { UserSession, NavMode } from "./navbar/types";

interface AppShellProps {
  children: React.ReactNode;
  session?: UserSession | null;
}

export function AppShell({ children, session = null }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Local manual mode fallback when not on dedicated URL route
  const [manualNavMode, setManualNavMode] = useState<NavMode>("consumer");
  const [manualActiveCommunity, setManualActiveCommunity] = useState<string>("");

  // Derive active navigation mode directly from URL
  const isPlatformAdminRoute = pathname.startsWith("/admin");
  const communityMatch = pathname.match(/\/c\/([^/]+)\/mod/);
  const isCommunityAdminRoute = Boolean(pathname.startsWith("/c/") && communityMatch);

  const navMode: NavMode = isPlatformAdminRoute
    ? "platform-admin"
    : isCommunityAdminRoute
    ? "community-admin"
    : manualNavMode;

  const activeCommunity =
    isCommunityAdminRoute && communityMatch?.[1]
      ? communityMatch[1]
      : manualActiveCommunity;

  const handleSwitchMode = (mode: NavMode, communitySlug?: string) => {
    setManualNavMode(mode);
    if (mode === "community-admin" && communitySlug) {
      setManualActiveCommunity(communitySlug);
      router.push(`/c/${communitySlug}/mod`);
    } else if (mode === "platform-admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#050505] text-zinc-100 selection:bg-red-900/60 selection:text-red-200">
      {/* Mobile & Tablet Top Navbar (< 1024px) */}
      <Navbar
        session={session}
        navMode={navMode}
        activeCommunity={activeCommunity}
        onSwitchMode={handleSwitchMode}
      />

      {/* 3-Column Responsive Shell */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center px-0 sm:px-4 lg:px-6">
        {/* Left Column: Twitter-style Sidebar (Desktop >= 1024px) */}
        <DesktopSidebar
          session={session}
          navMode={navMode}
          activeCommunity={activeCommunity}
          onSwitchMode={handleSwitchMode}
        />

        {/* Center Column: Main Feed / Page Content */}
        <div className="flex-1 min-w-0 max-w-2xl border-zinc-800/60 min-h-screen lg:border-x">
          {children}
        </div>

        {/* Right Column: Trending & Discovery panel (Desktop >= 1280px) */}
        <RightPanel />
      </div>
    </div>
  );
}
