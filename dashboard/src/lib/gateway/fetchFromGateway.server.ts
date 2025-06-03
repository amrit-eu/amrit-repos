import { GATEWAY_BASE_URL } from '@/config/api-routes';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface FetchFromGatewayOptions {
  method?: HttpMethod;
  path: string;
  body?: unknown;
  cache?: RequestCache;
  cookieHeader?: string;
}

export async function fetchFromGateway<T>({
  method = 'GET',
  path,
  body,
  cache = 'no-store',
  cookieHeader = '',
}: FetchFromGatewayOptions): Promise<T> {
  const res = await fetch(`${GATEWAY_BASE_URL}${path}`, {
    method,
    cache,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader, 
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`${method} ${path} failed:`, errorText);
    throw new Error(`Gateway request failed: ${res.status} ${res.statusText}`);
  }

  	const contentType = res.headers.get('content-type') || '';
	if (!contentType.includes('application/json')) {
	return {} as T;
	}

	const text = await res.text();
	return text ? JSON.parse(text) : ({} as T);

}