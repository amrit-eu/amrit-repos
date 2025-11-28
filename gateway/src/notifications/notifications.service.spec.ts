import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { AlertEmailChannel } from './channels/alert-email.channel';
import { AlertWebsocketChannel } from './channels/alert-websocket.channel';


describe('NotificationsService', () => {
  let service: NotificationsService;

  const alertEmailChannelMock = {
    // adjust method names to match the real class, if needed
    sendNotification: jest.fn(),
  };

  const alertWebsocketChannelMock = {
    // adjust method names to match the real class
    sendNotification: jest.fn(),
    broadcastNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: AlertEmailChannel, useValue: alertEmailChannelMock },
        { provide: AlertWebsocketChannel, useValue: alertWebsocketChannelMock },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
