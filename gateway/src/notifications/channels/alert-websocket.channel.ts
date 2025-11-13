import { Injectable } from "@nestjs/common";
import { NotificationsGateway } from "../notifications.websocket";
import { AlertNotificationPayload } from "src/types/notifications";

@Injectable()
export class AlertWebsocketChannel {
    constructor(private readonly websocketGateway: NotificationsGateway) {}

    send ({alert, contacts} : AlertNotificationPayload) {
        //1- Send the refresh for all auth users
        this.websocketGateway.broadcastAlertsRefresh();

        //2- send +1 notification badge for matching user
        const notificationDTO = {
            resource: alert.data.resource,
            event: alert.data.event
        }
        for (const contact of contacts) {
            if (!contact.userId) continue;
            this.websocketGateway.pushUserBadgeIncrement(contact.userId, notificationDTO);
        }
    }

}