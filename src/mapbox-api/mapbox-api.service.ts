import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { TestApiService } from 'src/test-api/test-api.service';
import { Moto } from 'src/interfaces/motos.interface';
import { url } from 'inspector';
import { user } from 'src/db';

@Injectable()
export class MapboxApiService {
  constructor(
    private http: HttpService,
    private configService: ConfigService,
    private testApiService: TestApiService,
  ) {}
  private formatAddress(address: string): string {
    return address.split(' ').join('%20');
  }
  private mapboxURL = 'https://api.mapbox.com';
  private token = this.configService.get('MAPBOX_TOKEN');
  private sortedMotos = [];

  getCoordinates(address: string): Observable<any> {
    const formattedAddress = this.formatAddress(address);
    const apiUrl = `${this.mapboxURL}/geocoding/v5/mapbox.places/${formattedAddress}.json?access_token=${this.token}`;
    return this.http.get(apiUrl).pipe(
      map((res: AxiosResponse) => {
        return res.data;
      }),
    );
  }
  private splitArray(motos: Moto[]) {
    const size = 24;
    const splitArr = [];
    for (let i = 0; i < motos.length; i += size) {
      splitArr.push(motos.slice(i, i + size));
    }
    return splitArr;
  }
  private buildUrl(motosArr, coordinates, mode) {
    const urlArr = [];
    motosArr.forEach((motoSubArray) => {
      const motosCoordinates = motoSubArray.reduce((acc, moto, index) => {
        acc += `${moto.lat},${moto.lng}${
          index !== motoSubArray.length - 1 ? ';' : ''
        }`;
        return acc;
      }, '');

      urlArr.push(
        `${this.mapboxURL}/directions-matrix/v1/mapbox/${mode}/${coordinates}${motosCoordinates}?sources=0&access_token=${this.token}`,
      );
    });
    return urlArr;
  }

  private getFromMapbox(apiUrl) {
    return this.http.get(apiUrl).pipe(
      map((res: AxiosResponse) => {
        return res.data;
      }),
    );
  }
  private async getWalkingTimes(motosSplitArr, userCoordinates) {
    const walkingTimes = [];
    const urls = this.buildUrl(motosSplitArr, userCoordinates, 'walking');
    for (let i = 0; i < urls.length; i++) {
      try {
        const result = await this.getFromMapbox(urls[i]).toPromise();
        walkingTimes.push(...result.durations[0].slice(1));
      } catch (err) {
        console.log('Error getting walking times', err);
      }
    }
    return walkingTimes;
  }

  private addWalkingToMotos(motos, walkingTimesArr) {
    return motos.map((moto, index) => {
      return { ...moto, walkTime: walkingTimesArr[index] };
    });
  }

  async getWalkingDistance() {
    const user = this.testApiService.getUserWithFavourites();
    const userCoordinates = `${user.lat},${user.lng};`;
    const motos = this.testApiService.getAllMotos();
    const motosSplitArr = this.splitArray(motos);
    const walkingTimesArr = await this.getWalkingTimes(
      motosSplitArr,
      userCoordinates,
    );
    const motosWithWalkTimes = this.addWalkingToMotos(motos, walkingTimesArr);
    this.sortedMotos = motosWithWalkTimes.sort(function (a, b) {
      return a.walkTime - b.walkTime;
    });
    return this.sortedMotos;
  }

  async getAllMotosWithRec(address: string) {
    const destinationCoordinates = this.getCoordinates(address)
      .toPromise()
      .then((res) => {
        return res.features[0].geometry.coordinates;
      })
      .catch((error) => {
        console.log('controller errrrrrror', error);
      });
    const url = this.buildUrl(
      this.sortedMotos.slice(0, 3),
      destinationCoordinates,
      'driving',
    );
    return url;
  }
}
