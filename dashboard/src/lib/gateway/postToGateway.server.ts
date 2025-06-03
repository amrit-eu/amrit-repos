import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';

export async function postToGateway<T>(path: string, body: unknown, cookieHeader: string): Promise<T> {
  return fetchFromGateway<T>({
    method: 'POST',
    path,
    body,
	cookieHeader
  });
}