import { NotificationItem, NotificationType, PostInteractionRecord } from "@/types/notification";

const NOTIFICATIONS_KEY = "frustratedbox_notifications";
const INTERACTIONS_KEY = "frustratedbox_post_interactions";
const FOLLOWS_KEY = "frustratedbox_user_follows";

export const notificationService = {
  // Get all notifications for specific logged in user ID
  getNotifications(userId: string): NotificationItem[] {
    if (typeof window === "undefined" || !userId) return [];
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: NotificationItem[] = data ? JSON.parse(data) : [];
    // Filter by recipientId matching current user's id
    return all.filter((item) => item.recipientId === userId);
  },

  // Mark single notification as read
  markAsRead(notificationId: string) {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: NotificationItem[] = data ? JSON.parse(data) : [];
    const updated = all.map((item) =>
      item.id === notificationId ? { ...item, isRead: true } : item
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  // Mark all notifications as read for user
  markAllAsRead(userId: string) {
    if (typeof window === "undefined" || !userId) return;
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    const all: NotificationItem[] = data ? JSON.parse(data) : [];
    const updated = all.map((item) =>
      item.recipientId === userId ? { ...item, isRead: true } : item
    );
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  },

  // Dispatch notifications when a new post is created
  dispatchNewPostNotifications(params: {
    postId: string;
    authorId: string;
    authorName: string;
    communitySlug?: string | null;
  }) {
    if (typeof window === "undefined") return;

    const recipients = new Set<string>();
    const notificationTypes = new Map<string, NotificationType>();

    // 1. Fetch users who interacted with this author's previous posts
    const interactionsData = localStorage.getItem(INTERACTIONS_KEY);
    const interactions: PostInteractionRecord[] = interactionsData ? JSON.parse(interactionsData) : [];
    
    interactions
      .filter((r) => r.authorId === params.authorId)
      .forEach((r) => {
        r.interactedUserIds.forEach((uid) => {
          if (uid !== params.authorId) {
            recipients.add(uid);
            notificationTypes.set(uid, "INTERACTED_USER_POST");
          }
        });
      });

    // 2. Fetch users following this author
    const followsData = localStorage.getItem(FOLLOWS_KEY);
    const follows: { followerId: string; followingId: string }[] = followsData ? JSON.parse(followsData) : [];
    
    follows
      .filter((f) => f.followingId === params.authorId)
      .forEach((f) => {
        recipients.add(f.followerId);
        notificationTypes.set(f.followerId, "FOLLOWED_USER_POST");
      });

    // 3. Community Members (In mock setup, check joined communities of stored users)
    if (params.communitySlug) {
      const joinedData = localStorage.getItem("frustratedbox_joined_communities");
      // Yadi community join gareka users chan bhane notification pathaune
      const joinedMap: Record<string, string[]> = joinedData ? JSON.parse(joinedData) : {};
      
      Object.entries(joinedMap).forEach(([uid, slugs]) => {
        if (slugs.includes(params.communitySlug!) && uid !== params.authorId) {
          recipients.add(uid);
          notificationTypes.set(uid, "JOINED_COMMUNITY_POST");
        }
      });
    }

    // Exclude author from receiving their own post notification
    recipients.delete(params.authorId);

    // Build notification objects
    const newNotifications: NotificationItem[] = Array.from(recipients).map((recipientId) => {
      const type = notificationTypes.get(recipientId) || "JOINED_COMMUNITY_POST";
      let title = `New post from ${params.authorName}`;
      let targetUrl = `/post/${params.postId}`;

      if (type === "JOINED_COMMUNITY_POST" && params.communitySlug) {
        title = `New vent in c/${params.communitySlug}`;
        targetUrl = `/c/${params.communitySlug}`;
      }

      return {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        recipientId,
        actor: { id: params.authorId, name: params.authorName },
        type,
        title,
        message: `${params.authorName} shared a new vent.`,
        targetUrl,
        isRead: false,
        createdAt: new Date().toISOString(),
        communitySlug: params.communitySlug || undefined,
        postId: params.postId,
      };
    });

    const existingData = localStorage.getItem(NOTIFICATIONS_KEY);
    const existingNotifications: NotificationItem[] = existingData ? JSON.parse(existingData) : [];
    localStorage.setItem(
      NOTIFICATIONS_KEY,
      JSON.stringify([...newNotifications, ...existingNotifications])
    );
  },
};