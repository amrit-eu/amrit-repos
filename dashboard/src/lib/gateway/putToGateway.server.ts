import { fetchFromGateway } from '@/lib/gateway/fetchFromGateway.server';

export async function putToGateway<T>(path: string, body: unknown): Promise<T> {
    return fetchFromGateway<T>({
    method: 'PUT',
    path,
    body
  });
}