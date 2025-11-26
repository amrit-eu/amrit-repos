import { Injectable } from "@nestjs/common";
import { NotificationsGateway } from "../notifications.websocket";
import {  AlertNotificationPayload, NotificationDTO } from "src/types/notifications";

@Injectable()
export class AlertWebsocketChannel {
    constructor(private readonly websocketGateway: NotificationsGateway) {}

    sendNotification ({alert, contacts} : AlertNotificationPayload): Promise<void> {
        //1- Send the refresh for all auth users
        this.websocketGateway.broadcastAlertsRefresh();

        //2- send +1 notification badge for matching user
        const notificationDTO : NotificationDTO= {
            id: alert.data.id,
            text: `${alert.data.resource} - ${alert.data.event}`,
            type : 'alert'
        }

        for (const contact of contacts) {
            if (!contact.id) continue;
            this.websocketGateway.pushUserBadgeIncrement(contact.id.toString(), notificationDTO);
        }

         // Explicit return of resolve Promise (no await in intern)
        return Promise.resolve();
    }

}