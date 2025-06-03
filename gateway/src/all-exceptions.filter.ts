import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

type ResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name, { timestamp: true });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const responseObj: ResponseObj = {
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    // Default error handling
    if (exception instanceof HttpException) {
      responseObj.statusCode = exception.getStatus();
      responseObj.response = exception.getResponse();
    } else {
      responseObj.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseObj.response = 'Internal Server Error';
    }

    // Enhanced log for 401 errors
    if (responseObj.statusCode === HttpStatus.UNAUTHORIZED) {
      this.logger.error(`🚫 401 Unauthorized - Request Details:
Request URL: ${request.method} ${request.originalUrl}
Headers: ${JSON.stringify(request.headers, null, 2)}
Exception: ${JSON.stringify(responseObj.response, null, 2)}
`);
    } else {
      // For other errors
      this.logger.error(`❌ Error ${responseObj.statusCode} on ${request.method} ${request.originalUrl}`);
      this.logger.error(responseObj.response);
    }

    response.status(responseObj.statusCode).json(responseObj);

    // Optional: still call base handler
    super.catch(exception, host);
  }
}
