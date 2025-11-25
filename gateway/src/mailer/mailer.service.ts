import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';


interface EmailRateLimit {
  count: number;
  resetTime: number;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;


  // Number of email per user security config
  private emailCounter: Map<string, EmailRateLimit> = new Map();    
  private readonly MAX_EMAILS_PER_MINUTE = parseInt(process.env.MAX_EMAILS_PER_MINUTE ?? '10', 10); // max email per minute (for a given user)
  private readonly MAX_EMAILS_PER_HOUR = parseInt(process.env.MAX_EMAILS_PER_HOUR ?? '100', 10); // max email per hour (for a given user)
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly HOURLY_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

  


  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? '25', 10),
      secure: false,
      tls: { rejectUnauthorized: false },
    });
    // set up the interval to clean up the entries of the email counter 
    setInterval(() => this.cleanupRateLimitCache(), this.HOURLY_LIMIT_WINDOW);
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    senderName: string,
  ): Promise<void> {
    try {
      // is sending email allowed ?
      const rateLimitCheck = this.checkRateLimit(to);
      if (rateLimitCheck.allowed) {
        // send email if allowed
        const info: SMTPTransport.SentMessageInfo = await this.transporter.sendMail({
          from: `${senderName} <${process.env.SMTP_SENDER}>`,
          to,
          subject,
          html,
        });
        // increment the counter :
        this.incrementRateLimit(to);
        this.logger.log(`Email sent: ${info.messageId}`);
      } else {
        this.logger.warn(`Failed to send email : ${rateLimitCheck.reason}`)
      }
      
    } catch (err: unknown) {
      this.logger.error('Failed to send email', err);
      throw err;
    }
  }

  async sendTestEmail(
    to: string,
    subject: string,
    html: string,
    senderName: string,
  ): Promise<void> {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
      nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

    try {
      const info: SMTPTransport.SentMessageInfo = await testTransporter.sendMail({
        from: `${senderName} <${testAccount.user}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Mock Email sent: ${info.messageId}`);

      const previewUrl: string | false | undefined = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`📬 Preview URL: ${previewUrl}`);
      }
    } catch (err: unknown) {
      this.logger.error('Failed to send mock email', err);
      throw err;
    }
  }

  /**
   * Check the rate limiting : for a given email, check the count for the current minute and hour.
   * if count is superior to MAX from configuration, return allowed:false. If not return allowed:true.
   * 
   * @param to : email
   */
  private checkRateLimit(to:string) : { allowed: boolean; reason?: string } {
    const now = Date.now();
    const minuteKey= `${to}:minute`;
    const hourKey=`${to}:hour`;

    // check if limit per minute is cross:
    const minuteLimit = this.emailCounter.get(minuteKey);
    // if resetTime is in the future
    if (minuteLimit && minuteLimit.resetTime > now) {
      // check if count is > to limit :
      if (minuteLimit.count >= this.MAX_EMAILS_PER_MINUTE) {
        return {
          allowed: false,
          reason: `Rate limit exceeded: ${this.MAX_EMAILS_PER_MINUTE} emails/minute to ${to}`,
        };
      }
    }

    ///check if limit per hour is cross:
    const hourLimit = this.emailCounter.get(hourKey);
    if (hourLimit && hourLimit.resetTime > now) {
      if (hourLimit.count >= this.MAX_EMAILS_PER_HOUR) {
        return {
          allowed: false,
          reason: `Rate limit exceeded: ${this.MAX_EMAILS_PER_HOUR} emails/hour to ${to}`,
        };
      }
    }

    // if no limit exceeded
    return { allowed: true };
  }

  /**
   * When a new email is send to "to", increment the counter (minute & hour)
   * @param to 
   */
  private incrementRateLimit(to:string) : void {
    const now = Date.now();

    // increment minute count :
    const minuteKey= `${to}:minute`;
    const minuteLimit = this.emailCounter.get(minuteKey);
    if (!minuteLimit || minuteLimit.resetTime <= now) {
      // if we are after the reset time, set a new reset time
      this.emailCounter.set(minuteKey, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW,
      });
    } else {
      minuteLimit.count++;
    }

    //increment hour count
    const hourKey = `${to}:hour`;
    const hourLimit = this.emailCounter.get(hourKey);
    if (!hourLimit || hourLimit.resetTime <= now) {
      this.emailCounter.set(hourKey, {
        count: 1,
        resetTime: now + this.HOURLY_LIMIT_WINDOW,
      });
    } else {
      hourLimit.count++;
    }

  }

  /**
   * cleanup entries expired entries of emailCounter
   */
  private cleanupRateLimitCache(): void {
    const now = Date.now();

    for (const [key, limit] of this.emailCounter.entries()) {
      if (limit.resetTime <= now) {
        this.emailCounter.delete(key);
      }
    }


  }
}
