import { Controller, Get, Req } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { Request } from 'express';
import { AlertFiltersService } from './alert-filters.service';

@Controller('data')
export class AlertFiltersController {
  constructor(private readonly alertFiltersService: AlertFiltersService) {}

  @Public()
  @Get('countries')
  async getCountries() {
    return this.alertFiltersService.fetchCountries();
  }
}
