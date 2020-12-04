import { Body, Controller, Post } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}
  @Post()
  getMotosSortedByTime(
    @Body('destination') address: string,
    @Body('username') username: string,
  ) {
    return this.mapService.getMotosSortedByTime(address, username);
  }
}
