import { Controller, Post, Body } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}

  @Post()
  async getRecommendedMotos(@Body() destination: { address: string }) {
    return await this.mapService.getRecommendedMotos(destination.address);
  }
}
