import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { EmailFormatterService } from "src/mailer/email-formatter.service";
import { MailerService } from "src/mailer/mailer.service";
import { AlertEvent } from "src/types/alert";
import { AlertNotificationPayload } from "src/types/notifications";

@Injectable()
export class AlertEmailChannel implements OnModuleInit {
    private readonly logger = new Logger(AlertEmailChannel.name);
    private activeEmail : boolean;
    
    constructor(private readonly mailer: MailerService, private readonly emailFormatter: EmailFormatterService ) {}
    onModuleInit() {
        this.activeEmail = process.env.ACTIVE_EMAIL === 'true';
    }

    async sendNotification ({alert, contacts}: AlertNotificationPayload) {
        if (!Array.isArray(contacts) || contacts.length === 0) return; // no contact to notify

         // build email content :
        const emailContent = this.emailFormatter.formatAlertEmailContent(alert);

        // send email to each contact
        for (const contact of contacts) {
            if (!contact.email) continue;
            try {
                this.logger.log("send email to " + contact.email + " for alert resource "+alert.data.resource+ " event " + alert.data.event)
                await this.sendEmail(contact.email, alert, emailContent);
            } catch (emailError) {
                this.logger.error(`Failed to send email to ${contact.email}`, emailError);
            }
        }

    }

      async sendEmail(email: string, alert: AlertEvent, content: string): Promise<void> {
            
        if (this.activeEmail) {
        await this.mailer.sendMail(
          email,
          `Alert: ${alert.data.resource} - ${alert.data.event}`,
          content,
          'AMRIT Alerts',
        );
      } else {
        await this.mailer.sendTestEmail(
          email,
          `Alert: ${alert.data.resource} - ${alert.data.event}`,
          content,
          'AMRIT Alerts',
        );
      }
      }

}