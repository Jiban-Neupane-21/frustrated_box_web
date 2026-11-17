"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Community,
  CommunityFilters,
  CommunityStatus,
} from "@/app/admin/communities/types/commmunities.type";
import { admincommunityService } from "@/lib/communities-service";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Trash2,
  CheckCircle,
  Ban,
  Users,
  Building2,
} from "lucide-react";

const STATUS_COLORS: Record<CommunityStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  suspended: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function CommunitiesManagementPage() {
  const { user, token, isLoading: authLoading } = useAuth();

  const userRole = (user?.role ?? "USER").toUpperCase();
  const isAuthorized = userRole === "ADMIN" || userRole === "MODERATOR";

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters state
  const [status, setStatus] = useState<CommunityStatus | "all">("all");
  const [category, setCategory] = useState<string>("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadCommunities = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await admincommunityService.getCommunities(
        { status, category, q },
        token,
      );
      setCommunities(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load communities";
      setErrorMessage(msg);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  }, [status, category, q, token, isAuthorized]);

  useEffect(() => {
    const t = setTimeout(loadCommunities, 250);
    return () => clearTimeout(t);
  }, [loadCommunities]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verifying permissions…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6 text-sm">
              You need Admin or Moderator privileges to manage communities.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStatusChange = async (id: string, newStatus: CommunityStatus) => {
    try {
      await admincommunityService.updateStatus(id, newStatus, userRole, token);
      say(`Community marked as ${newStatus}`);
      await loadCommunities();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status";
      say(msg);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await admincommunityService.deleteCommunity(id, userRole, token);
      say("Community deleted successfully");
      await loadCommunities();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Error deleting community";
      say(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 box-border">
      {/* Header */}
      <header className="flex justify-between items-baseline mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Communities Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total {communities.length} communities found · Signed in as{" "}
            <span className="font-semibold text-foreground">
              {user?.name || "Admin"} (@{user?.username || "admin"})
            </span>
          </p>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search by name, description or owner..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as CommunityStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        <Select value={category} onValueChange={(v) => setCategory(v || "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Technology">Technology</SelectItem>
            <SelectItem value="Art & Culture">Art & Culture</SelectItem>
            <SelectItem value="Business">Business</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => loadCommunities()}>
            Retry
          </Button>
        </div>
      )}

      {/* Communities Table / List */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading communities…
          </div>
        ) : communities.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No communities found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <th className="p-4 font-semibold">Community</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Owner</th>
                  <th className="p-4 font-semibold">Members</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {communities.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-medium flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        {c.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {c.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {c.category}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-xs">{c.owner.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {c.owner.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {c.membersCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${
                          STATUS_COLORS[c.status]
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {c.status !== "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleStatusChange(c.id, "active")}
                            title="Approve / Activate"
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                        )}
                        {c.status !== "suspended" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() =>
                              handleStatusChange(c.id, "suspended")
                            }
                            title="Suspend"
                          >
                            <Ban className="w-3.5 h-3.5 mr-1" />
                            Suspend
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(c.id, c.name)}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-4 right-4 z-50 bg-foreground text-background px-4 py-2.5 rounded-md shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
