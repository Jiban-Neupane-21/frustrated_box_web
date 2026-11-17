export type CommunityStatus = "active" | "pending" | "suspended";

export interface CommunityOwner {
  id: string;
  name: string;
  email: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  membersCount: number;
  status: CommunityStatus;
  category: string;
  owner: CommunityOwner;
  createdAt: string;
}

export interface CommunityFilters {
  status?: CommunityStatus | "all";
  category?: string | "all";
  q?: string;
}