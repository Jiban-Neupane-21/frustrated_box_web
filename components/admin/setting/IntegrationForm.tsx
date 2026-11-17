'use client';

import React, { useState } from 'react';
import { IntegrationSettings } from '@/types/admin-setting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Check } from 'lucide-react';

interface IntegrationsFormProps {
  initialData: IntegrationSettings;
  onSave: (updated: IntegrationSettings) => void;
}

export function IntegrationsForm({ initialData, onSave }: IntegrationsFormProps) {
  const [data, setData] = useState<IntegrationSettings>(initialData);
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
          <Key className="h-4 w-4 text-[#991b1b]" />
          Third-Party Integrations & API Keys
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Manage secure credentials for transactional emails, error monitoring, and analytics.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Resend API Key (Email Delivery)</Label>
            <Input
              type="password"
              value={data.resendApiKey}
              onChange={(e) => setData((prev) => ({ ...prev, resendApiKey: e.target.value }))}
              className="border-zinc-800 bg-[#050505] text-white font-mono focus-visible:ring-[#991b1b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Sentry DSN (Error Tracking)</Label>
            <Input
              value={data.sentryDsn}
              onChange={(e) => setData((prev) => ({ ...prev, sentryDsn: e.target.value }))}
              className="border-zinc-800 bg-[#050505] text-white font-mono focus-visible:ring-[#991b1b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Analytics Tracking ID</Label>
            <Input
              value={data.analyticsId}
              onChange={(e) => setData((prev) => ({ ...prev, analyticsId: e.target.value }))}
              className="border-zinc-800 bg-[#050505] text-white font-mono focus-visible:ring-[#991b1b]"
            />
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
            {isSaving ? 'Saving Keys...' : 'Save Integrations'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}