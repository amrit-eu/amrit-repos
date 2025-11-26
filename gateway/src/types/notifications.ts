import { MatchingContact } from "src/api-gateway/alert-subscriptions/contact-matcher.service";
import { AlertEvent } from "./alert";

export type Channel = 'email' | 'websocket';

export interface AlertNotificationPayload {
  alert: AlertEvent;
  contacts: Array<MatchingContact>;
}

export interface NotificationsConfig {
  alertEmailEnabled: boolean;
  alertWebsocketEnabled: boolean;
}

export type NotificationType = 'alert' | 'othertype'

export interface NotificationDTO {
    id: string;
    text: string;
    type : NotificationType;
}

