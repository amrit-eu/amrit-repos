import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {

    constructor(
        private readonly email: AlertEmailChannel,
        private readonly ws: AlertWebsocketChannel,
  ) {}
}
