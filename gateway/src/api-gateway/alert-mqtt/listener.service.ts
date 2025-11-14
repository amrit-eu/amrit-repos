import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ContactMatcherService } from '../alert-subscriptions/contact-matcher.service';
import { AlertEvent } from '../../types/alert';
import { NotificationsConfig } from 'src/types/notifications';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AlertsMqttService implements OnModuleInit {
  private client!: mqtt.MqttClient;
  private activeEmail : boolean;
  private readonly logger = new Logger(AlertsMqttService.name);
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor(
    private readonly contactMatcher: ContactMatcherService,
    private readonly notificationService: NotificationsService
  ) { }

  onModuleInit(): void {
    this.activeEmail = process.env.ACTIVE_EMAIL === 'true';
    this.client = mqtt.connect(process.env.ALERTS_MQTT_HOST_URL!, {
      username: process.env.ALERTS_MQTT_USERNAME_RO!,
      password: process.env.ALERTS_MQTT_PASSWORD_RO!,
      clean: true,
      protocol: 'wss',
      reconnectPeriod: 5000,
    });
    this.logger.log('Connection to MQTT broker...');

    // error on connection
    this.client.on('error', (error) => {
      this.logger.error('❌ MQTT connection error:', error);
    })

    // connection to broker
    this.client.on('connect', () => {
      this.logger.log('✅ Successfully connected to MQTT broker');
      this.reconnectAttempts = 0;
      // subscribe after connection
      this.client.subscribe('amrit/notification/processed/#', (err) => {
        if (!err) {
          this.logger.log('✅ Connected to MQTT broker');
          // RECIEVE AND HANDLE MOCK ALERT FOR TESTING IN DEV (only if sending real email is not activated)
          if(!this.activeEmail) void this.testMockAlert();             
        }
        else {
          this.logger.log("Error when subscribing to topic", err)
        }
      });
    });
    // re-connection tentative
    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      this.logger.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`);

      if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
        this.logger.error('❌ Max reconnection attempts reached. Stopping reconnection.');
        this.client.end(true); // end client
      }
    });

    // message handling
    this.client.on('message', (topic, message) => {
      void (async () => {
        try {
        const alert = JSON.parse(message.toString()) as AlertEvent;
        await this.handleAlert(alert);
        } catch (err) {
        this.logger.error('⚠️ Failed to parse or handle alert message', err);
        }
      })();
    });
  }

  async handleAlert(alert: AlertEvent): Promise<void> {
    this.logger.log ("alert received on mqtt : " + alert.data.resource +", "+alert.data.event+", "+alert.data.severity)
    // build notification alert payload 
    const payload = {
      alertCategory: alert?.data?.attributes?.alert_category,
      severity: alert?.data?.severity,
      resource: alert?.data?.resource,
      country: alert?.data?.attributes?.Country,
      time: alert?.time,
    };

    if (!payload.alertCategory) {
      this.logger.warn('Missing required alert data, skipping.');
      return;
    }

    // email sent only if alert is a new one an not a duplicate. Websocket notification sent anyway.
    const notificationConfig : NotificationsConfig = {
      alertEmailEnabled: (alert?.data?.repeat === false),
      alertWebsocketEnabled: true
    }    

    try {
      const contacts = await this.contactMatcher.findMatchingContacts(alert);
      // notify this alert
      await this.notificationService.notify({alert,contacts}, notificationConfig);

    } catch (err) {
      this.logger.error('Contact matching or notifications failed', err);
    }
  }

  async testMockAlert(): Promise<void> {
    const mock: AlertEvent = {
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
        severity: 'critical',
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
          alert_category: 'Technical issue',
          mqtt_topic: 'operational',
          ArgoType: 'PSEUDO',
          LastStationDate: '24-05-2025',
          url: 'https://fleetmonitoring.euro-argo.eu/float/5906990',         
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
  		lastReceiveTime: '2025-03-19T14:12:06.004Z',
        history: [],
      },
      data_base64: null,
    };

    await this.handleAlert(mock);
  }
}
