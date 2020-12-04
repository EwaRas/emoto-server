import { Injectable } from '@nestjs/common';
import { FluctuoService } from 'src/apiServices/fluctuo.service';
import { MapboxService } from 'src/apiServices/mapbox.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MapService {
  constructor(
    private readonly userService: UserService,
    private readonly fluctuoService: FluctuoService,
    private readonly mapboxService: MapboxService,
  ) {}

  private addTravelTimeToMotos(motos, travelTimesArr, travelType) {
    const motosWithAddedTime = motos.map((moto, index) => {
      if (index <= travelTimesArr.length - 1) {
        return { ...moto, [travelType]: travelTimesArr[index] };
      } else {
        return { ...moto, [travelType]: null };
      }
    });

    if (travelType === 'driveTime') {
      return motosWithAddedTime.map((moto) => {
        if (moto.driveTime) {
          return { ...moto, totalTravelTime: moto.walkTime + moto.driveTime };
        } else {
          return { ...moto, totalTravelTime: null };
        }
      });
    } else {
      return motosWithAddedTime;
    }
  }

  private async getMotosNearUser(userCoordinates: {
    latitude: number;
    longitude: number;
  }) {
    try {
      const response = await this.fluctuoService
        .getMotosNearUser(userCoordinates)
        .toPromise();
      const { vehicles } = await response.data;
      return vehicles;
    } catch (error) {
      (error) => console.log('error getting motos from fluctuo', error);
    }
  }

  async getMotosSortedByTime(address: string, username: string) {
    // get current location
    const userCoordinates = await this.userService.getUserLocation(username);
    // get bikes from Fluctuo
    const motosNearUser = await this.getMotosNearUser(userCoordinates);
    // get walking times from user location
    const walkingTimes = await this.mapboxService.getWalkingTimes(
      userCoordinates,
      motosNearUser,
    );
    // add walking time to each moto
    const motosWithWalkTimes = this.addTravelTimeToMotos(
      motosNearUser,
      walkingTimes,
      'walkTime',
    );
    // sort motos by ascending walkTime
    const sortedMotosByWalkTime = motosWithWalkTimes.sort(function (
      motoA,
      motoB,
    ) {
      return motoA.walkTime - motoB.walkTime;
    });

    // get coordinates of the end destination and stringify them
    const [
      destinationLongitude,
      destinationLatitude,
    ] = await this.mapboxService.getCoordinates(address);
    const destinationCoordinatesToString = `${destinationLongitude},${destinationLatitude};`;

    // get driving times from 10 closer motos to end destination
    const drivingTimes = await this.mapboxService.getDrivingTime(
      sortedMotosByWalkTime,
      destinationCoordinatesToString,
    );
    // add driving time and total time to each moto
    const motosWithDrivingAndTotalTimes = this.addTravelTimeToMotos(
      sortedMotosByWalkTime,
      drivingTimes,
      'driveTime',
    );

    // sort motos by ascending TotalTravelTime
    const sortedMotosByTotalTravelTime = motosWithDrivingAndTotalTimes.sort(
      function (motoA, motoB) {
        if (motoA.totalTravelTime !== null && motoB.totalTravelTime !== null)
          return motoA.totalTravelTime - motoB.totalTravelTime;
      },
    );

    // change property lng and lat to match with frontend requirements
    return sortedMotosByTotalTravelTime.map((moto) => {
      const motoWithTheRightPopertyNames = {
        id: moto.id,
        publicId: moto.publicId,
        type: moto.type,
        latitude: moto.lat,
        longitude: moto.lng,
        provider: moto.provider,
        battery: moto.battery,
        walkTime: moto.walkTime,
        driveTime: moto.driveTime,
        totalTravelTime: moto.totalTravelTime,
      };
      return motoWithTheRightPopertyNames;
    });
  }
}
