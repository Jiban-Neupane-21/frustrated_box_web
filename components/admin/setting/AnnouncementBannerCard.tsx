'use client';

import React, { useState } from 'react';
import { AnnouncementSettings, AnnouncementSeverity } from '@/types/admin-setting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Check } from 'lucide-react';

interface AnnouncementBannerCardProps {
  initialData: AnnouncementSettings;
  onSave: (updated: AnnouncementSettings) => void;
}

export function AnnouncementBannerCard({ initialData, onSave }: AnnouncementBannerCardProps) {
  const [data, setData] = useState<AnnouncementSettings>(initialData);
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
          <Megaphone className="h-4 w-4 text-[#991b1b]" />
          Global Announcement Banner
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Broadcast notices across the top of all user feeds for updates or maintenance.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Live Preview */}
        {data.enabled && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Badge variant="outline" className="border-[#991b1b]/50 bg-[#991b1b]/20 text-red-400 text-[10px]">
                {data.severity.toUpperCase()}
              </Badge>
              <span>{data.text || 'Preview text will appear here...'}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Live Preview</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm font-medium text-white">Enable Banner</Label>
            <p className="text-xs text-zinc-500">Show or hide the announcement banner globally.</p>
          </div>
          <Switch
            checked={data.enabled}
            onCheckedChange={(val) => setData((prev) => ({ ...prev, enabled: val }))}
            className="data-[state=checked]:bg-[#991b1b]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Banner Message</Label>
          <Input
            value={data.text}
            onChange={(e) => setData((prev) => ({ ...prev, text: e.target.value }))}
            className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">Severity Level</Label>
          <div className="flex items-center gap-3">
            {(['info', 'warning', 'alert'] as AnnouncementSeverity[]).map((sev) => (
              <Button
                key={sev}
                variant={data.severity === sev ? 'default' : 'outline'}
                size="sm"
                onClick={() => setData((prev) => ({ ...prev, severity: sev }))}
                className={
                  data.severity === sev
                    ? 'bg-[#991b1b] text-white hover:bg-red-800 text-xs capitalize'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-white text-xs capitalize'
                }
              >
                {sev}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#991b1b] text-white hover:bg-red-800 text-xs"
          >
            <Check className="mr-1.5 h-3 w-3" />
            {isSaving ? 'Updating...' : 'Update Banner'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}