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

  private splitArray(motos: Moto[]) {
    const size = 24;
    const splitArr = [];
    for (let i = 0; i < motos.length; i += size) {
      splitArr.push(motos.slice(i, i + size));
    }
    return splitArr;
  }

  private buildCoordinatesString(array) {
    return array.reduce((acc, moto, index) => {
      acc += `${moto.lng},${moto.lat}${index !== array.length - 1 ? ';' : ''}`;
      return acc;
    }, '');
  }

  private buildUrl(motosArr, userCoordinates, mode) {
    if (mode === 'walking') {
      const urlArr = [];
      motosArr.forEach((motoSubArray) => {
        const motosCoordinates = this.buildCoordinatesString(motoSubArray);
        urlArr.push(
          `${this.mapboxURL}/directions-matrix/v1/mapbox/${mode}/${userCoordinates}${motosCoordinates}?sources=0&access_token=${this.token}`,
        );
      });
      return urlArr;
    } else if (mode === 'driving-traffic') {
      const url = `${
        this.mapboxURL
      }/directions-matrix/v1/mapbox/${mode}/${userCoordinates}${this.buildCoordinatesString(
        motosArr,
      )}?sources=0&access_token=${this.token}`;
      return url;
    } else {
      console.log('Mode should be walking or driving-traffic');
    }
  }

  private getFromMapbox(apiUrl) {
    return this.http.get(apiUrl).pipe(
      map((res: AxiosResponse) => {
        return res.data;
      }),
    );
  }

  private formatAddress(address: string): string {
    return address.split(' ').join('%20');
  }

  // main function

  async getWalkingTimes(
    userCoordinates: {
      latitude: number;
      longitude: number;
    },
    motosNearUser: Moto[],
  ) {
    const userCoordinatesToString = `${userCoordinates.longitude},${userCoordinates.latitude};`;
    const nestedMotosArray = this.splitArray(motosNearUser);
    const walkingTimes = [];
    const apiUrls = this.buildUrl(
      nestedMotosArray,
      userCoordinatesToString,
      'walking',
    );
    for (let i = 0; i < apiUrls.length; i++) {
      try {
        const result = await this.getFromMapbox(apiUrls[i]).toPromise();
        walkingTimes.push(...result.durations[0].slice(1));
      } catch (err) {
        console.log('Error getting walking times', err);
      }
    }
    return walkingTimes;
  }

  async getCoordinates(address: string): Promise<[number, number]> {
    const formattedAddress = this.formatAddress(address);
    const apiUrl = `${this.mapboxURL}/geocoding/v5/mapbox.places/${formattedAddress}.json?access_token=${this.token}`;
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
  ) {
    const url = this.buildUrl(
      sortedMotosByWalkTime.slice(0, 9),
      destinationToString,
      'driving-traffic',
    );
    console.log('url', url);

    try {
      const result = await this.getFromMapbox(url).toPromise();
      return result.durations[0].slice(1);
    } catch (err) {
      console.log('Error getting walking times', err);
    }
  }
}

// ? endpoint + moto locations
// 41.389325,2.168926;
// 41.38368,2.14267;
// 41.380649999999996,2.1417666666666664;
// 41.38257,2.142238;
// 41.383878,2.142598;
// 41.383379999999995,2.14243;
// 41.382496,2.142158;
// 41.380916666666664,2.1420283333333336;
// 41.381269,2.141642;
// 41.384102,2.142496
