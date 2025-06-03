import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class HttpLoggingService implements OnModuleInit {
  constructor(private readonly httpService: HttpService) {}

  onModuleInit() {

    this.httpService.axiosRef.interceptors.request.use((config) => {
      try {
        const log = {
          method: config.method,
          url: config.url,
          headers: config.headers,
          data: config.data,
        };

        console.log('🌍 Outgoing request:', log);
      } catch (err) {
        console.warn('⚠️ Could not log request:', config.url, err);
      }

      return config;
    });
  }
}
