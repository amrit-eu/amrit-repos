import { Logger, UseGuards } from "@nestjs/common";
import { ConnectedSocket, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Namespace} from 'socket.io'
import { WsJwtAuthGuard } from "src/api-gateway/auth/guards/wsjwt-auth.guard";
import { SocketAuthMiddleware } from "src/api-gateway/auth/strategies/ws.middleware";
import { authentifiedSocket } from "src/types/jwt-user";
import { NotificationDTO } from "src/types/notifications";



@UseGuards(WsJwtAuthGuard)
@WebSocketGateway({ path: '/api/notifications', namespace: 'notifications'})
export class NotificationsGateway implements OnGatewayDisconnect  {
 
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

  async handleConnection(@ConnectedSocket() client: authentifiedSocket) {    
    
    const user = client.user;

    if (!user || !user.userId) {
      this.logger.warn(`Connection rejected: no user data for socket ${client.id}`);
      client.disconnect(true);
      return;
    }    

    try {
      // put the user in a specific room:
      await client.join(`user:${user.userId}`)
      this.logger.log(
        `Socket ${client.id} connected for user ${user.userId} - ${user.name}`
      );
    } catch {
      this.logger.warn("failed to put websocket client in a room linked to user's id")
      client.disconnect(true);     
    }
  }

  handleDisconnect(client: authentifiedSocket) {
    this.logger.log(
        `Socket ${client.id} (user ${client.user.userId} - ${client.user.name}) disconnected`
      );
  }

  // sending message for refreshing alerts table on all authenticated
  broadcastAlertsRefresh() {
    this.notificationsNamespace.emit('alerts:refresh');
  }

  // +1 notifications for a specified user (based on his subscriptions )
  pushUserBadgeIncrement (id: string, notificationDTO : NotificationDTO) {
    this.notificationsNamespace.to(`user:${id}`).emit('notifications:new', notificationDTO);
  } 


}

