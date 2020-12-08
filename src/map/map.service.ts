import { Injectable } from '@nestjs/common';
import { FluctuoService } from 'src/apiServices/fluctuo.service';
import { MapboxService } from 'src/apiServices/mapbox.service';
import { CurrentTripsService } from 'src/current-trips/current-trips.service';
import { Moto } from 'src/interfaces/motos.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MapService {
  constructor(
    private readonly userService: UserService,
    private readonly fluctuoService: FluctuoService,
    private readonly mapboxService: MapboxService,
    private readonly currentTripService: CurrentTripsService,
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
  }): Promise<any> {
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

  async getMotosSortedByTime(
    address: string,
    username: string,
  ): Promise<{
    destinationCoordinates: {
      destinationLatitude: number;
      destinationLongitude: number;
    };
    motos: Moto[];
  }> {
    // get current location
    const userCoordinates = await this.userService.getUserLocation(username);

    // check if there are current trips
    const currentTrips = await this.currentTripService.getAllTrips();
    const incomingMotos: Moto[] = [];
    if (currentTrips.length) {
      // if so, get distance from user location
      const currentTripMotos: Moto[] = currentTrips.map((trip) => trip.moto);
      const walkingDistance = await this.mapboxService.getWalkingData(
        userCoordinates,
        currentTripMotos,
        'distance',
      );
      // check if incoming moto is within userLocation area
      const userLocationArea = 500000;

      walkingDistance.forEach((distance, index) => {
        if (distance <= userLocationArea) {
          incomingMotos.push(currentTripMotos[index]);
        }
      });
    }

    // get bikes from Fluctuo
    const motosNearUser = await this.getMotosNearUser(userCoordinates);
    // get walking times from user location
    const walkingTimes = await this.mapboxService.getWalkingData(
      userCoordinates,
      motosNearUser,
      'duration',
    );
    // add walking time to each moto
    const motosWithWalkTimes = this.addTravelTimeToMotos(
      motosNearUser,
      walkingTimes,
      'walkTime',
    );
    // get coordinates of the end destination and stringify them
    const [
      destinationLongitude,
      destinationLatitude,
    ] = await this.mapboxService.getCoordinates(address);
    const destinationCoordinatesToString = `${destinationLongitude},${destinationLatitude};`;

    // get driving time for all motos to end destination
    const drivingTimes = await this.mapboxService.getDrivingTime(
      motosWithWalkTimes,
      destinationCoordinatesToString,
      'duration',
    );
    // add driving time and total time to each moto
    const motosWithDrivingAndTotalTimes = this.addTravelTimeToMotos(
      motosWithWalkTimes,
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
    const sortedMotosByTotalTravelTimeAndRightProperties = sortedMotosByTotalTravelTime.map(
      (moto) => {
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
      },
    );
    // check if there are incoming motos and add them to the available motos
    if (incomingMotos.length) {
      incomingMotos.forEach((moto) => {
        sortedMotosByTotalTravelTimeAndRightProperties.push(moto);
      });
    }
    return {
      destinationCoordinates: {
        destinationLatitude,
        destinationLongitude,
      },
      motos: sortedMotosByTotalTravelTimeAndRightProperties,
    };
  }
}
