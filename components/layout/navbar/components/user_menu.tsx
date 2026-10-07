"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  User,
  Bookmark,
  History,
  Settings,
  ShieldCheck,
  Shield,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { UserSession, NavMode } from "../types";

interface UserDropdownProps {
  session: UserSession;
  onSwitchMode: (mode: NavMode, communitySlug?: string) => void;
  onLogout?: () => void;
}

/* Mobile: icon only, centered. sm+: icon + label row */
const itemBase =
  "group relative flex w-full items-center justify-center gap-3 rounded-xl p-1.5 text-left text-sm transition sm:justify-start sm:px-3 sm:py-2.5";

const chevron =
  "hidden h-4 w-4 shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-400 sm:block";

function IconBox({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "amber" | "red";
}) {
  const tones = {
    default:
      "bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-zinc-200",
    amber: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20",
    red: "bg-red-500/10 text-red-400 group-hover:bg-red-500/20",
  };
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* Hidden on mobile rail (the border-t dividers separate sections there) */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="hidden px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 sm:block">
      {children}
    </p>
  );
}

export function UserDropdown({
  session,
  onSwitchMode,
  onLogout,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Portal needs `document`: false on the server, true in the browser
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Escape closes the drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Lock page scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const initials = session.username.slice(0, 2).toUpperCase();
  const close = () => setIsOpen(false);

  const drawer = (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Right slide-in panel
          Mobile: narrow icon rail (w-16)
          sm+: full drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="User menu"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-70 flex h-full w-16 flex-col border-l border-zinc-800 bg-[#09090b] shadow-2xl shadow-black/60 transition-[transform,visibility] duration-300 ease-out sm:w-80 ${
          isOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        {/* Header
            Mobile: close button on top, avatar below (stacked)
            sm+: avatar, name, close button in a row */}
        <div className="relative border-b border-zinc-800/80 bg-linear-to-b from-zinc-900/70 to-transparent px-2 py-3 sm:px-4 sm:py-5">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-3.5">
            {/* Close button: top on mobile, pinned top-right on sm+ */}
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="order-first flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200 sm:absolute sm:right-3 sm:top-3 sm:h-7 sm:w-7"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Avatar with soft ring + admin badge */}
            <span
              title={session.displayName || session.username}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-red-700 to-red-950 text-xs font-bold text-red-50 ring-2 ring-red-500/20 ring-offset-2 ring-offset-[#09090b] sm:h-12 sm:w-12 sm:text-base"
            >
              {initials}

              {session.role === "admin" && (
                <span
                  title="Admin"
                  className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#09090b] bg-red-600 text-white"
                >
                  <ShieldCheck className="h-2.5 w-2.5" />
                </span>
              )}
            </span>

            {/* Name + username (hidden on mobile rail) */}
            <div className="hidden min-w-0 flex-1 pr-9 sm:block">
              <p className="truncate text-sm font-semibold text-zinc-100">
                {session.displayName || session.username}
              </p>
              <p className="truncate text-xs text-zinc-500">
                @{session.username}
              </p>

              {session.role === "admin" && (
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-1.5 sm:p-2">
          <SectionLabel>Account</SectionLabel>

          <Link
            href={`/profile/@${session.username}`}
            onClick={close}
            aria-label="My Profile"
            title="My Profile"
            className={`${itemBase} text-zinc-300 hover:bg-zinc-900 hover:text-white`}
          >
            <IconBox>
              <User className="h-4 w-4" />
            </IconBox>
            <span className="hidden flex-1 sm:inline">My Profile</span>
            <ChevronRight className={chevron} />
          </Link>

          <Link
            href="/profile/history"
            onClick={close}
            aria-label="My Vents History"
            title="My Vents History"
            className={`${itemBase} text-zinc-300 hover:bg-zinc-900 hover:text-white`}
          >
            <IconBox>
              <History className="h-4 w-4" />
            </IconBox>
            <span className="hidden flex-1 sm:inline">My Vents History</span>
            <ChevronRight className={chevron} />
          </Link>

          <Link
            href="/profile/saved"
            onClick={close}
            aria-label="Saved Posts"
            title="Saved Posts"
            className={`${itemBase} text-zinc-300 hover:bg-zinc-900 hover:text-white`}
          >
            <IconBox>
              <Bookmark className="h-4 w-4" />
            </IconBox>
            <span className="hidden flex-1 sm:inline">Saved Posts</span>
            <ChevronRight className={chevron} />
          </Link>

          {/* Community workspaces */}
          {session.managedCommunities.length > 0 && (
            <div className="mt-2 border-t border-zinc-800/80 pt-2 sm:pt-0">
              <SectionLabel>Community Workspace</SectionLabel>
              {session.managedCommunities.map((comm) => {
                const pending = comm.pendingReportsCount ?? 0;
                return (
                  <button
                    key={comm.id}
                    type="button"
                    onClick={() => {
                      close();
                      onSwitchMode("community-admin", comm.slug);
                    }}
                    aria-label={`c/${comm.slug}`}
                    title={`c/${comm.slug}`}
                    className={`${itemBase} text-zinc-300 hover:bg-zinc-900 hover:text-amber-400`}
                  >
                    <IconBox tone="amber">
                      <Shield className="h-4 w-4" />
                    </IconBox>
                    <span className="hidden min-w-0 flex-1 truncate sm:inline">
                      c/{comm.slug}
                    </span>

                    {pending > 0 && (
                      <>
                        {/* Mobile: red dot on the icon corner */}
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-[#09090b] sm:hidden" />
                        {/* sm+: number pill */}
                        <span className="hidden rounded-full border border-red-800/60 bg-red-950 px-1.5 py-px text-[10px] font-bold text-red-400 sm:inline">
                          {pending}
                        </span>
                      </>
                    )}
                    <ChevronRight className={chevron} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Platform admin */}
          {session.role === "admin" && (
            <div className="mt-2 border-t border-zinc-800/80 pt-2 sm:pt-0">
              <SectionLabel>Platform</SectionLabel>
              <button
                type="button"
                onClick={() => {
                  close();
                  onSwitchMode("platform-admin");
                }}
                aria-label="Admin Console"
                title="Admin Console"
                className={`${itemBase} text-red-400 hover:bg-red-500/10`}
              >
                <IconBox tone="red">
                  <ShieldCheck className="h-4 w-4" />
                </IconBox>
                <span className="hidden flex-1 sm:inline">Admin Console</span>
                <ChevronRight
                  className={`${chevron} text-red-400/50 group-hover:text-red-400`}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer: always pinned at the bottom */}
        <div className="border-t border-zinc-800/80 p-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] sm:p-2 sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <Link
            href="/settings"
            onClick={close}
            aria-label="Settings"
            title="Settings"
            className={`${itemBase} text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200`}
          >
            <IconBox>
              <Settings className="h-4 w-4" />
            </IconBox>
            <span className="hidden sm:inline">Settings</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              close();
              onLogout?.();
            }}
            aria-label="Sign Out"
            title="Sign Out"
            className={`${itemBase} text-zinc-400 hover:bg-red-500/10 hover:text-red-400`}
          >
            <IconBox>
              <LogOut className="h-4 w-4" />
            </IconBox>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label="Open menu"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-200"
      >
        <Menu className="h-4 w-4" />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
