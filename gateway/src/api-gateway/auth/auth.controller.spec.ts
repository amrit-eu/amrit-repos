import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { mockConfigService } from 'test/config-service.mock';

describe('AuthController', () => {
  let controller: AuthController;

 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
              HttpModule,        
            ],
      
      controllers: [AuthController],
      providers: [AuthService, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
