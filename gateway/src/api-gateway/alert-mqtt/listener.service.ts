import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { HttpService } from '@nestjs/axios';
import { proxyHttpRequest } from 'src/utils/proxy.utils';
import { AxiosRequestConfig } from 'axios';
import { MailerService } from '../../mailer/mailer.service';
import { createProxyRouteMap, ProxyRouteMap } from 'src/utils/proxy.routes';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlertsMqttService implements OnModuleInit {
  private client: mqtt.MqttClient;
  private proxyRoutes: ProxyRouteMap;

  constructor(
    private readonly httpService: HttpService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {
	this.proxyRoutes = createProxyRouteMap(config);
  }

  async onModuleInit() {
    this.client = mqtt.connect(process.env.ALERTS_MQTT_HOST_URL!, {
      username: process.env.ALERTS_MQTT_USERNAME_RO!,
      password: process.env.ALERTS_MQTT_PASSWORD_RO!,
      clean: true,
      protocol: 'wss',
    });


    this.client.on('connect', () => {
      this.client.subscribe('amrit/notification/processed/#', (err) => {
        if (!err) {
		  this.testMockAlert();
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      const alert = JSON.parse(message.toString());
      await this.handleAlert(alert);
    });
  }

  async handleAlert(alert: any) {
    // Ignore repeated alerts
    if (alert?.data?.repeat === true) {
      return;
    }

    // Extract alert fields
    const payload = {
      mqttTopic: alert?.data?.attributes?.mqtt_topic,
      severity: alert?.data?.severity,
      resource: alert?.data?.resource,
      country: alert?.data?.attributes?.Country,
      time: alert?.time,
    };

    if (!payload.mqttTopic) {
      console.warn('🚫 Missing required alert data, skipping.');
      return;
    }

    try {
      const basePath = 'api/oceanops';
      const route = this.proxyRoutes[basePath];
      if (!route) {
        throw new Error(`No proxy route config found for ${basePath}`);
      }

      const config: AxiosRequestConfig = {
        method: 'post',
        url: `https://${route.host}${route.targetPath}/alerts/subscriptions/matching-alert`,
		headers: {
			'Content-Type': 'application/json',
			'Accept': '*/*',
		},
		data: {
			topic: alert?.data?.attributes?.mqtt_topic,
			severity: alert?.data?.severity,
			resource: alert?.data?.resource,
			country: alert?.data?.attributes?.Country,
			time: alert?.time,
		},
      };

      interface MatchingContact {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
      }

      const response = await proxyHttpRequest(this.httpService, config) as { data: MatchingContact[] };
      const contacts = response;
      if (!Array.isArray(contacts) || contacts.length === 0) {
        return;
      }

	  let emailContent = this.formatAlertEmailContent(alert);

      for (const contact of contacts) {
		try {
			await this.sendEmail(contact.email, alert, emailContent);
		} catch {
			
		}
	  }

    } catch {
     
    }
  }

  async sendEmail(email: string, alert: any, content: string) {
	// CAN TEST WITH ETHERAL URL with sendTestEmail INSTEAD OF sendMail
	await this.mailer.sendMail(
		email,
		`Alert: ${alert.title}`,
		content,
		'AMRIT Alerts'
	);

  }

	formatAlertEmailContent(alert: any): string {
		const data = alert?.data || {};
		const attrs = data?.attributes || {};
		const summaryLines: string[] = [];
		const statusLines: string[] = [];
		const metadataLines: string[] = [];

		const addLine = (label: string, array: string[], value?: any, style?: string) => {
			if (value !== undefined && value !== null && value !== '') {
				array.push(`<p><strong>${label}:</strong> <span style="${style || ''}">${value}</span></p>`);
			}
		};

		addLine('📍 Resource', summaryLines, data.resource)
		addLine('🌍 Country', summaryLines, attrs.Country)
		addLine('📅 Date/Time', summaryLines, alert.time)
		addLine('🔧 Event', summaryLines, data.event)

		addLine('📊 Severity', statusLines , data.severity)
		addLine('📈 Trend', statusLines, data.trendIndication)
		addLine('📦 Status', statusLines, data.status)
		addLine('🔁 Duplicate Count', statusLines, data.duplicateCount)

		addLine('Argo Type', metadataLines, attrs.ArgoType)
		addLine('Last Cycle Number', metadataLines, attrs.lastCycleNumberToRaiseAlarm)
		addLine('Last Station Date', metadataLines, attrs.LastStationDate)
		addLine('Service', metadataLines, Array.isArray(data.service) ? data.service.join(', ') : undefined)
		addLine('Origin', metadataLines, data.origin)

		return `
		<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap" rel="stylesheet">

		<div style="font-family: Lexend, Arial, sans-serif; line-height: 1.5; color: #333;">
			<h2 style="color: #c0392b;">🚨 AMRIT Alert Notification</h2>

			<div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
				<p style="margin: 4px 0; color: #555;"><strong>ALERT TYPE: </strong>${alert.type || 'Alert'}</h2>
				<p style="margin: 4px 0; color: #555;"><strong>ALERT CATEGORY: </strong> ${attrs.alert_category}</p>
				<p style="margin: 4px 0; color: #555;"><strong>ALERT ID: </strong> ${alert.id}</p>
			</div>

			<h3 style="color:rgb(71, 137, 236);">Summary</h3>
			${summaryLines.join('')}

			<h3 style="color:rgb(71, 137, 236);">Status / Severity</h3>
			${statusLines.join('')}

			<h3 style="color:rgb(71, 137, 236);">Metadata</h3>
			${metadataLines.join('')}

			<h3 style="color:rgb(71, 137, 236);">Message</h3>
				<p style="background: #f9f9f9; padding: 12px; border-left: 4px solid #ccc;"><em>${data.text}</em></p>

			${attrs.FleetMonitoringLink ? `<p><strong>🔗 Fleet Monitoring:</strong> ${attrs.FleetMonitoringLink}</p>` : ''}

			<hr style="margin: 24px 0;" />

			<p style="font-size: 0.9em; color: #888;">
			This is an automated message sent from the AMRIT Alert System.<br/>
			Please do not reply directly to this email.
			</p>
		</div>
		`.replace(/undefined/g, '');
	}

  async testMockAlert() {
		await this.handleAlert({
		id: '3c26c52e-2605-47c9-a656-15c7abc46992',
		source: 'Coriolis Argo Technical data alerts',
		specversion: '1.0',
		type: 'FLAG_SUPRAHydraulicAlert_LOGICAL',
		datacontenttype: 'application/json',
		dataschema: null,
		subject: '5906990',
		time: '2025-06-04T14:40:01.654286Z',
		data: {
			resource: '5906990',
			event: 'FLAG_SUPRAHydraulicAlert_LOGICAL',
			environment: 'Development',
			severity: 'warning',
			correlate: [],
			status: 'open',
			service: ['Laboratory of Oceanography of Villefranche'],
			group: 'argo float alarm',
			value: null,
			text: 'Check hydraulic behaviour',
			tags: [],
			attributes: {
			Country: 'France',
			basin_id: null,
			alert_category: 'argo technical alerts',
			mqtt_topic: 'operational',
			ArgoType: 'PSEUDO',
			LastStationDate: '24-05-2025',
			FleetMonitoringLink: "<a href='https://fleetmonitoring.euro-argo.eu/float/5906990' target='_blank' >Go to float page on Fleet Monitoring</a>",
			lastCycleNumberToRaiseAlarm: '107',
			},
			origin: 'Coriolis Argo Technical data alerts',
			type: 'argo float alert demo',
			createTime: '2025-03-19T14:12:06.001Z',
			timeout: 1209600,
			rawData: null,
			id: 'ce553efa-dd95-4edc-b065-a00d2539011f',
			customer: null,
			duplicateCount: 33,
			repeat: false,
			previousSeverity: 'indeterminate',
			trendIndication: 'moreSevere',
			receiveTime: '2025-03-19T14:12:06.004Z',
			lastReceiveId: '79ca61a2-21f1-4d15-acdf-ec395a43d316',
			updateTime: '2025-03-19T14:12:06.004Z',
			history: [{}],
		},
		data_base64: null,
		});

	}
}

