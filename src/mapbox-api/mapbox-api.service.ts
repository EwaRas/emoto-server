import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { TestApiService } from 'src/test-api/test-api.service';
import { Moto } from 'src/interfaces/motos.interface';
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
    if (mode === 'walking') {
      const urlArr = [];
      motosArr.forEach((motoSubArray) => {
        const motosCoordinates = this.buildCoordinatesString(motoSubArray);
        urlArr.push(
          `${this.mapboxURL}/directions-matrix/v1/mapbox/${mode}/${coordinates}${motosCoordinates}?sources=0&access_token=${this.token}`,
        );
      });
      return urlArr;
    } else if (mode === 'driving-traffic') {
      const url = `${
        this.mapboxURL
      }/directions-matrix/v1/mapbox/${mode}/${coordinates}${this.buildCoordinatesString(
        motosArr,
      )}?sources=0&access_token=${this.token}`;
      return url;
    } else {
      console.log('Mode should be walking or driving');
    }
  }
  //https://api.mapbox.com/directions-matrix/v1/mapbox/driving/
  //41.59779,2.17;
  //42.388735,2.16703;
  //41.988684,2.167143;
  //40.389109,2.166434;
  //41.387859999999996,3.16811;
  //41.388074,2.167574;
  //41.387724,2.169813;
  //41.388361,1.166694;
  //41.386284,2.170518;
  //41.387406,2.168359
  //?sources=0&access_token=pk.eyJ1IjoiZXdhcmFzIiwiYSI6ImNraTYxeDZnejA2ZzQycWxoM3d6cW5lbmoifQ.kivP2MxHDkgpKk2Wa-jQFg

  //https://api.mapbox.com/directions-matrix/v1/mapbox/driving-traffic/
  //41.395138,2.197638;
  //41.388735,2.16703;
  //41.388684,2.167143;
  //41.389109,2.166434;
  //41.387859999999996,2.16811;
  //41.388074,2.167574;
  //41.387724,2.169813;
  //41.388361,2.166694;
  //41.386284,2.170518;
  //41.387406,2.168359
  //?sources=0&access_token=pk.eyJ1IjoiZXdhcmFzIiwiYSI6ImNraTYxeDZnejA2ZzQycWxoM3d6cW5lbmoifQ.kivP2MxHDkgpKk2Wa-jQFg

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

  private addTravelTimeToMotos(motos, walkingTimesArr) {
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
    const motosWithWalkTimes = this.addTravelTimeToMotos(
      motos,
      walkingTimesArr,
    );
    this.sortedMotos = motosWithWalkTimes.sort(function (a, b) {
      return a.walkTime - b.walkTime;
    });
    return this.sortedMotos;
  }
  private buildCoordinatesString(array) {
    return array.reduce((acc, moto, index) => {
      acc += `${moto.lat},${moto.lng}${index !== array.length - 1 ? ';' : ''}`;
      return acc;
    }, '');
  }
  async getAllMotosWithRec(address: string) {
    const destinationCoordinates = await this.getCoordinates(address)
      .toPromise()
      .then((res) => {
        return res.features[0].geometry.coordinates;
      })
      .catch((error) => {
        console.log('controller errrrrrror', error);
      });
    const destinationToString = `${destinationCoordinates[1]},${destinationCoordinates[0]};`;
    console.log('destCoord', destinationCoordinates);
    const url = this.buildUrl(
      this.sortedMotos.slice(0, 9),
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
