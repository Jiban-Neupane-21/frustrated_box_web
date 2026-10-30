"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Flame, Users, UserCheck, CheckCheck, ExternalLink } from "lucide-react";
import { notificationService } from "@/lib/notificationService";
import { NotificationItem } from "@/types/notification";
import { useAuth } from "@/components/AuthContext";

export function NavbarNotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Active logged-in user standard ID or fallback test master
  const currentUserId = user?.id || "usr_testmaster";

  const fetchNotifications = () => {
    const list = notificationService.getNotifications(currentUserId);
    setNotifications(list);
  };

  useEffect(() => {
    fetchNotifications();

    // Re-fetch on storage change, focus, or user switch
    const handleStorageChange = () => fetchNotifications();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, [currentUserId]);

  // Dropdown bahira click garda close garne logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleItemClick = (item: NotificationItem) => {
    notificationService.markAsRead(item.id);
    fetchNotifications();
    setIsOpen(false);
    router.push(item.targetUrl);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    notificationService.markAllAsRead(currentUserId);
    fetchNotifications();
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "JOINED_COMMUNITY_POST":
        return <Users className="h-4 w-4 text-amber-500 shrink-0" />;
      case "INTERACTED_USER_POST":
        return <Flame className="h-4 w-4 text-red-500 shrink-0" />;
      case "FOLLOWED_USER_POST":
        return <UserCheck className="h-4 w-4 text-blue-400 shrink-0" />;
      default:
        return <Bell className="h-4 w-4 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900 transition focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white ring-2 ring-[#050505]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Quick Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 px-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-950/80 border border-red-800/60 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <CheckCheck className="h-3.5 w-3.5 text-zinc-500" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Quick List */}
          <div className="mt-2 max-h-80 overflow-y-auto space-y-1.5 pr-1">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No notifications yet.
              </div>
            ) : (
              notifications.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-start gap-3 rounded-xl p-2.5 transition cursor-pointer ${
                    item.isRead
                      ? "bg-zinc-950 hover:bg-zinc-900/60 text-zinc-400"
                      : "bg-zinc-900/80 hover:bg-zinc-900 text-zinc-100 border border-zinc-800/80"
                  }`}
                >
                  <div className="mt-0.5">{getIconForType(item.type)}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-snug line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                      {item.message}
                    </p>
                  </div>
                  {!item.isRead && (
                    <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Navigation */}
          <div className="mt-2 border-t border-zinc-800/80 pt-2 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-red-400 transition py-1"
            >
              <span>View all notifications</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}