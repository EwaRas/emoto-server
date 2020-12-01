import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MapboxApiService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}
  private formatAddress(address: string): string {
    return address.split(' ').join('%20');
  }
  private mapboxURL = 'https://api.mapbox.com';

  getCoordinates(address: string): Observable<any> {
    const formattedAddress = this.formatAddress(address);
    const token = this.configService.get('MAPBOX_TOKEN');
    const apiUrl = `${this.mapboxURL}/geocoding/v5/mapbox.places/${formattedAddress}.json?access_token=${token}`;
    return this.http.get(apiUrl).pipe(
      map((res: AxiosResponse) => {
        return res.data;
      }),
    );
  }

  getWalkingDistance() {
    //https://api.mapbox.com/directions-matrix/v1/mapbox/walking/
    //-122.418563,37.751659;-122.422969,37.75529;-122.426904,37.759617?sources=2&annotations=distance,duration&access_token=pk.eyJ1IjoiZXdhcmFzIiwiYSI6ImNraTBieTZ5cDJ5bHgycGt6ZGZseHJmOGoifQ.A11Krp8PQOVMA2MviGvhiA
    const apiUrl = `${this.mapboxURL}/geocoding/v5/mapbox.places/${formattedAddress}.json?access_token=${token}`;
  }
}
