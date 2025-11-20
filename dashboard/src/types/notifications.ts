export type NotificationType = 'alert' | 'othertype'

export interface NotificationDTO {
    id: string;
    text: string;
    type : NotificationType;
}

