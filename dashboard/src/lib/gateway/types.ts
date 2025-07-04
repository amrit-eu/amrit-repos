export type GatewayMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export interface GatewayProxyPayload {
  method: GatewayMethod;
  path: string;
  body?: unknown;
}
