import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlertSubscriptionsController } from './alert-subscriptions.controller';
import { AlertSubscriptionsService } from './alert-subscriptions.service';
import { AlertTopicsController } from './alert-topics.controller';
import { AlertFiltersController } from './alert-filters.controller';
import { AlertFiltersService } from './alert-filters.service';
import { ContactMatcherService } from './contact-matcher.service';

@Module({
  imports: [HttpModule],
  controllers: [AlertSubscriptionsController, AlertTopicsController, AlertFiltersController],
  providers: [AlertSubscriptionsService, AlertFiltersService, ContactMatcherService],
  exports : [ContactMatcherService]
})
export class AlertSubscriptionsModule {}
