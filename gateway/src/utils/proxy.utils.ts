import { IncomingHttpHeaders } from 'http';


export function cleanProxyHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    const excluded = [
      'host',
      'Host',
      'content-length',
      'connection',
      'accept-encoding',
      'postman-token',
      'user-agent',
    ];
  
    return Object.fromEntries(
      Object.entries(headers)
        .filter(([key]) => !excluded.includes(key.toLowerCase()))
        .map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(',') : String(value),
        ]),
    );
  }