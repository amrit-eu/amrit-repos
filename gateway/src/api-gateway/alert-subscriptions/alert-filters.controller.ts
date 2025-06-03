import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/public.decorator';
import { AlertFiltersService } from './alert-filters.service';

@Controller('data')
export class AlertFiltersController {
  constructor(private readonly alertFiltersService: AlertFiltersService) {}

  @Public()
  @Get('countries')
  async getCountries(): Promise<unknown> {
    return this.alertFiltersService.fetchCountries();
  }
}
