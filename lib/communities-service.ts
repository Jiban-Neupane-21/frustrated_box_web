// lib/communities-service.ts
import { Community, CommunityFilters, CommunityStatus } from "@/app/admin/communities/types/commmunities.type";
import { getCommunities, updateCommunityStatus, deleteCommunity } from "@/lib/communities-store";

const USE_REAL_API = Boolean(process.env.NEXT_PUBLIC_API_URL);
const REAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/admin/communities";

export const admincommunityService = {
  /**
   * कम्युनिटीहरूको सूची ल्याउने
   */
  async getCommunities(filters: CommunityFilters = {}, token?: string | null): Promise<Community[]> {
    if (USE_REAL_API) {
      const params = new URLSearchParams({
        status: filters.status ?? "all",
        category: filters.category ?? "all",
        q: filters.q ?? "",
      });
      const res = await fetch(`${REAL_API_BASE}?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to load communities" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return Array.isArray(data.communities) ? data.communities : [];
    }

    // Mock Mode: सिधै store बाट ल्याउने (कुनै नेटवर्क एरर आउँदैन)
    await new Promise((r) => setTimeout(r, 80));
    return getCommunities(filters);
  },

  /**
   * कम्युनिटीको स्टेटस अपडेट गर्ने
   */
  async updateStatus(
    id: string,
    status: CommunityStatus,
    adminRole: string,
    token?: string | null
  ): Promise<Community> {
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: "status", status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update community status");
      return data;
    }

    // Mock Mode
    await new Promise((r) => setTimeout(r, 80));
    const result = updateCommunityStatus(id, status);
    if ("error" in result) throw new Error(result.error);
    return result.community;
  },

  /**
   * कम्युनिटी डिलिट गर्ने
   */
  async deleteCommunity(
    id: string,
    adminRole: string,
    token?: string | null
  ): Promise<boolean> {
    if (USE_REAL_API) {
      const res = await fetch(`${REAL_API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "X-Admin-Role": adminRole,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete community");
      return true;
    }

    // Mock Mode
    await new Promise((r) => setTimeout(r, 80));
    const result = deleteCommunity(id);
    if ("error" in result) throw new Error(result.error);
    return true;
  },
};