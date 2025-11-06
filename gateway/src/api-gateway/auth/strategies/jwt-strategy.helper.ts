import * as jwksRsa from 'jwks-rsa';
import { ConfigService } from "@nestjs/config";
import { ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { createProxyRouteMap } from "../../../utils/proxy.routes"
import { Request } from 'express';
import { JwtPayload } from '../../../types/types';
import { JwtUser } from '../../../types/jwt-user';

export function createJwtStrategyOptions(
    configService: ConfigService,
    jwtFromRequest: (req: any) => string | null
): StrategyOptionsWithoutRequest  {
    const proxyRoutes = createProxyRouteMap(configService);
    const route = proxyRoutes['api/oceanops'];
    const jwksEndpoint = `${route.protocol}://${route.host}${route.targetPath}/auth/.well-known/jwks.json`;
    
    return {
        jwtFromRequest:jwtFromRequest,
        ignoreExpiration: false,
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: jwksEndpoint,
        }),
        algorithms: ['RS256'],
    }  as StrategyOptionsWithoutRequest ;
}


/**
 * 
 * @param req Extract the JWT from the incomming request. First look at Authorization header (Bearer ....).
 * If Bearer null, extract the session cookie.
 * @returns 
 */
export function extractTokenFromHttpRequest(req: Request): string | null {
    // 1. Try Authorization header
    const JWTFromAuthHeaderFunction = ExtractJwt.fromAuthHeaderAsBearerToken();
    const tokenFromHeader = JWTFromAuthHeaderFunction(req);
    if (tokenFromHeader) {
        return tokenFromHeader;
    }  
  
    // 2. Try Cookie header
    const cookies = req.cookies;
    if (cookies && cookies['session']) {
        return cookies['session'] as string;
    } 
  
    return null;
  }


  export function validateJwt (payload: JwtPayload) : JwtUser {
     // May also put some logic here to retrieve more information on user, verify if the userId match a user in the database, look in a potential table of revoken token, etc.
        // ex :  authService.getUserDetails, etc.
        return { userId: payload.contactId, username: payload.sub, name: payload.name, roles:payload.roles };
  }