import { Controller, Get, Query } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}

  // @Get(':destination/:username')
  @Get()
  getMotosSortedByTime(
    @Query('destination') address: string,
    @Query('username') username: string,
  ): Promise<{
    destinationCoordinates: {
      destinationLatitude: number;
      destinationLongitude: number;
    };
    motos: Moto[];
  }> {
    return this.mapService.getMotosSortedByTime(address, username);
  }
}
