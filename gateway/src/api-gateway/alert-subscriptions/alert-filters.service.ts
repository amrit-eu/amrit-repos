import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { createProxyRouteMap, ProxyRouteMap } from '../../utils/proxy.routes';
import { AxiosRequestConfig } from 'axios';
import { proxyHttpRequest } from '../../utils/proxy.utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlertFiltersService {
  private readonly logger = new Logger(AlertFiltersService.name, { timestamp: true })
  private readonly proxyRoutes: ProxyRouteMap;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService,) { 
    this.proxyRoutes = createProxyRouteMap(this.configService);
  }
  
  async fetchCountries(): Promise<any> {
    this.logger.log(`Proxy request to Oceanops API (/data/country) `);
    const basePath = 'api/oceanops'

    const route = this.proxyRoutes[basePath];
    if (!route) {
      throw new Error(`No proxy route config found for ${basePath}`);
    } 

    const { host, protocol, targetPath } = route; 

    const include = encodeURIComponent(JSON.stringify(['code2', 'id', 'name']));
    const exp = encodeURIComponent(JSON.stringify(['active = 1 and wmoMember=1']));

    const method = "get";
    const url = `${protocol}://${host}${targetPath}/country?include=${include}&exp=${exp}`;
    const headers = {'Content-Type' : 'application/json'}
    
    const config : AxiosRequestConfig = {
          method,
          url,
          headers
        };

    const data = await proxyHttpRequest<unknown>(this.httpService, config);
    

    return data;
  }
}
