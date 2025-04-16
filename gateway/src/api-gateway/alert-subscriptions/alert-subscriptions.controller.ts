import { Controller, Get, Query, Req } from '@nestjs/common';
import { AlertSubscriptionsService } from './alert-subscriptions.service';
import { Request } from 'express';

@Controller('alerts/subscriptions')
export class AlertSubscriptionsController {
  constructor(private readonly alertSubscriptionsService: AlertSubscriptionsService) {}

  @Get()
  async getSubscriptions(@Req() req: Request) {
    const userId = (req.user as any)?.userId;
    return this.alertSubscriptionsService.getSubscriptions(userId);
  }
}
