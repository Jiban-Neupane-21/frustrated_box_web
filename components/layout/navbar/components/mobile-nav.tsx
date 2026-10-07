"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, X, Shield, ArrowRightLeft } from "lucide-react";
import { NavLinkItem, UserSession, NavMode, CreateActionType } from "../types";

interface MobileNavProps {
  items: NavLinkItem[];
  session: UserSession | null;
  onSwitchMode: (mode: NavMode, communitySlug?: string) => void;
  onSelectAction?: (type: CreateActionType) => void;
}

export function MobileNav({
  items,
  session,
  onSwitchMode,
}: MobileNavProps) {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      {/* 1. Mobile Bottom Navigation Bar (Instagram/Facebook Style) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-zinc-800/80 bg-[#050505]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <React.Fragment key={item.id}>
              {/* Primary Tab Icon */}
              <Link
                href={item.href}
                aria-label={item.label}
                className="relative flex flex-1 flex-col items-center justify-center py-2 transition"
              >
                <Icon
                  className={`h-5 w-5 transition-transform active:scale-90 ${
                    isActive
                      ? "stroke-[2.5] text-red-500"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                />
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-red-500" />
                )}
              </Link>

              {/* Instagram Style Center '+' Button (Explore पछि आउने गरी) */}
              {item.id === "explore" && (
                <button
                  type="button"
                  aria-label="Create Post or Item"
                  onClick={() => setIsCreateOpen(true)}
                  className="flex flex-1 items-center justify-center py-1"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-800/80 bg-red-950/50 text-red-300 shadow-[0_0_12px_rgba(220,38,38,0.25)] transition-all active:scale-90 hover:bg-red-900/60 hover:text-white">
                    <Plus className="h-5 w-5 stroke-[2.5]" />
                  </span>
                </button>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Instagram-Style Bottom Sheet for Create Actions */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          {/* Backdrop Click to Close */}
          <div className="flex-1" onClick={() => setIsCreateOpen(false)} />

          <div className="relative rounded-t-2xl border-t border-zinc-800 bg-[#09090b] px-4 pb-8 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Sheet Drag Handle */}
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-700" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
              <span className="text-sm font-semibold text-zinc-100">
                Create New
              </span>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Action List */}

            {/* Moderated Communities Switcher (यदि moderator हो भने) */}
            {session && session.managedCommunities.length > 0 && (
              <div className="mt-4 border-t border-zinc-800/70 pt-3">
                <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  Switch to Moderation
                </p>
                <div className="flex flex-col gap-1">
                  {session.managedCommunities.map((comm) => (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => {
                        setIsCreateOpen(false);
                        onSwitchMode("community-admin", comm.slug);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-amber-400/90 hover:bg-zinc-800/60 transition"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Shield className="h-3.5 w-3.5 text-amber-500" />
                        c/{comm.slug}
                      </span>
                      <ArrowRightLeft className="h-3 w-3 text-zinc-500" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
