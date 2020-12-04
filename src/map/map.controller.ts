import { Body, Controller, Post } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}
  @Post()
  getMotosSortedByTime(
    @Body('address') address: string,
    @Body('username') username: string,
  ) {
    return this.mapService.getMotosSortedByTime(address, username);
  }
}
