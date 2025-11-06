import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { IS_PUBLIC_KEY } from "../public.decorator";

@Injectable()
export class WsJwtAuthGuard extends AuthGuard ('wsJwtStrategy'){
    constructor(private reflector: Reflector) {
        super();
      }
    
      canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
          IS_PUBLIC_KEY,
          [context.getHandler(), context.getClass()]
        );
    
        if (isPublic) return true;
    
        return super.canActivate(context);
      }

    // Need to override getRequest to return websocket client
    getRequest(context: ExecutionContext) : Socket {
        
       const client = context.switchToWs().getClient<Socket>();
    
        if (!client || !client.handshake) {
            throw new WsException('Invalid WebSocket client');
        }
    
        return client;
    }
 }