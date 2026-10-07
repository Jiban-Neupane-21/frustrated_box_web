"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { UserSession, NavMode, CreateActionType } from "./types";
import { CONSUMER_NAV_LINKS } from "./config/nav-links";
import { AuthButtons } from "./components/auth-buttons";
import { UserDropdown } from "./components/user_menu";
import { CommunityModBar } from "./components/community-mod-bar";
import { PlatformAdminBar } from "./components/platform-admin-bar";

interface NavbarProps {
  session?: UserSession | null;
  onOpenCreateModal?: (type: CreateActionType) => void;
  navMode?: NavMode;
  activeCommunity?: string;
  onSwitchMode?: (mode: NavMode, communitySlug?: string) => void;
}

export function Navbar({
  session = null,
  navMode: controlledNavMode,
  activeCommunity: controlledActiveCommunity,
  onSwitchMode: controlledOnSwitchMode,
}: NavbarProps) {
  const pathname = usePathname();
  const [localNavMode, setLocalNavMode] = useState<NavMode>("consumer");
  const [localActiveCommunity, setLocalActiveCommunity] = useState<string>("");

  const navMode = controlledNavMode ?? localNavMode;
  const activeCommunity = controlledActiveCommunity ?? localActiveCommunity;

  // Handles switching into and out of community moderation mode
  const handleSwitchMode = (mode: NavMode, communitySlug?: string) => {
    if (controlledOnSwitchMode) {
      controlledOnSwitchMode(mode, communitySlug);
    } else {
      setLocalNavMode(mode);
      if (communitySlug) setLocalActiveCommunity(communitySlug);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#050505]/80 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        {navMode === "community-admin" ? (
          /* Dedicated Community Moderator Bar */
          <CommunityModBar
            communitySlug={activeCommunity}
            onExit={() => handleSwitchMode("consumer")}
          />
        ) : navMode === "platform-admin" ? (
          <PlatformAdminBar onExit={() => handleSwitchMode("consumer")} />
        ) : (
          /* Standard Consumer Navigation */
          <>
            {/* Left: Logo (fixed size) */}
            <Link
              href="/"
              className="shrink-0 transition-transform hover:scale-[1.02]"
            >
              <Logo
                size={34}
                showText={true}
                className="[&>span]:hidden sm:[&>span]:inline"
              />
            </Link>

            {/* Middle: Nav takes all remaining space
                Mobile: icons evenly spread
                Desktop: centered */}
            <nav className="flex min-w-0 flex-1 items-center justify-evenly gap-1 md:justify-center md:gap-2">
              {CONSUMER_NAV_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    className={`flex items-center justify-center gap-2 rounded-lg p-2 text-xs font-medium transition sm:text-sm md:px-3 md:py-1.5 ${
                      isActive
                        ? "bg-zinc-900 font-semibold text-red-500"
                        : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (fixed size) */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {session ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/notifications"
                    className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
                    aria-label="View notifications"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-600 ring-2 ring-[#050505]" />
                  </Link>

                  <UserDropdown
                    session={session}
                    onSwitchMode={handleSwitchMode}
                  />
                </div>
              ) : (
                <AuthButtons />
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}

// Named exports for easy access across the application
export * from "./types";
export * from "./config/nav-links";
