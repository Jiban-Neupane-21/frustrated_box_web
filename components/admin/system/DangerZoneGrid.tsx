'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Lock, ShieldAlert, Trash2 } from 'lucide-react';

interface DangerZoneCardProps {
  maintenanceMode: boolean;
  readOnlyMode: boolean;
  onToggleMaintenance: (nextValue: boolean) => void;
  onToggleReadOnly: (nextValue: boolean) => void;
  onPurgeCache: () => void;
}

type PendingAction = 'maintenance' | 'readonly' | 'purge' | null;

export function DangerZoneCard({
  maintenanceMode,
  readOnlyMode,
  onToggleMaintenance,
  onToggleReadOnly,
  onPurgeCache,
}: DangerZoneCardProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [confirmText, setConfirmText] = useState('');

  const openModal = (action: PendingAction) => {
    setConfirmText('');
    setPendingAction(action);
  };

  const handleConfirm = () => {
    if (confirmText !== 'CONFIRM') return;

    if (pendingAction === 'maintenance') {
      onToggleMaintenance(!maintenanceMode);
    } else if (pendingAction === 'readonly') {
      onToggleReadOnly(!readOnlyMode);
    } else if (pendingAction === 'purge') {
      onPurgeCache();
    }

    setPendingAction(null);
    setConfirmText('');
  };

  const getDialogDetails = () => {
    switch (pendingAction) {
      case 'maintenance':
        return {
          title: maintenanceMode
            ? 'Disable Maintenance Mode?'
            : 'Enable System Maintenance Mode?',
          description: maintenanceMode
            ? 'Public traffic will immediately resume access to FrustratedBox.'
            : 'All non-admin visitors will be blocked and shown the scheduled maintenance screen.',
        };
      case 'readonly':
        return {
          title: readOnlyMode
            ? 'Disable Read-Only Mode?'
            : 'Enable Emergency Read-Only Mode?',
          description: readOnlyMode
            ? 'Users will be able to publish new vents, replies, and reactions again.'
            : 'All write operations (new posts, comments, signups) will be temporarily frozen.',
        };
      case 'purge':
        return {
          title: 'Purge Global Cloudflare Edge Cache?',
          description:
            'This will invalidate all cached feeds and assets across Cloudflare edge nodes, causing a temporary spike in Neon DB queries.',
        };
      default:
        return { title: '', description: '' };
    }
  };

  const dialog = getDialogDetails();

  return (
    <>
      <Card className="border-[#991b1b]/50 bg-[#0a0a0a] text-zinc-100 shadow-none">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-red-400">
            <ShieldAlert className="h-5 w-5 text-[#991b1b]" />
            Emergency Controls & Danger Zone
          </CardTitle>
          <p className="text-xs text-zinc-400">
            High-impact infrastructure switches. Every action here is recorded
            in the permanent audit log.
          </p>
        </CardHeader>

        <CardContent className="divide-y divide-zinc-900 pt-2">
          {/* Maintenance Mode */}
          <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-white">
                  Maintenance Mode
                </span>
                {maintenanceMode && (
                  <span className="rounded bg-[#991b1b] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Lock public access during database migrations or critical
                incidents. Admin routes remain accessible.
              </p>
            </div>

            <Button
              variant={maintenanceMode ? 'outline' : 'destructive'}
              size="sm"
              onClick={() => openModal('maintenance')}
              className={
                maintenanceMode
                  ? 'border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-[#991b1b] text-white hover:bg-red-800'
              }
            >
              {maintenanceMode ? 'Turn Off Maintenance' : 'Enable Maintenance'}
            </Button>
          </div>

          {/* Read-Only Mode */}
          <div className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium text-white">
                  Read-Only Freeze
                </span>
                {readOnlyMode && (
                  <span className="rounded bg-amber-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Frozen
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Allow browsing existing posts while blocking all new vents,
                comments, and registrations.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal('readonly')}
              className="border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-[#991b1b] hover:bg-[#991b1b]/10 hover:text-white"
            >
              {readOnlyMode ? 'Resume Writes' : 'Freeze Writes'}
            </Button>
          </div>

          {/* Purge Cache */}
          <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-zinc-400" />
                <span className="text-sm font-medium text-white">
                  Purge Edge Cache
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Force-clear Cloudflare CDN cache for feed endpoints and static
                metadata.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal('purge')}
              className="border-zinc-800 bg-zinc-950 text-zinc-200 hover:border-[#991b1b] hover:bg-[#991b1b]/10 hover:text-white"
            >
              Purge All Cache
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent className="border-zinc-800 bg-[#0a0a0a] text-zinc-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              {dialog.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              {dialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-2 space-y-2">
            <label className="text-xs text-zinc-400">
              Type <span className="font-mono font-bold text-red-400">CONFIRM</span>{' '}
              to proceed:
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="border-zinc-800 bg-[#050505] font-mono text-white focus-visible:ring-[#991b1b]"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={confirmText !== 'CONFIRM'}
              onClick={handleConfirm}
              className="bg-[#991b1b] text-white hover:bg-red-800 disabled:opacity-40"
            >
              Execute Action
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}