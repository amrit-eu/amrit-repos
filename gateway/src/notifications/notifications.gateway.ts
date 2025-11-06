import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { WsJwtAuthGuard } from "src/api-gateway/auth/guards/wsjwt-auth.guard";

@UseGuards(WsJwtAuthGuard)
@WebSocketGateway()
export class NotificationsGateway implements OnModuleInit{
  private readonly logger = new Logger(NotificationsGateway.name, { timestamp: true })

  @WebSocketServer()
  server: Server

  onModuleInit() {
    this.server.on('connection' , (socket) => {
      this.logger.log(`Socket connected : ${socket.id}`)
    })
  }

  // sending message for refreshing alerts table on client
   broadcastAlertsRefresh() {
    this.server.emit('alerts:refresh');
  }

  
  @SubscribeMessage("newMessage")
  onNewMessage(@MessageBody() body:any, @ConnectedSocket() client: Socket) {
    console.log(body)
    console.log (client)
    this.server.emit('onMessage', {test:"test"} )
  }

}