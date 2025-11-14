import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsGateway } from './notifications.websocket';
import { AlertEmailChannel } from './channels/alert-email.channel';
import { AlertWebsocketChannel } from './channels/alert-websocket.channel';
import { EmailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [EmailModule],
  providers: [
    NotificationsService,
    NotificationsGateway,
    AlertEmailChannel,
    AlertWebsocketChannel
  ],
  exports: [NotificationsService]
})
export class NotificationsModule {}
