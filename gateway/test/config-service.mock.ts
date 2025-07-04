export const mockConfig: Record<string, string> = {
  ALERTA_HOST: 'mock-alerta-host',
  ALERTA_PROTOCOL: 'https',
  ALERTA_READ_API_KEY: 'mock-alerta-key',
  OCEANOPS_HOST: 'mock-oceanops-host',
  OCEANOPS_PROTOCOL: 'https',
};

export const mockConfigService = {
  getOrThrow: jest.fn((key: string) => {
    if (mockConfig[key]) return mockConfig[key];
    throw new Error(`Config key ${key} not found`);
  }),
};