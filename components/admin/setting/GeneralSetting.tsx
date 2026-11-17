'use client';

import React, { useState, useEffect } from 'react';
import { GeneralSettings } from '@/types/admin-setting';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Check, RotateCcw } from 'lucide-react';

interface GeneralSettingsFormProps {
  initialData: GeneralSettings;
  onSave: (updated: GeneralSettings) => void;
}

export function GeneralSettingsForm({ initialData, onSave }: GeneralSettingsFormProps) {
  const [formData, setFormData] = useState<GeneralSettings>(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
    setIsDirty(false);
  }, [initialData]);

  const handleChange = (key: keyof GeneralSettings, value: string) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialData));
      return next;
    });
  };

  const handleDiscard = () => {
    setFormData(initialData);
    setIsDirty(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setIsDirty(false);
    }, 600);
  };

  return (
    <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none relative pb-16">
      <CardHeader className="border-b border-zinc-900 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
          <Settings className="h-4 w-4 text-[#991b1b]" />
          General Platform Identity & Branding
        </CardTitle>
        <p className="text-xs text-zinc-500 mt-1">
          Configure core identifiers, support contacts, and default timezones for FrustratedBox.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Platform Name</Label>
            <Input
              value={formData.platformName}
              onChange={(e) => handleChange('platformName', e.target.value)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Support Email</Label>
            <Input
              value={formData.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Default Timezone</Label>
            <Input
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Logo URL</Label>
            <Input
              value={formData.logoUrl}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
          </div>
        </div>

        {isDirty && (
          <div className="absolute bottom-4 right-6 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#991b1b] text-white hover:bg-red-800 text-xs"
            >
              <Check className="mr-1.5 h-3 w-3" />
              {isSaving ? 'Saving...' : 'Save General Settings'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}