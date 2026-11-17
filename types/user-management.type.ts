export type UserRole = "ADMIN" | "MODERATOR" | "USER";
export type UserStatus = "active" | "suspended" | "banned";

export interface ManagedUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: string;
}

export interface UserFilters {
  role?: UserRole | "all";
  status?: UserStatus | "all";
  q?: string;
}