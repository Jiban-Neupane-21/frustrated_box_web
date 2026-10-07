"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  User,
  Flame,
  LogOut,
  Settings,
  ShieldCheck,
  Shield,
  Bookmark,
  History,
  MoreHorizontal,
  ArrowRightLeft,
  ArrowLeft,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { UserSession, NavMode } from "../navbar/types";
import { CONSUMER_NAV_LINKS } from "../navbar/config/nav-links";
import { PLATFORM_ADMIN_NAV_LINKS } from "../navbar/config/admin-nav";
import { getCommunityModNavLinks } from "../navbar/config/community-mod-nav";

interface DesktopSidebarProps {
  session?: UserSession | null;
  onOpenCreateModal?: () => void;
  navMode?: NavMode;
  activeCommunity?: string;
  onSwitchMode?: (mode: NavMode, communitySlug?: string) => void;
}

export function DesktopSidebar({
  session = null,
  onOpenCreateModal,
  navMode = "consumer",
  activeCommunity = "",
  onSwitchMode,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user popup on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreate = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      router.push("/#vent-box");
    }
  };

  // Moderator community pending count for currently active community
  const activeManagedCommunity = session?.managedCommunities?.find(
    (c) => c.slug === activeCommunity
  );
  const activeCommunityPendingCount = activeManagedCommunity?.pendingReportsCount || 0;

  // Determine which navigation links to display based on active navMode
  const isPlatformAdmin = navMode === "platform-admin";
  const isCommunityAdmin = navMode === "community-admin";

  const consumerNavLinks = [
    ...CONSUMER_NAV_LINKS,
    ...(session
      ? [
          {
            id: "notifications",
            label: "Notifications",
            href: "/notifications",
            icon: Bell,
          },
          {
            id: "profile",
            label: "Profile",
            href: `/profile/@${session.username}`,
            icon: User,
          },
        ]
      : []),
    ...(session?.role === "admin"
      ? [
          {
            id: "admin-console",
            label: "Admin Console",
            href: "/admin",
            icon: ShieldCheck,
            badge: "Admin",
          },
        ]
      : []),
  ];

  const currentNavLinks = isPlatformAdmin
    ? PLATFORM_ADMIN_NAV_LINKS
    : isCommunityAdmin
    ? getCommunityModNavLinks(activeCommunity || "community", activeCommunityPendingCount)
    : consumerNavLinks;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-zinc-800/60 px-3 py-4 lg:flex xl:w-72">
      {/* Top: Logo & Navigation */}
      <div className="flex flex-col gap-5 overflow-y-auto pr-1">
        {/* Header: Mode-Specific Brand / Workspace Header */}
        <div className="px-2">
          {isPlatformAdmin ? (
            <div className="flex items-center justify-between rounded-xl border border-red-900/40 bg-red-950/20 p-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-xs font-bold text-white">Platform Admin</p>
                  <p className="text-[10px] font-semibold text-red-400">Super Admin</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSwitchMode?.("consumer")}
                className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                title="Exit Admin Console"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Exit</span>
              </button>
            </div>
          ) : isCommunityAdmin ? (
            <div className="flex items-center justify-between rounded-xl border border-amber-900/40 bg-amber-950/20 p-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Shield className="h-5 w-5 text-amber-500 shrink-0" />
                <div className="min-w-0 truncate">
                  <p className="text-xs font-bold text-white truncate">
                    c/{activeCommunity || "community"}
                  </p>
                  <p className="text-[10px] font-semibold text-amber-400">Mod Workspace</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSwitchMode?.("consumer")}
                className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white shrink-0"
                title="Exit Community Workspace"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Exit</span>
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center transition-transform hover:scale-[1.02]"
              aria-label="Frustrated Box Home"
            >
              <Logo size={36} showText={true} />
            </Link>
          )}
        </div>

        {/* Vertical Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {currentNavLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isAdminConsoleItem = item.id === "admin-console";

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (isAdminConsoleItem && onSwitchMode) {
                    onSwitchMode("platform-admin");
                  }
                }}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-zinc-900 text-red-500 font-bold shadow-sm"
                    : isPlatformAdmin
                    ? "text-zinc-300 hover:bg-red-950/20 hover:text-red-300"
                    : isCommunityAdmin
                    ? "text-zinc-300 hover:bg-amber-950/20 hover:text-amber-300"
                    : "text-zinc-300 hover:bg-zinc-900/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-red-500"
                        : isAdminConsoleItem
                        ? "text-red-400"
                        : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded-full bg-red-950 px-2 py-0.5 text-[9px] font-bold text-red-400 border border-red-800/60">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Primary CTA: Drop a Vent (Visible in consumer view) */}
        {!isPlatformAdmin && !isCommunityAdmin && (
          <div className="mt-1 px-1">
            <button
              type="button"
              onClick={handleCreate}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl border border-red-700/60 bg-linear-to-r from-red-600 to-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:border-red-500 hover:from-red-500 hover:to-red-600 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] active:scale-[0.98]"
            >
              <Flame className="h-4 w-4 animate-pulse text-amber-300" />
              <span>Drop a Vent</span>
            </button>
          </div>
        )}

        {/* Community Moderator Workspaces (Visible in consumer view if user moderates communities) */}
        {!isPlatformAdmin &&
          !isCommunityAdmin &&
          session &&
          session.managedCommunities &&
          session.managedCommunities.length > 0 && (
            <div className="mt-2 border-t border-zinc-800/80 pt-3">
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Mod Workspaces
              </p>
              <div className="flex flex-col gap-1">
                {session.managedCommunities.map((comm) => (
                  <button
                    key={comm.id}
                    type="button"
                    onClick={() => onSwitchMode?.("community-admin", comm.slug)}
                    className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-900 hover:text-amber-400 text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Shield className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">c/{comm.slug}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {comm.pendingReportsCount && comm.pendingReportsCount > 0 ? (
                        <span className="rounded-full bg-red-950 px-1.5 py-0.2 text-[9px] font-bold text-red-400 border border-red-800/60">
                          {comm.pendingReportsCount}
                        </span>
                      ) : (
                        <span className="rounded bg-amber-950/40 px-1.5 py-0.5 text-[9px] text-amber-400 border border-amber-900/30">
                          Mod
                        </span>
                      )}
                      <ArrowRightLeft className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Bottom: User Profile Section / Guest Prompt */}
      <div className="relative pt-3" ref={menuRef}>
        {session ? (
          <>
            {/* User Profile Pill */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2 text-left transition hover:border-zinc-700 hover:bg-zinc-900"
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-red-800/60 bg-red-950 font-bold text-xs text-red-200 shadow-inner">
                  {session.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <p className="truncate text-xs font-semibold text-zinc-100">
                      {session.displayName || session.username}
                    </p>
                    {session.role === "admin" && (
                      <span className="rounded bg-red-950 px-1 py-0.2 text-[9px] font-bold text-red-400 border border-red-800/60 shrink-0">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[10px] text-zinc-500">
                    @{session.username}
                  </p>
                </div>
              </div>
              <MoreHorizontal className="h-4 w-4 shrink-0 text-zinc-500" />
            </button>

            {/* Popup Menu (Opens upwards) */}
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute bottom-full left-0 mb-2 w-full rounded-2xl border border-zinc-800 bg-[#09090b]/98 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100 z-50"
              >
                <div className="border-b border-zinc-800/80 px-3 py-2 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-zinc-100">
                      {session.displayName || session.username}
                    </p>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 uppercase">
                      {session.role}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-500">@{session.username}</p>
                </div>

                <Link
                  href={`/profile/@${session.username}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                >
                  <User className="h-3.5 w-3.5 text-zinc-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/profile/history"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                >
                  <History className="h-3.5 w-3.5 text-zinc-400" />
                  <span>My Vents History</span>
                </Link>

                <Link
                  href="/profile/saved"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
                >
                  <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Saved Posts</span>
                </Link>

                {/* Mod Workspaces in popup */}
                {session.managedCommunities && session.managedCommunities.length > 0 && (
                  <div className="mt-1 border-t border-zinc-800/80 pt-1">
                    <p className="px-2.5 py-1 text-[9px] font-bold text-amber-500 uppercase">
                      Mod Workspace
                    </p>
                    {session.managedCommunities.map((comm) => (
                      <button
                        key={comm.id}
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSwitchMode?.("community-admin", comm.slug);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-900 hover:text-amber-400 text-left"
                      >
                        <span className="truncate">c/{comm.slug}</span>
                        {comm.pendingReportsCount && comm.pendingReportsCount > 0 ? (
                          <span className="rounded bg-red-950 px-1 py-0.2 text-[9px] font-bold text-red-400">
                            {comm.pendingReportsCount}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}

                {/* Admin Console in popup */}
                {session.role === "admin" && (
                  <div className="mt-1 border-t border-zinc-800/80 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onSwitchMode?.("platform-admin");
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-red-400 transition hover:bg-red-950/30 text-left"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-red-400" />
                      <span>Admin Console</span>
                    </button>
                  </div>
                )}

                <div className="mt-1 border-t border-zinc-800/80 pt-1">
                  <Link
                    href="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    href="/api/auth/signout"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-zinc-400 transition hover:bg-red-950/40 hover:text-red-400"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Guest Mini Card */
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
            <p className="text-xs font-semibold text-zinc-300">Got frustration?</p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              Log in to save vents and join communities.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <Link
                href="/login"
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 text-center text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="flex-1 rounded-lg border border-red-800/60 bg-red-950/40 py-1.5 text-center text-xs font-semibold text-red-200 transition hover:bg-red-900/60 hover:text-white"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
