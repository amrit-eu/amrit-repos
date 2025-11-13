import * as passport from 'passport';
import {Socket} from 'socket.io'
import { authentifiedSocker, JwtUser } from 'src/types/jwt-user';

export type SocketIOMiddleWare = {
 (client: Socket, next:(err?:Error) => void);
}

export const SocketAuthMiddleware = (): SocketIOMiddleWare =>  {

    return (client: Socket, next) => {
        
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        passport.authenticate('wsJwtStrategy',{session: false}, function(err : Error, user: JwtUser, info : string) {
                if (err) {
                  console.log(err)
                  return next(err)
                }
                if (!user) {   
                    console.log('WS auth failed', info);
                    return next(new Error('Unauthorized'));
                }               
                console.log (user)       
               
                return next();
            
            })(client, (client as authentifiedSocker).user, next);
        
    }

}