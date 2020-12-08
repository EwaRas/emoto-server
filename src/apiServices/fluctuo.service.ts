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

  getMotosNearUser(userCoordinates: {
    latitude: number;
    longitude: number;
  }): Observable<any> {
    const query = {
      query: `query ($vehicleTypes: [VehicleType], $lat: Float!, $lng: Float!) {
        vehicles (vehicleTypes: $vehicleTypes, lat: $lat, lng: $lng) {
          id
          publicId
          type
          lat
          lng
          provider {
            name
            app {
              android
              ios
            }
          }
          battery
        }
      }`,
      variables: {
        vehicleTypes: 'MOTORSCOOTER',
        lat: userCoordinates.latitude,
        lng: userCoordinates.longitude,
      },
    };
    return this.https
      .post(`https://flow-api.fluctuo.com/v1?access_token=${this.token}`, query)
      .pipe(
        map((axiosRes: AxiosResponse) => {
          return axiosRes.data;
        }),
      );
  }
}
