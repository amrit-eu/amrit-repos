import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AlertSubscriptionsService {
  private readonly oceanOpsBaseUrl = 'https://oceanops-api-main.isival.ifremer.fr/api';

  constructor(private readonly http: HttpService) {}

  async getSubscriptions(contactId: string): Promise<any> {
    const url = `${this.oceanOpsBaseUrl}/data/alerts/subscriptions?contactId=${contactId}`;
    const response = await firstValueFrom(this.http.get(url));
    return response.data;
  }
}
