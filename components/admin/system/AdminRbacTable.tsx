'use client';

import React, { useState } from 'react';
import { AdminMember, AdminRole } from '@/types/admin-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, MoreHorizontal, UserPlus, ShieldCheck, UserCheck } from 'lucide-react';

interface AdminRbacTableProps {
  members: AdminMember[];
  onRoleChange: (memberId: string, newRole: AdminRole) => void;
  onRevokeAccess: (memberId: string) => void;
  onInviteClick: () => void;
}

const roleBadgeMap: Record<AdminRole, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    className: 'border-[#991b1b]/50 bg-[#991b1b]/20 text-red-400',
  },
  MODERATOR: {
    label: 'Moderator',
    className: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
  },
  SUPPORT: {
    label: 'Support',
    className: 'border-zinc-700 bg-zinc-900 text-zinc-300',
  },
};

export function AdminRbacTable({
  members,
  onRoleChange,
  onRevokeAccess,
  onInviteClick,
}: AdminRbacTableProps) {
  return (
    <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            <Shield className="h-4 w-4 text-[#991b1b]" />
            Administrative Access Control (RBAC)
          </CardTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Manage who has access to admin routes and high-privilege system controls.
          </p>
        </div>

        <Button
          size="sm"
          onClick={onInviteClick}
          className="bg-[#991b1b] text-white hover:bg-red-800 text-xs"
        >
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Invite Admin
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="border-zinc-900 bg-zinc-950/50">
            <TableRow className="border-zinc-900 hover:bg-transparent">
              <TableHead className="text-zinc-400 text-xs">Admin Member</TableHead>
              <TableHead className="text-zinc-400 text-xs">Role</TableHead>
              <TableHead className="text-zinc-400 text-xs">Status</TableHead>
              <TableHead className="text-zinc-400 text-xs">Last Active</TableHead>
              <TableHead className="text-right text-zinc-400 text-xs">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const roleMeta = roleBadgeMap[member.role];
              return (
                <TableRow key={member.id} className="border-zinc-900 hover:bg-zinc-900/40">
                  <TableCell className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{member.name}</div>
                        <div className="text-xs text-zinc-500 font-mono">{member.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleMeta.className}>
                      {roleMeta.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {member.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">{member.lastActive}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent
                        align="end"
                        className="border-zinc-800 bg-[#0a0a0a] text-zinc-200"
                      >
                        <DropdownMenuItem
                          onClick={() => onRoleChange(member.id, 'SUPER_ADMIN')}
                          className="text-xs focus:bg-zinc-900 focus:text-white cursor-pointer"
                        >
                          Make Super Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRoleChange(member.id, 'MODERATOR')}
                          className="text-xs focus:bg-zinc-900 focus:text-white cursor-pointer"
                        >
                          Set as Moderator
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRoleChange(member.id, 'SUPPORT')}
                          className="text-xs focus:bg-zinc-900 focus:text-white cursor-pointer"
                        >
                          Set as Support
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onRevokeAccess(member.id)}
                          className="text-xs text-red-400 focus:bg-[#991b1b]/20 focus:text-red-300 cursor-pointer"
                        >
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}