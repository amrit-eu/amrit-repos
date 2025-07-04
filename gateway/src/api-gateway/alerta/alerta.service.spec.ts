import { Test, TestingModule } from '@nestjs/testing';
import { AlertaService } from './alerta.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from 'test/config-service.mock';

describe('AlertaService', () => {
  let service: AlertaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AlertaService, { provide: ConfigService, useValue: mockConfigService }],
      
    }).compile();

    service = module.get<AlertaService>(AlertaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
