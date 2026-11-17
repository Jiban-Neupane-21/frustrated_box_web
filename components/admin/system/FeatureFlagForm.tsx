'use client';

import React, { useState, useEffect } from 'react';
import { SystemConfig } from '@/types/admin-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sliders, Check, RotateCcw, ShieldCheck, MessageSquare, UserCheck } from 'lucide-react';

interface FeatureFlagsFormProps {
  initialConfig: SystemConfig;
  onSave: (updatedConfig: SystemConfig) => void;
}

export function FeatureFlagsForm({ initialConfig, onSave }: FeatureFlagsFormProps) {
  const [config, setConfig] = useState<SystemConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
    setIsDirty(false);
  }, [initialConfig]);

  const handleToggle = (key: keyof SystemConfig, value: boolean) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialConfig));
      return next;
    });
  };

  const handleNumberChange = (key: keyof SystemConfig, value: number) => {
    setConfig((prev) => {
      const next = { ...prev, [key]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialConfig));
      return next;
    });
  };

  const handleDiscard = () => {
    setConfig(initialConfig);
    setIsDirty(false);
  };

  const handleSaveClick = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(config);
      setIsSaving(false);
      setIsDirty(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#991b1b]" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Platform Feature Flags & Dynamic Limits
          </h2>
        </div>
        <p className="text-xs text-zinc-500">
          Changes apply instantly across Cloudflare edge workers & Hono API.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User & Auth Controls */}
        <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
          <CardHeader className="border-b border-zinc-900 pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
              <UserCheck className="h-4 w-4 text-zinc-400" />
              User & Registration Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white">Allow New Registrations</Label>
                <p className="text-xs text-zinc-500">Enable or disable new user signups on FrustratedBox.</p>
              </div>
              <Switch
                checked={config.allowNewRegistrations}
                onCheckedChange={(val: boolean) => handleToggle('allowNewRegistrations', val)}
                className="data-[state=checked]:bg-[#991b1b]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white">Require Email Verification</Label>
                <p className="text-xs text-zinc-500">Force users to verify email before posting or commenting.</p>
              </div>
              <Switch
                checked={config.requireEmailVerification}
                onCheckedChange={(val: boolean) => handleToggle('requireEmailVerification', val)}
                className="data-[state=checked]:bg-[#991b1b]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Venting & Content Controls */}
        <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
          <CardHeader className="border-b border-zinc-900 pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
              <MessageSquare className="h-4 w-4 text-zinc-400" />
              Venting & Content Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white">Anonymous Posting</Label>
                <p className="text-xs text-zinc-500">Core feature allowing anonymous thought sharing and venting.</p>
              </div>
              <Switch
                checked={config.enableAnonymousPosting}
                onCheckedChange={(val: boolean) => handleToggle('enableAnonymousPosting', val)}
                className="data-[state=checked]:bg-[#991b1b]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white">Media Attachments</Label>
                <p className="text-xs text-zinc-500">Allow image uploads in vents and comments.</p>
              </div>
              <Switch
                checked={config.enableMediaUploads}
                onCheckedChange={(val: boolean) => handleToggle('enableMediaUploads', val)}
                className="data-[state=checked]:bg-[#991b1b]"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-900 pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium text-white">Auto-Moderation Filter</Label>
                <p className="text-xs text-zinc-500">Automatic slur/profanity flagging engine.</p>
              </div>
              <Switch
                checked={config.autoModerationFilter}
                onCheckedChange={(val: boolean) => handleToggle('autoModerationFilter', val)}
                className="data-[state=checked]:bg-[#991b1b]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dynamic Thresholds */}
      <Card className="border-zinc-800/80 bg-[#0a0a0a] text-zinc-100 shadow-none">
        <CardHeader className="border-b border-zinc-900 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium text-white">
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
            Dynamic Rate Limits & Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Max Post Length (Characters)</Label>
            <Input
              type="number"
              value={config.maxPostLength}
              onChange={(e) => handleNumberChange('maxPostLength', parseInt(e.target.value) || 0)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
            <p className="text-[11px] text-zinc-500">Upper limit for vent body text.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Rate Limit (Posts / Hour / User)</Label>
            <Input
              type="number"
              value={config.rateLimitPostsPerHour}
              onChange={(e) => handleNumberChange('rateLimitPostsPerHour', parseInt(e.target.value) || 0)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
            <p className="text-[11px] text-zinc-500">Spam prevention threshold.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400">Auto-Hide Report Threshold</Label>
            <Input
              type="number"
              value={config.autoHideReportThreshold}
              onChange={(e) => handleNumberChange('autoHideReportThreshold', parseInt(e.target.value) || 0)}
              className="border-zinc-800 bg-[#050505] text-white focus-visible:ring-[#991b1b]"
            />
            <p className="text-[11px] text-zinc-500">Reports required to auto-hide post into safety queue.</p>
          </div>
        </CardContent>
      </Card>

      {/* Floating Unsaved Changes Bar */}
      {isDirty && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl border border-zinc-700 bg-zinc-950/90 px-6 py-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            You have unsaved system configuration changes.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
              className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white text-xs h-8"
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Discard
            </Button>
            <Button
              size="sm"
              onClick={handleSaveClick}
              disabled={isSaving}
              className="bg-[#991b1b] text-white hover:bg-red-800 text-xs h-8"
            >
              <Check className="mr-1.5 h-3 w-3" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}