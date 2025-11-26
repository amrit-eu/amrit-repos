import { Injectable } from '@nestjs/common';
import { AlertWebsocketChannel } from './channels/alert-websocket.channel';
import { AlertNotificationPayload, NotificationsConfig } from 'src/types/notifications';
import { AlertEmailChannel } from './channels/alert-email.channel';

@Injectable()
export class NotificationsService {

    constructor(
        private readonly email: AlertEmailChannel,
        private readonly ws: AlertWebsocketChannel,
  ) {}



  async notify (payload: any, cfg : NotificationsConfig) {
    const tasks: Promise<any>[] = [];
    if (cfg.alertWebsocketEnabled) tasks.push(this.ws.sendNotification(payload as AlertNotificationPayload))
    if (cfg.alertEmailEnabled) tasks.push(this.email.sendNotification(payload as AlertNotificationPayload))
    await Promise.allSettled(tasks);
  }
}
