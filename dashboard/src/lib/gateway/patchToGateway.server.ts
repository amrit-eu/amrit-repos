import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';

export async function patchToGateway<T>(path: string, body: unknown, cookieHeader: string): Promise<T> {
  return fetchFromGateway<T>({ method: 'PATCH', path, body,
	cookieHeader });
}