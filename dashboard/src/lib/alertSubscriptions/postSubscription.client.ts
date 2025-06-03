import { gatewayFetch } from '../gateway/gatewayFetch';
import { AlertSubscription } from '@/types/alert-subscription';

export async function postSubscription(payload: {
  contactId: number;
  topicId: number;
  sendEmail?: boolean;
  minSeverityId?: number;
  countryName?: string;
  basinName?: string;
  wigosId?: string;
  minTime?: string;
  maxTime?: string;
}): Promise<AlertSubscription> {
  return gatewayFetch<AlertSubscription>('POST', '/oceanops/alerts/subscriptions', payload);
}
