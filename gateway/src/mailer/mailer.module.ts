import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { EmailFormatterService } from './email-formatter.service';

@Module({
  providers: [MailerService, EmailFormatterService],
  exports: [MailerService, EmailFormatterService],
})
export class EmailModule {}
