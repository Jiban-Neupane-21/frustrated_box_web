import {
  SystemServiceMetric,
  SystemConfig,
  AdminMember,
  AuditLogEntry,
} from '@/types/admin-system';

export const INITIAL_SERVICE_METRICS: SystemServiceMetric[] = [
  {
    id: 'api',
    name: 'Core API Server',
    provider: 'Hono on Cloudflare Workers',
    status: 'operational',
    latencyMs: 38,
    uptimePercent: 99.98,
    details: '420 req/min • 0.01% error rate',
    lastChecked: 'Just now',
  },
  {
    id: 'database',
    name: 'Primary Database',
    provider: 'Neon Serverless PostgreSQL',
    status: 'operational',
    latencyMs: 24,
    uptimePercent: 99.99,
    details: '14/100 active connections • 1.8 GB / 10 GB',
    lastChecked: 'Just now',
  },
  {
    id: 'edge',
    name: 'Edge Network & WAF',
    provider: 'Cloudflare CDN',
    status: 'operational',
    latencyMs: 12,
    uptimePercent: 100,
    details: '94.2% cache hit • 38 rate-limits blocked (24h)',
    lastChecked: 'Just now',
  },
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  maintenanceMode: false,
  readOnlyMode: false,

  allowNewRegistrations: true,
  requireEmailVerification: false,
  enableAnonymousPosting: true,
  enableMediaUploads: true,
  autoModerationFilter: true,

  maxPostLength: 2000,
  rateLimitPostsPerHour: 10,
  autoHideReportThreshold: 5,
};

export const INITIAL_ADMIN_MEMBERS: AdminMember[] = [
  {
    id: 'adm_01',
    name: 'Jiban Neupane',
    handle: '@jiban',
    email: 'jiban@frustratedbox.com',
    role: 'SUPER_ADMIN',
    status: 'active',
    lastActive: 'Online now',
    addedAt: '2026-09-12',
  },
  {
    id: 'adm_02',
    name: 'Aarav Sharma',
    handle: '@aarav_mod',
    email: 'aarav@frustratedbox.com',
    role: 'MODERATOR',
    status: 'active',
    lastActive: '18 mins ago',
    addedAt: '2026-10-04',
  },
  {
    id: 'adm_03',
    name: 'Sita Gurung',
    handle: '@sita_ops',
    email: 'sita@frustratedbox.com',
    role: 'SUPPORT',
    status: 'active',
    lastActive: '3 hours ago',
    addedAt: '2026-10-21',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log_104',
    timestamp: '2026-11-17 07:12:45',
    actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
    action: 'CONFIG_UPDATED',
    target: 'autoHideReportThreshold',
    metadata: 'Changed value from 3 → 5',
    ipAddress: '103.163.xxx.xx',
  },
  {
    id: 'log_103',
    timestamp: '2026-11-16 21:40:10',
    actor: { id: 'adm_02', name: 'Aarav Sharma', handle: '@aarav_mod' },
    action: 'CACHE_PURGED',
    target: 'Cloudflare Edge Cache',
    metadata: 'Purged /feed and /trending routes',
    ipAddress: '27.34.xxx.xx',
  },
  {
    id: 'log_102',
    timestamp: '2026-11-15 14:05:33',
    actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
    action: 'ROLE_CHANGED',
    target: '@sita_ops',
    metadata: 'Assigned role SUPPORT',
    ipAddress: '103.163.xxx.xx',
  },
  {
    id: 'log_101',
    timestamp: '2026-11-12 09:30:00',
    actor: { id: 'adm_01', name: 'Jiban Neupane', handle: '@jiban' },
    action: 'MAINTENANCE_TOGGLED',
    target: 'System Maintenance Mode',
    metadata: 'Disabled maintenance mode after DB migration',
    ipAddress: '103.163.xxx.xx',
  },
];