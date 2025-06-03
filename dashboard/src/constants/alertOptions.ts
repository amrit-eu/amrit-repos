import { FilterOption } from '@/types/filters';

export const ALERT_SEVERITIES = [
  "security",
  "critical",
  "major",
  "minor",
  "warning",
  "informational",
  "debug",
  "trace",
  "indeterminate",
  "cleared",
  "normal",
  "ok",
  "unknown",
] as const;

export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_SEVERITY_OPTIONS: FilterOption[] = Array.from(ALERT_SEVERITIES).map((sev) => ({
  value: sev,
  label: sev.charAt(0).toUpperCase() + sev.slice(1),
}));

export const ALERT_STATUSES = [
  "open",
  "assign",
  "ack",
  "closed",
  "expired",
  "blackout",
  "shelved",
  "unknown",
] as const;

export type AlertStatus = (typeof ALERT_STATUSES)[number];
