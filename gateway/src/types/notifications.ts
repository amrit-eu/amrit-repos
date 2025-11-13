import { AlertEvent } from "./alert";

export type Channel = 'email' | 'websocket';

export interface AlertNotificationPayload {
  alert: AlertEvent;
  contacts: Array<{ userId: string; email?: string }>;
}

export interface NotificationsConfig {
  alertEmailEnabled: boolean;
  alertWebsocketEnabled: boolean;
}