import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Namespace} from 'socket.io'
import { WsJwtAuthGuard } from "src/api-gateway/auth/guards/wsjwt-auth.guard";
import { SocketAuthMiddleware } from "src/api-gateway/auth/strategies/ws.middleware";
import { authentifiedSocket } from "src/types/jwt-user";



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
  this.notificationsNamespace.on('connection' , (socket:authentifiedSocket ) => {
    this.logger.log(`Socket connected. id : ${socket.id}, user : ${socket.user.name}`)
  })
  }

  async handleConnection(@ConnectedSocket() client: authentifiedSocket) {    
    try {
      // put the user in a specific room:
      await client.join(`user:${client.user.userId}`)

    } catch {
      this.logger.warn("failed to put websocket client in a room linked to user's id")
      client.disconnect(true);
     
    }
  }

  // sending message for refreshing alerts table on all authenticated
  broadcastAlertsRefresh() {
    this.notificationsNamespace.emit('alerts:refresh');
  }

  // +1 notifications for a specified user (based on his subscriptions )
  pushUserBadgeIncrement (userId: string, notificationDTO : any) {
    this.notificationsNamespace.to(`user:${userId}`).emit('notifications:new', notificationDTO);
  } 

  
  @SubscribeMessage("newMessage")
  onNewMessage(@MessageBody() body:any, @ConnectedSocket() client: authentifiedSocket) {
    console.log (client.user)
    this.notificationsNamespace.emit('onMessage', {test:"test"} )
  }

}

