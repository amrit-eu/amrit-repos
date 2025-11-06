import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../../utils/proxy.utils';
import { createProxyRouteMap, ProxyRouteMap } from '../../utils/proxy.routes';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MeService {
  private readonly logger = new Logger(MeService.name, { timestamp: true });
  private readonly proxyRoutes: ProxyRouteMap;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.proxyRoutes = createProxyRouteMap(this.configService);
  }

  async proxyGetMe(req: Request, contactId: number) {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'GET';

    cfg.headers = {
      ...(cfg.headers || {}),
      authorization: req.headers['authorization'] as string,
      accept: 'application/json',
    };

    // inject X-Contact-Id for auth/me
    const internalPath = req.path.replace(/^\/api\/oceanops/, ''); // '/auth/me'
    const needsContactId = (cfg.method === 'GET' && internalPath === '/auth/me');
    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete (cfg.headers as any)['X-Contact-Id'];
      delete (cfg.headers as any)['x-contact-id'];
      (cfg.headers as any)['X-Contact-Id'] = String(contactId);
    }

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return proxyHttpRequest(this.httpService, cfg);
  }

  async proxyPatchMe(req: Request, body: any, contactId: number) {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'PATCH';
    cfg.data = body;

    cfg.headers = {
      ...(cfg.headers || {}),
      authorization: req.headers['authorization'] as string,
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const internalPath = req.path.replace(/^\/api\/oceanops/, '');
    const needsContactId = (cfg.method === 'PATCH' && internalPath === '/auth/me');

    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete (cfg.headers as any)['X-Contact-Id'];
      delete (cfg.headers as any)['x-contact-id'];
      (cfg.headers as any)['X-Contact-Id'] = String(contactId);
    }

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return proxyHttpRequest(this.httpService, cfg);
  }

  async proxyPostChangePassword(req: Request, body: any, contactId: number): Promise<AxiosResponse<any>> {
    const basePath = 'api/oceanops';
    const route = this.proxyRoutes[basePath];
    if (!route) throw new Error(`No proxy route config found for ${basePath}`);

    const cfg: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, basePath, route);
    cfg.method = 'POST';
    cfg.data = body;

    cfg.headers = {
      ...(cfg.headers || {}),
      authorization: req.headers['authorization'] as string,
      accept: 'application/json',
      'content-type': 'application/json',
    };

    const internalPath = req.path.replace(/^\/api\/oceanops/, '');
    const needsContactId = (cfg.method === 'POST' && internalPath === '/auth/change-password');

    if (needsContactId) {
      if (!contactId) throw new UnauthorizedException('Missing contactId');
      delete (cfg.headers as any)['X-Contact-Id'];
      delete (cfg.headers as any)['x-contact-id'];
      (cfg.headers as any)['X-Contact-Id'] = String(contactId);
    }

    this.logger.log(`→ ${cfg.method} ${cfg.url}`);
    return await firstValueFrom(this.httpService.request(cfg));
  }
}
