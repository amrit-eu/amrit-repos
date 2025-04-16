import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlertSubscriptionsController } from './alert-subscriptions.controller';
import { AlertSubscriptionsService } from './alert-subscriptions.service';

@Module({
  imports: [HttpModule],
  controllers: [AlertSubscriptionsController],
  providers: [AlertSubscriptionsService],
})
export class AlertSubscriptionsModule {}
