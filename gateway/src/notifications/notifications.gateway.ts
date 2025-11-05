import { WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'], credentials: true },
  path: '/ws/notifications',
})
export class NotificationsGateway {

}