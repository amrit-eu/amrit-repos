import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Request} from 'express';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import { cleanProxyHeaders } from '../utils/proxy.utils';


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
        const config: AxiosRequestConfig = this.buildAxiosRequestConfigFromSourceRequest(req, ALERTA_HOST, ALERTA_READ_API_KEY);
        
        // make request to Alerta api
        const {data}=  await firstValueFrom(
            this.httpService.request<unknown>(config).pipe(
                catchError((error : AxiosError) => {
                    const status = error.response?.status || 500;
                    const message = error.response?.data || { message: 'Unexpected error' };
                    throw new HttpException(message, status);
                })
            )
        );     
        
        return data;
    }   


    /**
     * Builds an AxiosRequestConfig from the incoming HTTP request.
     * 
     * @param req - Incoming Express/NestJS request object.
     * @param HOST - target Host
     * @param READ_API_KEY - API key to include in Authorization header
     * @returns AxiosRequestConfig
     */
    private buildAxiosRequestConfigFromSourceRequest(req: Request, HOST: string, API_KEY: string) {
        const method = req.method.toLowerCase();
        const params = req.query;
        const headers = { ...cleanProxyHeaders(req.headers), host: HOST, Authorization: `Key ${API_KEY}` }; // change host and add alerta API key
        const data = req.body as Record<string, any>

        // build url to forward to :
        const baseProxyPath = '/api/alerta';
        const url = `https://${HOST}/api` + req.url.replace(baseProxyPath, '');        

        // configure the axios request from the source request & api's url
        const config: AxiosRequestConfig = {
            method,
            url,
            headers,
            params,
            data
        };

        return config;
    }
}
