import { Module } from '@nestjs/common';
import { AlertsMqttService } from './listener.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AlertSubscriptionsModule } from '../alert-subscriptions/alert-subscriptions.module';

@Module({
  imports: [HttpModule, NotificationsModule,AlertSubscriptionsModule ],
  providers: [AlertsMqttService],
  exports: []
})
export class AlertsMqttModule {}
