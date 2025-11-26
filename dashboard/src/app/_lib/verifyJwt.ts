import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';
import { getOceanopsAuthServiceUrl } from '../api/config/config.server';

  // avoid create a JWKSSet isntance a each call
  let jwksInstance: ReturnType<typeof createRemoteJWKSet> | null = null;

  function getJWKS() {
    if (!jwksInstance) {
      jwksInstance =  createRemoteJWKSet(new URL(getOceanopsAuthServiceUrl()+'/.well-known/jwks.json'));
    }

    return jwksInstance;
  }

// We could just decode token without verify it because JWT verification is done on Gateway side for all request.
// But if we want to protect some front end route with user role for example, it is better to already plan a jwt verification here 
export async function verifyJwt(token: string | undefined =""): Promise<JWTVerifyResult['payload'] | null> {

  try {
    const safeToken = `${token ?? ''}`.trim() || 'invalid.token.value';
    
    
    const { payload } = await jwtVerify(safeToken, getJWKS(), {
      algorithms: ['RS256'],
    });
    return payload;
  } catch  {
    return null   
  }
}