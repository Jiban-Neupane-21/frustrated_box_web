import { NotificationItem } from "@/types/notification";

export function seedMockNotifications() {
  if (typeof window === "undefined") return;

  const mockItems: NotificationItem[] = [
    {
      id: "notif_test_1",
      recipientId: "current_user",
      actor: { id: "user_tech", name: "TechLead Nepal" },
      type: "JOINED_COMMUNITY_POST",
      title: "New vent in c/tech-life",
      message: "TechLead Nepal shared a new vent about Next.js app router architecture.",
      targetUrl: "/c/tech-life",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
      communitySlug: "tech-life",
      postId: "vent_101",
    },
    {
      id: "notif_test_2",
      recipientId: "current_user",
      actor: { id: "user_design", name: "Midnight Designer" },
      type: "INTERACTED_USER_POST",
      title: "New post after your interaction",
      message: "Midnight Designer posted a new vent after your recent burn comment.",
      targetUrl: "/post/vent_102",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      postId: "vent_102",
    },
    {
      id: "notif_test_3",
      recipientId: "current_user",
      actor: { id: "user_friend", name: "AnxiousCoder" },
      type: "FOLLOWED_USER_POST",
      title: "New post from AnxiousCoder",
      message: "AnxiousCoder whom you follow just posted a new vent.",
      targetUrl: "/post/vent_103",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      postId: "vent_103",
    },
  ];

  localStorage.setItem("frustratedbox_notifications", JSON.stringify(mockItems));
  console.log("Mock notifications seeded successfully! 🔥");
}