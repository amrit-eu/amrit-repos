import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiGatewayModule } from './api-gateway/api-gateway.module';
import { ConfigModule } from '@nestjs/config';
import { HttpLoggingService } from './http/http-logging.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ApiGatewayModule, HttpModule, ConfigModule.forRoot({isGlobal: true,})],
  controllers: [AppController],
  providers: [AppService, HttpLoggingService],
})
export class AppModule {}
