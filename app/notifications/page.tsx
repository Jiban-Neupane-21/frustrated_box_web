"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Flame, 
  Users, 
  UserCheck, 
  CheckCheck, 
  Trash2, 
  ArrowLeft,
  Sparkles,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { notificationService } from "@/lib/notificationService";
import { NotificationItem } from "@/types/notification";

type FilterTab = "all" | "communities" | "interactions" | "follows";

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const loadNotifications = () => {
    const list = notificationService.getNotifications("current_user");
    setNotifications(list);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead("current_user");
    loadNotifications();
  };

  const handleNotificationClick = (item: NotificationItem) => {
    notificationService.markAsRead(item.id);
    loadNotifications();
    router.push(item.targetUrl);
  };

  // Filter logic based on tabs
  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "communities") return item.type === "JOINED_COMMUNITY_POST";
    if (activeTab === "interactions") return item.type === "INTERACTED_USER_POST";
    if (activeTab === "follows") return item.type === "FOLLOWED_USER_POST";
    return true; // "all"
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "JOINED_COMMUNITY_POST":
        return <Users className="h-5 w-5 text-amber-500 shrink-0" />;
      case "INTERACTED_USER_POST":
        return <Flame className="h-5 w-5 text-red-500 shrink-0" />;
      case "FOLLOWED_USER_POST":
        return <UserCheck className="h-5 w-5 text-blue-400 shrink-0" />;
      default:
        return <Bell className="h-5 w-5 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-red-950 selection:text-red-200 pb-16">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                aria-label="Back to home"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div>
                <h1 className="flex items-center gap-2 text-xl font-bold text-white">
                  <span>Notifications Hub</span>
                  <Sparkles className="h-4 w-4 text-red-500" />
                </h1>
                <p className="text-xs text-zinc-400">
                  Stay updated on your joined communities, interactions, and follows.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition cursor-pointer"
              >
                <CheckCheck className="h-4 w-4 text-emerald-500" />
                <span className="hidden sm:inline">Mark all as read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-2">
            {(
              [
                { id: "all", label: "All Alerts", count: notifications.length },
                { id: "communities", label: "Communities", count: notifications.filter(n => n.type === "JOINED_COMMUNITY_POST").length },
                { id: "interactions", label: "Interactions", count: notifications.filter(n => n.type === "INTERACTED_USER_POST").length },
                { id: "follows", label: "Follows", count: notifications.filter(n => n.type === "FOLLOWED_USER_POST").length },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-950/40"
                    : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List Stream */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-zinc-300">No notifications found</p>
              <p className="text-xs text-zinc-500 mt-1">
                You&apos;re all caught up! Check back later for new updates.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative flex items-start gap-4 rounded-2xl border p-4.5 transition cursor-pointer ${
                  item.isRead
                    ? "border-zinc-800/70 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/30 text-zinc-400"
                    : "border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-100 shadow-sm"
                }`}
              >
                {/* Icon wrapper */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
                  {getIconForType(item.type)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-red-500">
                    <span>View destination</span>
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>

                {/* Unread indicator dot */}
                {!item.isRead && (
                  <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-red-600 shadow-sm ring-2 ring-zinc-950" />
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}