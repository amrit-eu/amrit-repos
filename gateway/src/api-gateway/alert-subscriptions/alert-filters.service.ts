import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AlertFiltersService {
  constructor(private readonly httpService: HttpService) {}

  async fetchCountries(): Promise<any> {
    const apiUrl = 'https://www.ocean-ops.org/api/1/data/country';
    const include = encodeURIComponent(JSON.stringify(['code2', 'id', 'name']));
    const exp = encodeURIComponent(JSON.stringify(['active = 1 and wmoMember=1']));
    const url = `${apiUrl}?include=${include}&exp=${exp}`;

    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }
}
