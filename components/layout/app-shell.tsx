"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import { DesktopSidebar } from "./sidebar";
import { RightPanel } from "./right-panel";
import { UserSession, NavMode, GlobalRole } from "./navbar/types";
import { useAuth } from "@/components/AuthContext";
import { LogoutConfirmModal } from "@/components/auth/LogoutConfirmModal";

interface AppShellProps {
  children: React.ReactNode;
  session?: UserSession | null;
}

// Uppercase backend role ("ADMIN" | "MODERATOR" | "USER") lai navbar role ("admin" | "user" | "guest") ma convert garne
function normalizeRole(role?: string): GlobalRole {
  if (!role) return "guest";
  const lower = role.toLowerCase();
  if (lower === "admin") return "admin";
  return "user";
}

export function AppShell({ children, session = null }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Local manual mode fallback when not on dedicated URL route
  const [manualNavMode, setManualNavMode] = useState<NavMode>("consumer");
  const [manualActiveCommunity, setManualActiveCommunity] =
    useState<string>("");

  // Clean mapping: Normalize session from AuthContext
  const currentSession: UserSession | null =
    session ||
    (isAuthenticated && user
      ? {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: normalizeRole(user.role),
          avatarUrl: user.profile?.avatarUrl,
          managedCommunities: user.managedCommunities ?? [],
        }
      : null);

  // Derive route flags directly from pathname
  const isPlatformAdminRoute = pathname.startsWith("/admin");
  const communityMatch = pathname.match(/\/c\/([^/]+)\/mod/);
  const isCommunityAdminRoute = Boolean(
    pathname.startsWith("/c/") && communityMatch,
  );

  // 1. STRICT PERMISSION CHECK: Must be authenticated and have appropriate role
  const canAccessPlatformAdmin = Boolean(
    currentSession && currentSession.role === "admin",
  );

  const canAccessCommunityAdmin = Boolean(
    currentSession &&
    communityMatch?.[1] &&
    currentSession.managedCommunities?.some(
      (c) =>
        c.slug === communityMatch[1] &&
        (c.role === "moderator" || c.role === "owner"),
    ),
  );

  // 2. SAFE NAV MODE: If user is logged out or lacks role, force "consumer" mode immediately
  const navMode: NavMode =
    isPlatformAdminRoute && canAccessPlatformAdmin
      ? "platform-admin"
      : isCommunityAdminRoute && canAccessCommunityAdmin
        ? "community-admin"
        : canAccessPlatformAdmin && manualNavMode === "platform-admin"
          ? "platform-admin"
          : "consumer";

  const activeCommunity =
    isCommunityAdminRoute && communityMatch?.[1]
      ? communityMatch[1]
      : manualActiveCommunity;

  // 3. AUTO-BOUNCE: If user logs out while on a protected route, redirect to /login immediately
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (isPlatformAdminRoute || isCommunityAdminRoute) {
        router.replace("/login");
      }
    }
  }, [
    isAuthenticated,
    user,
    isPlatformAdminRoute,
    isCommunityAdminRoute,
    router,
  ]);

  const handleSwitchMode = (mode: NavMode, communitySlug?: string) => {
    // Prevent unauthenticated mode switches
    if (!currentSession) {
      router.push("/login");
      return;
    }

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
        session={currentSession}
        navMode={navMode}
        activeCommunity={activeCommunity}
        onSwitchMode={handleSwitchMode}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
      />

      {/* 3-Column Responsive Shell */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center px-0 sm:px-4 lg:px-6">
        {/* Left Column: Twitter-style Sidebar (Desktop >= 1024px) */}
        <DesktopSidebar
          session={currentSession}
          navMode={navMode}
          activeCommunity={activeCommunity}
          onSwitchMode={handleSwitchMode}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
        />

        {/* Center Column: Main Feed / Page Content */}
        <div className="min-h-screen min-w-0 max-w-2xl flex-1 border-zinc-800/60 lg:border-x">
          {children}
        </div>

        {/* Right Column: Trending & Discovery panel (Desktop >= 1280px) */}
        <RightPanel />
      </div>

      {/* Root-level Logout Modal: session clear bhayera Navbar unmount huda pani yo safe rahanchha */}
      <LogoutConfirmModal
        open={isLogoutModalOpen}
        onOpenChange={setIsLogoutModalOpen}
      />
    </div>
  );
}
