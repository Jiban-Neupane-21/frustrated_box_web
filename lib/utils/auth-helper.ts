import { GlobalRole } from "@/components/layout/navbar/types";

export function normalizeRole(role?: string): GlobalRole {
  if (!role) return "guest";
  const lower = role.toLowerCase();
  if (lower === "admin") return "admin";
  return "user";
}