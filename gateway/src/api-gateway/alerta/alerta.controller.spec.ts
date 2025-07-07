import { Test, TestingModule } from '@nestjs/testing';
import { AlertaController } from './alerta.controller';
import { AlertaService } from './alerta.service';
import {Request} from 'express';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from '../../../test/config-service.mock';

describe('AlertaController', () => {
  let alertaController: AlertaController;
  let alertaService: AlertaService


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,        
      ],
      controllers: [AlertaController],
      providers: [AlertaService, { provide: ConfigService, useValue: mockConfigService }]
    }).compile();

    alertaController = module.get<AlertaController>(AlertaController);
    alertaService = module.get<AlertaService>(AlertaService);
  });

  it('should be defined', () => {
    expect(alertaController).toBeDefined();
  });

  it('should call alertaService.alertaProxyRequest with request object', async () => {
    const mockReq = { method: 'GET', url: '/test' } as Request;
    const expectedResponse = { message: 'OK' };

    jest.spyOn(alertaService, 'alertaProxyRequest').mockResolvedValue(expectedResponse);;    

    expect(await alertaController.alertaProxy(mockReq)).toBe(expectedResponse);

  })


});
