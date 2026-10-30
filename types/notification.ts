export type NotificationType =
  | "FOLLOWED_USER_POST"    // User you follow created a post
  | "INTERACTED_USER_POST"  // Author of a post you reacted/commented on created a new post
  | "JOINED_COMMUNITY_POST" // New post in a community you joined
  | "POST_REACTION"         // Someone reacted to your post
  | "POST_COMMENT";         // Someone commented on your post

export interface NotificationItem {
  id: string;
  recipientId: string;        // Who receives this notification
  actor: {
    id: string;
    name: string;
    avatar?: string;
  };
  type: NotificationType;
  title: string;
  message: string;
  targetUrl: string;          // Direct link (e.g., /c/tech-life or /post/123)
  isRead: boolean;
  createdAt: string;
  communitySlug?: string;
  postId?: string;
}

// Track post interactions (reacts & comments)
export interface PostInteractionRecord {
  postId: string;
  authorId: string;
  interactedUserIds: string[]; // Users who reacted or commented on this author's post
}