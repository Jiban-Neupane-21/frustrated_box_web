export type ServiceStatus = 'operational' | 'degraded' | 'down';

export interface SystemServiceMetric {
  id: 'api' | 'database' | 'edge';
  name: string;
  provider: string;
  status: ServiceStatus;
  latencyMs: number;
  uptimePercent: number;
  details: string;
  lastChecked: string;
}

export interface SystemConfig {
  // Emergency Toggles
  maintenanceMode: boolean;
  readOnlyMode: boolean;

  // Feature Flags
  allowNewRegistrations: boolean;
  requireEmailVerification: boolean;
  enableAnonymousPosting: boolean;
  enableMediaUploads: boolean;
  autoModerationFilter: boolean;

  // Dynamic Thresholds
  maxPostLength: number;
  rateLimitPostsPerHour: number;
  autoHideReportThreshold: number;
}

export type AdminRole = 'SUPER_ADMIN' | 'MODERATOR' | 'SUPPORT';
export type AdminStatus = 'active' | 'suspended';

export interface AdminMember {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastActive: string;
  addedAt: string;
}

export type AuditActionType =
  | 'CONFIG_UPDATED'
  | 'MAINTENANCE_TOGGLED'
  | 'ROLE_CHANGED'
  | 'ADMIN_INVITED'
  | 'ADMIN_REVOKED'
  | 'CACHE_PURGED';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    id: string;
    name: string;
    handle: string;
  };
  action: AuditActionType;
  target: string;
  metadata: string;
  ipAddress: string;
}