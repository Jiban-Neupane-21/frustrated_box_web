import { Community, CommunityStatus, CommunityFilters } from "@/app/admin/communities/types/commmunities.type";

// Initial Mock Data for Communities
let communities: Community[] = [
  {
    id: "comm_001",
    name: "Nepal Tech Hub",
    slug: "nepal-tech-hub",
    description: "A community for developers, tech enthusiasts, and IT students in Nepal.",
    membersCount: 1420,
    status: "active",
    category: "Technology",
    owner: { id: "usr_101", name: "Aarav Sharma", email: "aarav@example.com" },
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "comm_002",
    name: "Kathmandu Valley Photographers",
    slug: "kathmandu-photographers",
    description: "Sharing frames, gear reviews, and organizing photo-walks around the valley.",
    membersCount: 650,
    status: "active",
    category: "Art & Culture",
    owner: { id: "usr_102", name: "Priya Thapa", email: "priya@example.com" },
    createdAt: "2026-02-10T14:30:00Z",
  },
  {
    id: "comm_003",
    name: "Startup Founders Nepal",
    slug: "startup-founders-nepal",
    description: "Networking and mentoring for early-stage startup founders and entrepreneurs.",
    membersCount: 320,
    status: "pending",
    category: "Business",
    owner: { id: "usr_103", name: "Rohan Karki", email: "rohan@example.com" },
    createdAt: "2026-03-01T09:15:00Z",
  },
  {
    id: "comm_004",
    name: "Crypto & Web3 Traders",
    slug: "crypto-web3-traders",
    description: "Discussions on blockchain technology, smart contracts, and decentralized finance.",
    membersCount: 890,
    status: "suspended",
    category: "Finance",
    owner: { id: "usr_104", name: "Bikash Shrestha", email: "bikash@example.com" },
    createdAt: "2025-11-20T16:45:00Z",
  },
];

export function getCommunities(filters: CommunityFilters) {
  let result = [...communities];

  // Filter by Status
  if (filters.status && filters.status !== "all") {
    result = result.filter((c) => c.status === filters.status);
  }

  // Filter by Category
  if (filters.category && filters.category !== "all") {
    result = result.filter((c) => c.category.toLowerCase() === filters.category?.toLowerCase());
  }

  // Search query (name or description or owner)
  if (filters.q && filters.q.trim() !== "") {
    const query = filters.q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.owner.name.toLowerCase().includes(query)
    );
  }

  return result;
}

export function updateCommunityStatus(id: string, status: CommunityStatus) {
  const index = communities.findIndex((c) => c.id === id);
  if (index === -1) {
    return { error: "Community not found", code: 404 };
  }

  communities[index] = {
    ...communities[index],
    status,
  };

  return { community: communities[index] };
}

export function deleteCommunity(id: string) {
  const index = communities.findIndex((c) => c.id === id);
  if (index === -1) {
    return { error: "Community not found", code: 404 };
  }

  communities = communities.filter((c) => c.id !== id);
  return { success: true };
}