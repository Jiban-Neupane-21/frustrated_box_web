"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User, ManagedCommunity } from "@/types/auth";
import { useAuth } from "@/components/AuthContext";
import {
  getUserByUsername,
  getPublicVents,
  getPrivateVents,
  getSavedVents,
  getUserActivity,
  getUserStats,
} from "@/app/features/profile/api";
import {
  getVisibleTabs,
  type ActivityItem,
  type CommunityFilter,
  type Confession,
  type ProfileStats,
  type ProfileTab,
} from "@/app/features/profile/types";
import ProfileBanner from "@/app/features/profile/components/ProfileBanner";
import ProfileHeader from "@/app/features/profile/components/ProfileHeader";
import ProfileMeta from "@/app/features/profile/components/ProfileMeta";
import ProfileStatsBar from "@/app/features/profile/components/ProfileStatsBar";
import ProfileTabs from "@/app/features/profile/components/ProfileTabs";
import ProfileCommunityCard from "@/app/features/profile/components/ProfileCommunityCard";

// ============================================================
// PLACEHOLDER 1: Auth hook
// Adjust this function to match your auth hook name and signature.
// If your hook returns { user }, return user ?? null.
// ============================================================
// import { useAuth } from "@/context/AuthContext";
function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user ?? null;
  // return null; // TODO: Uncomment the lines above and remove this line
}

// ============================================================
// PLACEHOLDER 2: Confession card
// If a shared ConfessionCard component exists, render it here.
// ============================================================
function renderVent(vent: Confession, showAnonymousBadge = false) {
  return (
    <article
      key={vent.id}
      className="rounded-xl border border-zinc-800/80 bg-[#0d0d0f] p-4"
    >
      {showAnonymousBadge && (
        <p className="mb-2 text-[11px] font-medium text-zinc-500">
          🔒 Anonymous (Visible only to you)
        </p>
      )}
      <p className="whitespace-pre-wrap text-sm text-zinc-200">{vent.content}</p>
    </article>
  );
}

// ============================================================
// Small helpers
// ============================================================
function EmptyState({ text }: { text: string }) {
  return <p className="py-12 text-center text-sm text-zinc-500">{text}</p>;
}

const COMMUNITY_FILTERS: CommunityFilter[] = ["all", "owner", "moderator", "member"];

