'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INITIAL_SYSTEM_SETTINGS } from '@/lib/mock-setting-data';
import {
  SystemSettings,
  GeneralSettings,
  AnnouncementSettings,
  IntegrationSettings,
  DataRetentionSettings,
} from '@/types/admin-setting';
import { GeneralSettingsForm } from '@/components/admin/setting/GeneralSetting';
import { AnnouncementBannerCard } from '@/components/admin/setting/AnnouncementBannerCard';
import { IntegrationsForm } from '@/components/admin/setting/IntegrationForm';
import { DataRetentionCard } from '@/components/admin/setting/DataRetentionCard';
import { Settings, Megaphone, Key, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);

  const handleSaveGeneral = (updated: GeneralSettings) => {
    setSettings((prev) => ({ ...prev, general: updated }));
  };

  const handleSaveAnnouncement = (updated: AnnouncementSettings) => {
    setSettings((prev) => ({ ...prev, announcement: updated }));
  };

  const handleSaveIntegrations = (updated: IntegrationSettings) => {
    setSettings((prev) => ({ ...prev, integrations: updated }));
  };

  const handleSaveRetention = (updated: DataRetentionSettings) => {
    setSettings((prev) => ({ ...prev, dataRetention: updated }));
  };

  const handleExportDump = () => {
    alert('Database SQL dump export initiated successfully.');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#991b1b]/20 border border-[#991b1b]/40 text-red-400">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Platform Settings & Configuration
            </h1>
            <p className="text-xs text-zinc-400">
              Manage global branding, announcement banners, API integrations, and data retention rules.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="border border-zinc-800 bg-[#0a0a0a] p-1 text-zinc-400">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Settings className="h-3.5 w-3.5" />
            General & Branding
          </TabsTrigger>
          <TabsTrigger
            value="announcement"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Megaphone className="h-3.5 w-3.5" />
            Announcements
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Key className="h-3.5 w-3.5" />
            API Integrations
          </TabsTrigger>
          <TabsTrigger
            value="retention"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Database className="h-3.5 w-3.5" />
            Data & Retention
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="focus-visible:outline-none">
          <GeneralSettingsForm initialData={settings.general} onSave={handleSaveGeneral} />
        </TabsContent>

        <TabsContent value="announcement" className="focus-visible:outline-none">
          <AnnouncementBannerCard initialData={settings.announcement} onSave={handleSaveAnnouncement} />
        </TabsContent>

        <TabsContent value="integrations" className="focus-visible:outline-none">
          <IntegrationsForm initialData={settings.integrations} onSave={handleSaveIntegrations} />
        </TabsContent>

        <TabsContent value="retention" className="focus-visible:outline-none">
          <DataRetentionCard
            initialData={settings.dataRetention}
            onSave={handleSaveRetention}
            onExportDump={handleExportDump}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}