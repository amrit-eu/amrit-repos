import { All, Controller, Req } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { Request } from 'express';


@Controller('api')
export class ApiGatewayController {
    constructor(private readonly apiGatewayService: ApiGatewayService) {}

    @All('alerta/*')
    alertaProxy(@Req() req: Request) {
        return this.apiGatewayService.alertaProxyRequest(req);
    }
}