export default function ProfileView({ username }: { username: string }) {
 const { user: currentUser, isLoading: isAuthLoading } = useAuth();

 
 const viewerId = currentUser?.id;

 
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [publicVents, setPublicVents] = useState<Confession[]>([]);
  const [privateVents, setPrivateVents] = useState<Confession[]>([]);
  const [savedVents, setSavedVents] = useState<Confession[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const [activeTab, setActiveTab] = useState<ProfileTab>("public");
  const [communityFilter, setCommunityFilter] = useState<CommunityFilter>("all");
  const [followOverride, setFollowOverride] = useState<boolean | null>(null);

  const isOwnProfile = !!user && !!viewerId && viewerId === user.id;

  // ---------- Data load ----------
  useEffect(() => {
      if (isAuthLoading) return;  // Wait for auth

    let cancelled = false;

    async function load() {
      setStatus("loading");
      setFollowOverride(null);
      try {
        const found = await getUserByUsername(username);
        if (cancelled) return;
        if (!found) {
          setUser(null);
          setStatus("notfound");
          return;
        }

        const own = !!viewerId && viewerId === found.id;

        // Fetch private/saved/activity only when viewing own profile
        const [s, pub, priv, saved, act] = await Promise.all([
          getUserStats(found.id, viewerId),
          getPublicVents(found.id),
          own ? getPrivateVents(found.id, viewerId) : Promise.resolve([]),
          own ? getSavedVents(found.id, viewerId) : Promise.resolve([]),
          own ? getUserActivity(found.id, viewerId) : Promise.resolve([]),
        ]);
        if (cancelled) return;

        setUser(found);
        setStats(s);
        setPublicVents(pub);
        setPrivateVents(priv);
        setSavedVents(saved);
        setActivity(act);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username, viewerId]);

  // ---------- Loading / error / 404 ----------
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#050505]">
        <div className="h-36 animate-pulse bg-zinc-900 sm:h-48" />
        <div className="mx-auto max-w-3xl px-4 pt-4">
          <div className="-mt-16 h-24 w-24 animate-pulse rounded-full bg-zinc-800" />
        </div>
      </main>
    );
  }

  if (status === "notfound" || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#050505] px-4 text-center">
        <h1 className="text-xl font-bold text-zinc-100">Venter Not Found</h1>
        <p className="text-sm text-zinc-500">
          User @{username.replace(/^(%40|@)/, "")} does not exist.
        </p>
        <Link href="/" className="text-sm text-red-400 hover:text-red-300">
          Back to Home
        </Link>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-center">
        <p className="text-sm text-zinc-400">Failed to load profile. Please try again.</p>
      </main>
    );
  }

  // ---------- Derived ----------
  const tabs = getVisibleTabs(isOwnProfile);
  // Avoid private tab leakage: fall back to first tab if active tab is invalid
  const current: ProfileTab = tabs.includes(activeTab) ? activeTab : tabs[0];

  const isFollowing =
    followOverride ?? (currentUser?.following?.includes(user.id) ?? false);

  const communities: ManagedCommunity[] = (user.managedCommunities ?? []).filter(
    (c) => communityFilter === "all" || c.role === communityFilter
  );

  // ---------- Tab content ----------
  function renderPanel() {
    switch (current) {
      case "public":
        return publicVents.length ? (
          <div className="space-y-3">{publicVents.map((v) => renderVent(v))}</div>
        ) : (
          <EmptyState text="No public vents yet." />
        );

      case "private":
        return privateVents.length ? (
          <div className="space-y-3">{privateVents.map((v) => renderVent(v, true))}</div>
        ) : (
          <EmptyState text="No anonymous vents yet." />
        );

      case "saved":
        return savedVents.length ? (
          <div className="space-y-3">{savedVents.map((v) => renderVent(v))}</div>
        ) : (
          <EmptyState text="No saved vents yet." />
        );

      case "communities":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {COMMUNITY_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setCommunityFilter(f)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
                    communityFilter === f
                      ? "border-red-500/40 bg-red-950/40 text-red-300"
                      : "border-zinc-800/80 bg-[#0d0d0f] text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {communities.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {communities.map((c) => (
                  <ProfileCommunityCard
                    key={c.id}
                    community={c}
                    isOwnProfile={isOwnProfile}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="No communities joined yet." />
            )}
          </div>
        );

      case "activity":
        return activity.length ? (
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li
                key={`${item.type}-${item.confession.id}-${i}`}
                className="rounded-xl border border-zinc-800/80 bg-[#0d0d0f] p-4"
              >
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                  {item.type === "echo"
                    ? "Echoed"
                    : item.type === "relate"
                    ? "Related to"
                    : "Burned"}
                </p>
                {item.type === "echo" && (
                  <p className="mb-2 text-sm text-zinc-200">{item.comment.content}</p>
                )}
                <p className="line-clamp-2 text-xs text-zinc-500">
                  {item.confession.content}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text="No recent activity." />
        );
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] pb-16">
      <div className="mx-auto max-w-3xl">
        <ProfileBanner coverUrl={user.profile?.coverUrl} />
        <ProfileHeader
          user={user}
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onToggleFollow={() => setFollowOverride(!isFollowing)}
        />
        <ProfileMeta user={user} isOwnProfile={isOwnProfile} />
        <ProfileStatsBar stats={stats} />
        <ProfileTabs activeTab={current} onChange={setActiveTab} isOwnProfile={isOwnProfile} />

        <div
          role="tabpanel"
          id={`profile-panel-${current}`}
          aria-labelledby={`profile-tab-${current}`}
          className="px-4 pt-4 sm:px-6"
        >
          {renderPanel()}
        </div>
      </div>
    </main>
  );
}
