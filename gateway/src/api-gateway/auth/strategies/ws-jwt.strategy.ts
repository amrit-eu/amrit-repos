import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { JwtUser } from "../../../types/jwt-user";
import { JwtPayload } from "../../../types/types";
import { Request } from 'express';
import { createJwtStrategyOptions, extractTokenFromHttpRequest, validateJwt } from "./jwt-strategy.helper";
import { Socket } from "socket.io";


@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsJwtStrategy') {
    
    constructor( private readonly configService: ConfigService) {
        super(createJwtStrategyOptions(configService, extractTokenFromWsHandshake))
       
    }

     validate(payload: JwtPayload) : JwtUser {
           return validateJwt(payload)
        }

}

/**
 * Extraact the JWT from the Hanshak comming from websocket client. cookies are in headers and must be parse to be retourned as an object.
 * We create a fake Request object from which the jwt will be extracted
 * 
 * 
 * @param req (Handshake)
 * @returns 
 */
export function extractTokenFromWsHandshake (req: Socket)  {   
    // WebSocket: req.handshake already has headers and cookies in headers.cookie
    // So we just need to normalize it to look like an HTTP Request
    const normalizedRequest: Partial<Request> = {
        headers: req.handshake.headers, // Already contains 'authorization' and 'cookie'
        cookies: parseCookiesFromHeader(req.handshake.headers.cookie),
    };
    return extractTokenFromHttpRequest(normalizedRequest as Request);
   
}

/**
 * Parse cookie string into an object (needed because handshake has raw cookie string)
 */
function parseCookiesFromHeader(cookieHeader?: string): { [key: string]: string } {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
            cookies[name] = value;
        }
        return cookies;
    }, {} as { [key: string]: string });
}
