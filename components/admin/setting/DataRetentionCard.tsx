'use client';

import React, { useState } from 'react';
import { DataRetentionSettings } from '@/types/admin-setting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Database, Check, Download } from 'lucide-react';

interface DataRetentionCardProps {
  initialData: DataRetentionSettings;
  onSave: (updated: DataRetentionSettings) => void;
  onExportDump: () => void;
}

export function DataRetentionCard({ initialData, onSave, onExportDump }: DataRetentionCardProps) {
  const [data, setData] = useState<DataRetentionSettings>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(data);
      setIsSaving(false);
    }, 500);
  };

  return (
    <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
      <CardHeader className="border-b border-zinc-900 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
          <Database className="h-4 w-4 text-[#991b1b]" />
          Data Retention & Database Cleanup
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Automated database hygiene policies to prevent table bloat on Neon PostgreSQL.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Anonymous Vent Auto-Expiration (Days)</Label>
            <Input
              type="number"
              value={data.ventExpirationDays}
              onChange={(e) => setData((prev) => ({ ...prev, ventExpirationDays: parseInt(e.target.value) || 0 }))}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
            <p className="text-[11px] text-zinc-500">Set to 0 to keep posts indefinitely.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Unverified Account Cleanup (Days)</Label>
            <Input
              type="number"
              value={data.unverifiedCleanupDays}
              onChange={(e) => setData((prev) => ({ ...prev, unverifiedCleanupDays: parseInt(e.target.value) || 0 }))}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
            <p className="text-[11px] text-zinc-500">Purge unverified accounts after specified days.</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-900 pt-6">
          <div className="space-y-0.5">
            <span className="text-sm font-medium text-white">Full Database SQL Dump</span>
            <p className="text-xs text-zinc-500">Download complete schema and record backup.</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportDump}
            className="border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:text-white text-xs"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export SQL Dump
          </Button>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#991b1b] text-white hover:bg-red-800 text-xs"
          >
            <Check className="mr-1.5 h-3 w-3" />
            {isSaving ? 'Saving Policies...' : 'Save Retention Rules'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}