import { SystemSettings } from '@/types/admin-setting';

export const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  general: {
    platformName: 'FrustratedBox',
    supportEmail: 'support@frustratedbox.com',
    timezone: 'Asia/Kathmandu (GMT+5:45)',
    logoUrl: 'https://frustratedbox.com/logo.png',
    faviconUrl: 'https://frustratedbox.com/favicon.ico',
  },
  announcement: {
    enabled: true,
    text: '🔥 V2.4 update is live! Share your anonymous thoughts securely.',
    severity: 'info',
  },
  integrations: {
    resendApiKey: 're_************************',
    sentryDsn: 'https://example@o0.ingest.sentry.io/0',
    analyticsId: 'G-FRUSTRATEDBOX',
  },
  dataRetention: {
    ventExpirationDays: 90,
    unverifiedCleanupDays: 7,
  },
};