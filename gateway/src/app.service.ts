import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'THis is AMRIT API GATEWAY!';
  }
}
