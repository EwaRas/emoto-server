import { Injectable } from '@nestjs/common';
import { FluctuoService } from 'src/api-services/fluctuo/fluctuo.service';

@Injectable()
export class MapService {
  constructor(private fluctuoService: FluctuoService) {}

  private currentLocation;
  private destination = `{address: string, lat: number, lng: number}`;
  private motosWithWalkTime;

  updateCurrentLocation(userLocation) {
    this.currentLocation = userLocation;
    this.motosWithWalkTime = this.fluctuoService.getMotos(this.currentLocation);
  }
  getDestinationInfo() {
    return this.destination;
  }
  getRecommendedMotos(address) {}
}
