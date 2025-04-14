import { AUTHSERVICE_API_BASE_URL } from '@/config/api-routes';
import { createRemoteJWKSet, jwtVerify, JWTVerifyResult } from 'jose';

const JWKS = createRemoteJWKSet(new URL(AUTHSERVICE_API_BASE_URL+'/.well-known/jwks.json'));

// We could just decode token without verify it because JWT verification is done on Gateway side for all request.
// But if we want to protect some front end route with user role for example, it is better to already plan a jwt verification here 
export async function verifyJwt(token: string | undefined =""): Promise<JWTVerifyResult['payload'] | null> {
  try {
    const safeToken = `${token ?? ''}`.trim() || 'invalid.token.value';
    
    
    const { payload } = await jwtVerify(safeToken, JWKS, {
      algorithms: ['RS256'],
    });
    return payload;
  } catch  {
    throw new Error('Token verification failed');
    
  }
}