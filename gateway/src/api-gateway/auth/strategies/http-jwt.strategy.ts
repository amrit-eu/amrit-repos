import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { JwtPayload } from "../../../types/types";
import { ConfigService } from "@nestjs/config";

import { JwtUser } from "src/types/jwt-user";
import { createJwtStrategyOptions, extractTokenFromHttpRequest, validateJwt } from "./jwt-strategy.helper";



@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy, 'httpJwtStrategy') {
    
    constructor( private readonly configService: ConfigService) {
        super(createJwtStrategyOptions(configService, extractTokenFromHttpRequest))
       
    }

    validate(payload: JwtPayload) : JwtUser {
       return validateJwt(payload)
    }

}






