export const jwtVerify = jest.fn().mockResolvedValue({
    payload: { sub: 'user123', email: 'user@test.com' }
  });
  
export const createRemoteJWKSet = jest.fn().mockReturnValue(() => {});