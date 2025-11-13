import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Namespace,  Server,  Socket} from 'socket.io'
import { WsJwtAuthGuard } from "src/api-gateway/auth/guards/wsjwt-auth.guard";
import { WsJwtStrategy } from "src/api-gateway/auth/strategies/ws-jwt.strategy";
import * as passport from 'passport';
import { SocketAuthMiddleware } from "src/api-gateway/auth/strategies/ws.middleware";
import { authentifiedSocker } from "src/types/jwt-user";



@UseGuards(WsJwtAuthGuard)
@WebSocketGateway({ path: '/api/notifications', namespace: 'notifications'})
export class NotificationsGateway implements OnModuleInit{
  private readonly logger = new Logger(NotificationsGateway.name, { timestamp: true })

  @WebSocketServer()
  notificationsNamespace: Namespace;

 /**
  * Use a middleware to check the JWT and prevent the connection to websocket gateway if not authentified
  * We also block the connection to default namespace ('/')
  *  @param server 
  */ 
 afterInit(namespace:Namespace) { 
  // use middleware to check auth on connection to socket
  namespace.use(SocketAuthMiddleware()) 

  // prevent connection to default '/' namespace :
  const mainServer = namespace.server; 
  mainServer.of('/').use((socket, next) => {
    this.logger.warn(`Rejected connection to default namespace`);
    next(new Error('Connect to /notifications'));
  });
  
 }

  onModuleInit() { 

  this.notificationsNamespace.on('connection' , (socket) => {
    this.logger.log(`Socket connected : ${socket.id}`)
  })
  }

  // sending message for refreshing alerts table on client
   broadcastAlertsRefresh() {
    this.notificationsNamespace.emit('alerts:refresh');
  }

  
  @SubscribeMessage("newMessage")
  onNewMessage(@MessageBody() body:any, @ConnectedSocket() client: authentifiedSocker) {
    console.log (client.user)
    this.notificationsNamespace.emit('onMessage', {test:"test"} )
  }

}

