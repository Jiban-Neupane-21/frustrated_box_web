// src/types/auth.ts

// 1. Roles (Admin and SuperAdmin merged as ADMIN)
export type UserRole = "ADMIN" | "MODERATOR" | "USER";

export interface ManagedCommunity {
  id: string;
  name: string;
  slug: string;
  role: "member" | "moderator" | "owner";
  pendingReportsCount?: number;
}

// 2. Facebook-style details (All Optional)
export interface UserProfileDetails {
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  work?: {
    occupation?: string;
    company?: string;
  };
  education?: {
    schoolOrCollege?: string;
    degree?: string;
  };
  location?: {
    city?: string;
    hometown?: string;
  };
  relationshipStatus?:
    | "Single"
    | "In a relationship"
    | "Complicated"
    | "Prefer not to say";
  website?: string;
  joinedDate?: string;
}

// 3. Main User Model
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  profile?: UserProfileDetails; // optional profile details
  managedCommunities?: ManagedCommunity[];
  following?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
