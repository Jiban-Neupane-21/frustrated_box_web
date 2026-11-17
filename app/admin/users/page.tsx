"use client";

import { useCallback, useEffect, useState } from "react";
import { ManagedUser, UserRole, UserStatus } from "@/types/user-management.type";
import { userService } from "@/lib/userService";
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
  ShieldAlert,
  UserCheck,
  Shield,
} from "lucide-react";

const STATUS_COLORS: Record<UserStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  suspended: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  banned: "bg-red-500/10 text-red-600 border-red-500/20",
};

const ROLE_BADGES: Record<UserRole, string> = {
  ADMIN: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  MODERATOR: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  USER: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
};

export default function UsersManagementPage() {
  const { user: currentUser, token, isLoading: authLoading } = useAuth();

  const currentRole = (currentUser?.role ?? "USER").toUpperCase();
  const isAuthorized = currentRole === "ADMIN" || currentRole === "MODERATOR";
  const isAdmin = currentRole === "ADMIN";

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filters state
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");

  const say = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadUsers = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await userService.getUsers(
        { role: roleFilter, status: statusFilter, q },
        token
      );
      setUsers(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load users";
      setErrorMessage(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, q, token, isAuthorized]);

  useEffect(() => {
    const t = setTimeout(loadUsers, 250);
    return () => clearTimeout(t);
  }, [loadUsers]);

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
              You need Admin or Moderator privileges to access User Management.
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRoleChange = async (targetUser: ManagedUser, newRole: UserRole) => {
    if (targetUser.email === currentUser?.email || targetUser.id === currentUser?.id) {
      say("You cannot change your own role!");
      return;
    }

    try {
      await userService.updateUserRole(targetUser.id, newRole, currentRole, token);
      say(`Updated ${targetUser.name}'s role to ${newRole}`);
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating role";
      say(msg);
    }
  };

  const handleStatusChange = async (targetUser: ManagedUser, newStatus: UserStatus) => {
    if (targetUser.email === currentUser?.email || targetUser.id === currentUser?.id) {
      say("You cannot suspend or ban yourself!");
      return;
    }

    try {
      await userService.updateUserStatus(targetUser.id, newStatus, currentRole, token);
      say(`User marked as ${newStatus}`);
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating status";
      say(msg);
    }
  };

  const handleDelete = async (targetUser: ManagedUser) => {
    if (targetUser.email === currentUser?.email || targetUser.id === currentUser?.id) {
      say("You cannot delete your own account!");
      return;
    }

    if (!window.confirm(`Are you sure you want to permanently delete "${targetUser.name}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(targetUser.id, currentRole, token);
      say("User deleted successfully");
      await loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting user";
      say(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 box-border">
      {/* Header */}
      <header className="flex justify-between items-baseline mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total {users.length} users found · Signed in as{" "}
            <span className="font-semibold text-foreground">
              {currentUser?.name || "Admin"} (@{currentUser?.username || "admin"})
            </span>
          </p>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Input
          placeholder="Search by name, @username or email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as UserRole | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MODERATOR">Moderator</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as UserStatus | "all")}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm flex items-center justify-between">
          <span>{errorMessage}</span>
          <Button variant="outline" size="sm" onClick={() => loadUsers()}>
            Retry
          </Button>
        </div>
      )}

      {/* Users Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            Loading users…
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No users found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {users.map((u) => {
                  const isSelf =
                    u.email === currentUser?.email || u.id === currentUser?.id;

                  return (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      {/* User Info */}
                      <td className="p-4">
                        <div className="font-medium flex items-center gap-2">
                          {u.name}
                          {isSelf && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          @{u.username} · {u.email}
                        </div>
                      </td>

                      {/* Role Selector (Only Admins can change roles) */}
                      <td className="p-4">
                        {isAdmin && !isSelf ? (
                          <Select
                            value={u.role}
                            onValueChange={(val) =>
                              handleRoleChange(u, val as UserRole)
                            }
                          >
                            <SelectTrigger className="w-[135px] h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="MODERATOR">MODERATOR</SelectItem>
                              <SelectItem value="USER">USER</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-medium inline-flex items-center gap-1 ${
                              ROLE_BADGES[u.role]
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {u.role}
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full border font-medium capitalize ${
                            STATUS_COLORS[u.status]
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(u.joinedAt).toLocaleDateString()}
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.status !== "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf}
                              className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleStatusChange(u, "active")}
                              title="Activate User"
                            >
                              <UserCheck className="w-3.5 h-3.5 mr-1" />
                              Activate
                            </Button>
                          )}

                          {u.status === "active" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf}
                              className="h-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => handleStatusChange(u, "suspended")}
                              title="Suspend User"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                              Suspend
                            </Button>
                          )}

                          {u.status !== "banned" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isSelf}
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleStatusChange(u, "banned")}
                              title="Ban User"
                            >
                              <Ban className="w-3.5 h-3.5 mr-1" />
                              Ban
                            </Button>
                          )}

                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={isSelf}
                              className="h-8 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(u)}
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
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