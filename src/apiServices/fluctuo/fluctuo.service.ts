import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FluctuoService {
  // query Fluctuo to get all motos
  constructor(
    private https: HttpService,
    private configService: ConfigService,
  ) {}

  private token = this.configService.get('FLUCTUO_TOKEN');

  getMotosNearUser(userCoordinates): Observable<any> {
    return this.https
      .post(
        `https://flow-api.fluctuo.com/v1?access_token=${this.token}`,
        userCoordinates,
      )
      .pipe(
        map((axiosRes: AxiosResponse) => {
          // console.log('axiosRes.data in service', axiosRes.data);
          return axiosRes.data;
        }),
      );
  }
}
