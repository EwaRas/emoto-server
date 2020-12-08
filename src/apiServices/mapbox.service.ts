import { HttpService, Injectable } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class MapboxService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
  ) {}

  private mapboxURL = 'https://api.mapbox.com';
  private token = this.configService.get('MAPBOX_TOKEN');

  private splitArray(motos: Moto[], size: number) {
    const splitArr = [];
    for (let i = 0; i < motos.length; i += size) {
      splitArr.push(motos.slice(i, i + size));
    }
    return splitArr;
  }

  private buildCoordinatesString(array): string {
    return array.reduce((acc, moto, index) => {
      if (moto.lng && moto.lat) {
        acc += `${moto.lng},${moto.lat}${
          index !== array.length - 1 ? ';' : ''
        }`;
      } else if (moto.longitude && moto.latitude) {
        acc += `${moto.longitude},${moto.latitude}${
          index !== array.length - 1 ? ';' : ''
        }`;
      }
      return acc;
    }, '');
  }

  private buildUrl(motosArr, userCoordinates, travelMode, dataMode) {
    if (travelMode === 'walking' || travelMode === 'driving-traffic') {
      const urlArr = [];
      motosArr.forEach((motoSubArray) => {
        const motosCoordinates = this.buildCoordinatesString(motoSubArray);
        urlArr.push(
          `${this.mapboxURL}/directions-matrix/v1/mapbox/${travelMode}/${userCoordinates}${motosCoordinates}?sources=0&annotations=${dataMode}&access_token=${this.token}`,
        );
      });
      return urlArr;
    } else {
      console.log('Mode should be walking or driving-traffic');
    }
  }

  private getFromMapbox(apiUrl): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map((res: AxiosResponse) => {
        return res.data;
      }),
    );
  }

  async getWalkingData(
    userCoordinates: {
      latitude: number;
      longitude: number;
    },
    motosNearUser: Moto[],
    dataMode: string,
  ): Promise<number[]> {
    const userCoordinatesToString = `${userCoordinates.longitude},${userCoordinates.latitude};`;
    const nestedMotosArray = this.splitArray(motosNearUser, 24);
    const walkingData = [];
    const apiUrls = this.buildUrl(
      nestedMotosArray,
      userCoordinatesToString,
      'walking',
      dataMode,
    );
    for (let i = 0; i < apiUrls.length; i++) {
      try {
        const result = await this.getFromMapbox(apiUrls[i]).toPromise();
        if (dataMode === 'duration') {
          walkingData.push(...result.durations[0].slice(1));
        } else if (dataMode === 'distance') {
          walkingData.push(...result.distances[0].slice(1));
        }
      } catch (err) {
        console.log('Error getting walking data', err);
      }
    }
    return walkingData;
  }

  async getCoordinates(address: string): Promise<number[]> {
    const apiUrl = `${this.mapboxURL}/geocoding/v5/mapbox.places/${address}.json?access_token=${this.token}`;
    try {
      const destinationCoordinatesPromise = await this.getFromMapbox(
        apiUrl,
      ).toPromise();
      return await destinationCoordinatesPromise.features[0].geometry
        .coordinates;
    } catch (error) {
      console.log('error getting destination coordinates', error);
    }
  }

  async getDrivingTime(
    sortedMotosByWalkTime: Moto[],
    destinationToString: string,
    dataMode: string,
  ): Promise<number[]> {
    const nestedMotosArray = this.splitArray(sortedMotosByWalkTime, 9);
    const drivingData = [];
    const apiUrls = this.buildUrl(
      nestedMotosArray,
      destinationToString,
      'driving-traffic',
      dataMode,
    );

    try {
      for (let i = 0; i < apiUrls.length; i++) {
        try {
          const result = await this.getFromMapbox(apiUrls[i]).toPromise();
          drivingData.push(...result.durations[0].slice(1));
        } catch (err) {
          console.log('Error getting driving data', err);
        }
      }
      return drivingData;
    } catch (err) {
      console.log('Error getting driving times', err);
    }
  }
}
