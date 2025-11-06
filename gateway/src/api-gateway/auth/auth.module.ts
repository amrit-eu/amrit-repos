import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { WsJwtStrategy } from './strategies/wsjwt.strategy';
import { HttpJwtStrategy } from './strategies/httpjwt.strategy';


@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, HttpJwtStrategy,WsJwtStrategy ]
})
export class AuthModule {}
