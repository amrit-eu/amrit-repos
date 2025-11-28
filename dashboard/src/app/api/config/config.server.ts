// ENV variables that should be defined at runtime
export function getGatewayBaseUrl() {
  const val = process.env.GATEWAY_BASE_URL;
  if (!val) throw new Error('GATEWAY_BASE_URL env var required');
  return val;
}

export function getGatewayPublicBaseUrl() {
  const val = process.env.GATEWAY_PUBLIC_BASE_URL;
  if (!val) throw new Error('GATEWAY_PUBLIC_BASE_URL env var required');
  return val;
}

export function getOceanopsAuthServiceUrl() {
  return getGatewayBaseUrl() + '/oceanops/auth';
}

export function getPublicSignupUrl() {
  const val = process.env.PUBLIC_SIGNUP_URL;
  if (!val) throw new Error('PUBLIC_SIGNUP_URL env var required');
  return val;
}