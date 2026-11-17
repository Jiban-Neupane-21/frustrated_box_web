import { ManagedUser, UserRole, UserStatus, UserFilters } from "@/types/user-management.type";

// Initial Mock Users Data
let users: ManagedUser[] = [
  {
    id: "usr_01",
    name: "Jiban Neupane",
    username: "jiban",
    email: "jiban@example.com",
    role: "ADMIN",
    status: "active",
    joinedAt: "2025-08-10T10:00:00Z",
  },
  {
    id: "usr_02",
    name: "Sita Sharma",
    username: "sita_mod",
    email: "sita@example.com",
    role: "MODERATOR",
    status: "active",
    joinedAt: "2025-09-12T14:30:00Z",
  },
  {
    id: "usr_03",
    name: "Ram Thapa",
    username: "ramthapa",
    email: "ram@example.com",
    role: "USER",
    status: "active",
    joinedAt: "2026-01-05T09:15:00Z",
  },
  {
    id: "usr_04",
    name: "Hari Karki",
    username: "harik",
    email: "hari@example.com",
    role: "USER",
    status: "suspended",
    joinedAt: "2026-02-18T16:45:00Z",
  },
  {
    id: "usr_05",
    name: "Spammer Bot",
    username: "spammer99",
    email: "spam@badmail.com",
    role: "USER",
    status: "banned",
    joinedAt: "2026-03-01T11:20:00Z",
  },
];

export function getUsers(filters: UserFilters) {
  let result = [...users];

  // Filter by Role
  if (filters.role && filters.role !== "all") {
    result = result.filter((u) => u.role === filters.role);
  }

  // Filter by Status
  if (filters.status && filters.status !== "all") {
    result = result.filter((u) => u.status === filters.status);
  }

  // Search query (name, username, or email)
  if (filters.q && filters.q.trim() !== "") {
    const query = filters.q.toLowerCase();
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    );
  }

  return result;
}

export function updateUserRole(id: string, role: UserRole) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return { error: "User not found", code: 404 };
  }

  users[index] = {
    ...users[index],
    role,
  };

  return { user: users[index] };
}

export function updateUserStatus(id: string, status: UserStatus) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return { error: "User not found", code: 404 };
  }

  users[index] = {
    ...users[index],
    status,
  };

  return { user: users[index] };
}

export function deleteUser(id: string) {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return { error: "User not found", code: 404 };
  }

  users = users.filter((u) => u.id !== id);
  return { success: true };
}