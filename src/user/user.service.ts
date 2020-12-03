import { Injectable } from '@nestjs/common';
import { FluctuoService } from 'src/api-services/fluctuo/fluctuo.service';
import { user } from 'src/db';
import { User } from 'src/interfaces/user.interface';
import { MapService } from 'src/map/map.service';

@Injectable()
export class UserService {
  constructor(
    private mapService: MapService,
    private fluctuoService: FluctuoService,
  ) {}

  async updateCurrentLocation(userDetails): User {
    //userDetails: username, password, lat, lng
    const currentLocation = `${userDetails.lat}, ${userDetails.lng}`;
    //call db, update user.lat & user.lng, return user obj
    //send user.lat & user.lng to mapService
    this.mapService.updateCurrentLocation(currentLocation);
    this.fluctuoService.getMotos(currentLocation);
    return user;
  }
  updateFavDestinations(): User {
    //params: @Body: {userId: string, label: string}
    const destination = this.mapService.getDestinationInfo();
    //destination = {address: string, lat: number, lng: number}
    //call db, update user.favorites[{label, address, lat, lng}]
    return user;
  }
}
