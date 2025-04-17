import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { createProxyRouteMap } from '../../utils/proxy.routes';
import { Public } from '../auth/public.decorator';

@Controller('data/topics')
export class AlertTopicsController {
  private readonly oceanopsRoute;

  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService
  ) {
    const routes = createProxyRouteMap(this.configService);
    this.oceanopsRoute = routes['api/oceanops'];
  }

  private async fetchFromOceanOps<T>(path: string): Promise<T> {
    const fullUrl = `https://${this.oceanopsRoute.host}${this.oceanopsRoute.targetPath}/${path}`;
    const res = await firstValueFrom(this.http.get(fullUrl));
    return res.data;
  }

  @Public()
  @Get()
  async getTopics() {
	return this.fetchFromOceanOps('alerts/dictionary/topics');
  }
}
