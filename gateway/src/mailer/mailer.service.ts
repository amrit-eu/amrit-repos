import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: parseInt(process.env.SMTP_PORT || '25', 10),
    secure: false,
    tls: { rejectUnauthorized: false },
  });

  async sendMail(to: string, subject: string, html: string, senderName: string) {

    try {
      const info = await this.transporter.sendMail({
        from: senderName + " <" + process.env.SMTP_SENDER + ">",
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (err) {
      this.logger.error('Failed to send email', err);
      throw err;
    }
  }

  async sendTestEmail(to: string, subject: string, html: string, senderName: string) {

	const testAccount = await nodemailer.createTestAccount();
		const transporter = nodemailer.createTransport({
		host: testAccount.smtp.host,
		port: testAccount.smtp.port,
		secure: testAccount.smtp.secure,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
		});

			try {
				const info = await transporter.sendMail({
					from: senderName + " <" + process.env.SMTP_SENDER + ">",
					to,
					subject,
					html,
				});
				this.logger.log(`Mock Email sent: ${info.messageId}`);
			} catch (err) {
			this.logger.error('Failed to send mock email', err);
			throw err;
	}

  }
}
