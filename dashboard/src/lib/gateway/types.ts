export type GatewayMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

export interface GatewayProxyPayload {
  method: GatewayMethod;
  path: string;
  body?: unknown;
}
