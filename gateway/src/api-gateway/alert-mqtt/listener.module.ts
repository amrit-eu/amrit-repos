import { Module } from '@nestjs/common';
import { AlertsMqttService } from './listener.service';
import { HttpModule } from '@nestjs/axios';
import { EmailModule } from '../../mailer/mailer.module';

@Module({
  imports: [HttpModule, EmailModule],
  providers: [AlertsMqttService, EmailModule],
})
export class AlertsMqttModule {}
