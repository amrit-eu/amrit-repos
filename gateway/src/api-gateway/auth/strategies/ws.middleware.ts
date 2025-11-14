import * as passport from 'passport';
import {Socket} from 'socket.io'
import { authentifiedSocket, JwtUser } from 'src/types/jwt-user';

export type SocketIOMiddleWare = {
 (client: Socket, next:(err?:Error) => void);
}

export const SocketAuthMiddleware = (): SocketIOMiddleWare =>  {

    return (client: Socket, next) => {
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        passport.authenticate('wsJwtStrategy',{session: false}, function(err : Error, user: JwtUser) {
                if (err) {
                  return next(err)
                }
                if (!user) {   
                    return next(new Error('Unauthorized'));
                } 
                return next();
            
            })(client, (client as authentifiedSocket).user, next);
        
    }

}