import { Injectable } from '@nestjs/common';
import { FluctuoService } from 'src/apiServices/fluctuo/fluctuo.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MapService {
  constructor(
    private readonly userService: UserService,
    private readonly fluctuoService: FluctuoService,
  ) {}

  async getMotosSortedByTime(adress: string, username: string) {
    // get current location
    const userCoordinates = await this.userService.getUserLocation(username);
    // get bikes from Fluctuo
    const motosNearUser = await this.getMotosNearUser(userCoordinates);
    return motosNearUser;
  }

  async getMotosNearUser(userCoordinates: {
    latitude: number;
    longitude: number;
  }) {
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

    const motos = await this.fluctuoService
      .getMotosNearUser(query) //todo pass coordinates to build query in fluctuo service
      .toPromise()
      .then((result) => {
        console.log('result', result);

        return result.data.vehicles;
      })
      .catch((err) => console.log('error getting motos from fluctio'));
    // console.log('motosPromise', motosPromise);

    return motos;
  }
}
