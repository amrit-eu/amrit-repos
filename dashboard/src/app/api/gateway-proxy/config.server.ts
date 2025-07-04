// ENV variables that should be defined at runtime
export const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:3001/api'
export const OCEANOPS_AUTH_SERVICE = GATEWAY_BASE_URL+'/oceanops/auth'