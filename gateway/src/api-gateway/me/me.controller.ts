import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AxiosResponse } from 'axios';
import { MeService } from './me.service';
import { HttpJwtAuthGuard } from '../auth/guards/httpjwt-auth.guard';
import type { JwtUser } from 'src/types/jwt-user';

interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

function getNumericUserId(req: AuthenticatedRequest): number {
  const userIdStr = req.user?.userId;

  const userId = userIdStr !== undefined ? Number(userIdStr) : NaN;

  if (!Number.isFinite(userId)) {
    throw new HttpException({ error: 'Missing or invalid userId' }, 401);
  }

  return userId;
}

@Controller('oceanops/auth')
@UseGuards(HttpJwtAuthGuard)
export class MeController {
  private readonly logger = new Logger(MeController.name, { timestamp: true });

  constructor(private readonly meService: MeService) {}

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest): Promise<unknown> {
    const userId = getNumericUserId(req);
    return this.meService.proxyGetMe(req, userId);
  }

  @Patch('me')
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() body: Record<string, unknown>,
  ): Promise<unknown> {
    const userId = getNumericUserId(req);
    this.logger.log(req.user);
    return this.meService.proxyPatchMe(req, body, userId);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() body: { currentPassword: string; newPassword: string },
  ): Promise<unknown> {
    const userId = getNumericUserId(req);

    try {
      const upstream: AxiosResponse<unknown> =
        await this.meService.proxyPostChangePassword(req, body, userId);

      // forward upstream JSON/body unchanged
      return upstream.data;
    } catch (e: unknown) {
      const err = e as { response?: AxiosResponse<unknown>; message?: string };
      const status = err.response?.status ?? 500;
      const payload =
        err.response?.data ?? { message: err.message || 'Proxy error' };

      throw new HttpException(payload, status);
    }
  }
}
