'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  INITIAL_SERVICE_METRICS,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_ADMIN_MEMBERS,
  INITIAL_AUDIT_LOGS,
} from '@/lib/mock-system-data';
import {
  SystemServiceMetric,
  SystemConfig,
  AdminMember,
  AuditLogEntry,
  AdminRole,
} from '@/types/admin-system';
import { HealthStatusGrid } from '@/components/admin/system/HealthStatusGrid';
import { DangerZoneCard } from '@/components/admin/system/DangerZoneGrid';
import { FeatureFlagsForm } from '@/components/admin/system/FeatureFlagForm';
import { AdminRbacTable } from '@/components/admin/system/AdminRbacTable';
import { AuditLogsTable } from '@/components/admin/system/AuditLogTable';
import { ShieldAlert, Activity, Sliders, Users, FileText } from 'lucide-react';

export default function AdminSystemPage() {
  const [metrics, setMetrics] = useState<SystemServiceMetric[]>(INITIAL_SERVICE_METRICS);
  const [config, setConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [members, setMembers] = useState<AdminMember[]>(INITIAL_ADMIN_MEMBERS);
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ping services telemetry simulation
  const handlePingServices = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          latencyMs: Math.floor(Math.random() * 30) + 15,
          lastChecked: 'Just now',
        }))
      );
      setIsRefreshing(false);
    }, 800);
  };

  const handleToggleMaintenance = (nextVal: boolean) => {
    setConfig((prev) => ({ ...prev, maintenanceMode: nextVal }));
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'MAINTENANCE_TOGGLED',
      target: 'System Maintenance Mode',
      metadata: `Set maintenanceMode to ${nextVal}`,
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleToggleReadOnly = (nextVal: boolean) => {
    setConfig((prev) => ({ ...prev, readOnlyMode: nextVal }));
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'CONFIG_UPDATED',
      target: 'Read-Only Mode',
      metadata: `Set readOnlyMode to ${nextVal}`,
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handlePurgeCache = () => {
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'CACHE_PURGED',
      target: 'Cloudflare Edge Cache',
      metadata: 'Purged all edge worker caches',
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleSaveConfig = (updated: SystemConfig) => {
    setConfig(updated);
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'CONFIG_UPDATED',
      target: 'Platform Feature Flags & Limits',
      metadata: 'Updated system configuration parameters',
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleRoleChange = (memberId: string, newRole: AdminRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    const targetMember = members.find((m) => m.id === memberId);
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'ROLE_CHANGED',
      target: targetMember ? targetMember.handle : memberId,
      metadata: `Assigned role ${newRole}`,
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const handleRevokeAccess = (memberId: string) => {
    const targetMember = members.find((m) => m.id === memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    const newLog: AuditLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
      action: 'ADMIN_REVOKED',
      target: targetMember ? targetMember.handle : memberId,
      metadata: 'Revoked administrative access',
      ipAddress: '103.163.xxx.xx',
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 p-6 md:p-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#991b1b]/20 border border-[#991b1b]/40 text-red-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              System Command & Control
            </h1>
            <p className="text-xs text-zinc-400">
              FrustratedBox Infrastructure • Hono API, Neon PostgreSQL, Cloudflare Edge
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="border border-zinc-800 bg-[#0a0a0a] p-1 text-zinc-400">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Activity className="h-3.5 w-3.5" />
            Overview & Danger
          </TabsTrigger>
          <TabsTrigger
            value="controls"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Sliders className="h-3.5 w-3.5" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger
            value="team"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <Users className="h-3.5 w-3.5" />
            Admin Team (RBAC)
          </TabsTrigger>
          <TabsTrigger
            value="audit"
            className="flex items-center gap-2 text-xs data-[state=active]:bg-[#991b1b] data-[state=active]:text-white"
          >
            <FileText className="h-3.5 w-3.5" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-8 focus-visible:outline-none">
          <HealthStatusGrid
            metrics={metrics}
            isRefreshing={isRefreshing}
            onRefresh={handlePingServices}
          />
          <DangerZoneCard
            maintenanceMode={config.maintenanceMode}
            readOnlyMode={config.readOnlyMode}
            onToggleMaintenance={handleToggleMaintenance}
            onToggleReadOnly={handleToggleReadOnly}
            onPurgeCache={handlePurgeCache}
          />
        </TabsContent>

        {/* Tab 2: Feature Flags */}
        <TabsContent value="controls" className="focus-visible:outline-none">
          <FeatureFlagsForm initialConfig={config} onSave={handleSaveConfig} />
        </TabsContent>

        {/* Tab 3: Admin Team */}
        <TabsContent value="team" className="focus-visible:outline-none">
          <AdminRbacTable
            members={members}
            onRoleChange={handleRoleChange}
            onRevokeAccess={handleRevokeAccess}
            onInviteClick={() => alert('Invite Admin Modal Triggered')}
          />
        </TabsContent>

        {/* Tab 4: Audit Logs */}
        <TabsContent value="audit" className="focus-visible:outline-none">
          <AuditLogsTable logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}