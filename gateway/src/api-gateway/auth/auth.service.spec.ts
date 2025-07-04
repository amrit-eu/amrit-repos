import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { mockConfigService } from 'test/config-service.mock';

describe('AuthService', () => {
  let service: AuthService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [AuthService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
