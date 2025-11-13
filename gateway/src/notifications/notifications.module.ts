import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.websocket';

@Module({
  providers: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
