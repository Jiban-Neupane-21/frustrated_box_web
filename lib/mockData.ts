// lib/mockData.ts
import { User } from "@/types/auth";

export interface MockUserRecord extends User {
  password: string;
  token: string;
}

export const INITIAL_MOCK_USERS: MockUserRecord[] = [
  {
    id: "usr_admin",
    name: "Frustrated Admin",
    username: "admin",
    email: "admin@frustratedbox.com",
    role: "ADMIN",
    password: "Password@123",
    token: "mock-jwt-admin-token",
    profile: {
      bio: "Platform maintainer and head of chaos control.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
      location: {
        city: "Kathmandu",
        hometown: "Pokhara",
      },
      work: {
        occupation: "Lead Moderator",
        company: "FrustratedBox",
      },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_mod",
    name: "Chill Moderator",
    username: "moderator",
    email: "mod@frustratedbox.com",
    role: "MODERATOR",
    password: "Password@123",
    token: "mock-jwt-mod-token",
    managedCommunities: [
      {
        id: "c1",
        name: "Tech Life",
        slug: "tech-life",
        role: "moderator",
        pendingReportsCount: 4,
      },
      {
        id: "c2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "owner",
        pendingReportsCount: 0,
      },
    ],
    profile: {
      bio: "Keeping the discussions civil.",
      location: {
        city: "Lalitpur",
      },
      joinedDate: "October 2026",
    },
  },
  {
    id: "usr_user",
    name: "Regular Vent User",
    username: "user_vent",
    email: "user@frustratedbox.com",
    role: "USER",
    password: "Password@123",
    token: "mock-jwt-user-token",
    managedCommunities: [
      {
        id: "c2",
        name: "Corporate Cage",
        slug: "corporate-cage",
        role: "member",
        pendingReportsCount: 0,
      },
    ],
    profile: {
      bio: "Here to let off some steam.",
      relationshipStatus: "Single",
      joinedDate: "October 2026",
    },
  },
];
