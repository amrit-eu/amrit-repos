import {  Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request} from 'express';
import {  AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { buildAxiosRequestConfigFromSourceRequest, proxyHttpRequest } from '../utils/proxy.utils';


@Injectable()
export class ApiGatewayService {

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,    
    ) {}

    /**
     * For '/api/alert' endpoint, proxies incomming HTTP request to Alerta API.
     * Method is dynamic : rewrites request headers and path, forwards request body for POST/PUT/PATCH, and injects Alerta-specific headers (Host and API Key).
     * TO DO ? : This method could even be more generic by handling differents APIs bu parsing the path ('/api/{api-name}') and redirect to the right url. For now keeping one controller and service by API, in case there is specific logic to add.
     * 
     * @param req Incoming Express/NestJS request object.
     * @returns Data from Alerta API response.
     * @throws HttpException if Alerta API call fails.
     */
    async alertaProxyRequest(req: Request) : Promise<any>
     {  
        // get env variables for Alerta API :
        const ALERTA_HOST = this.configService.getOrThrow<string>('ALERTA_HOST');
        const ALERTA_READ_API_KEY = this.configService.getOrThrow<string>('ALERTA_READ_API_KEY');

        //build axiosRequestConfig with source request parameters :
        const config: AxiosRequestConfig = buildAxiosRequestConfigFromSourceRequest(req, ALERTA_HOST, 'api/alerta');
        // add Alerta API KEY to headers :
        config.headers={...config.headers, Authorization: `Key ${ALERTA_READ_API_KEY}` }

        // make request to Alerta api
        const data = proxyHttpRequest<unknown>(this.httpService, config);

        // here can add some logic if needed (ex : change Alert model with a mapper)
        
        return data;
    }   
}
