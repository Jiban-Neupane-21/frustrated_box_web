export type AnnouncementSeverity = 'info' | 'warning' | 'alert';

export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  timezone: string;
  logoUrl: string;
  faviconUrl: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  severity: AnnouncementSeverity;
}

export interface IntegrationSettings {
  resendApiKey: string;
  sentryDsn: string;
  analyticsId: string;
}

export interface DataRetentionSettings {
  ventExpirationDays: number;
  unverifiedCleanupDays: number;
}

export interface SystemSettings {
  general: GeneralSettings;
  announcement: AnnouncementSettings;
  integrations: IntegrationSettings;
  dataRetention: DataRetentionSettings;
}