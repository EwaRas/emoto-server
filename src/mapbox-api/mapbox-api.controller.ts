import { Body, Controller, Get, Post } from '@nestjs/common';
import { MapboxApiService } from './mapbox-api.service';

@Controller('mapbox')
export class MapboxApiController {
  constructor(private readonly mapboxService: MapboxApiService) {}

  @Get()
  async getAllMotos() {
    return await this.mapboxService.getWalkingDistance();
  }

  @Post()
  getMotosWithRec(@Body() address: { address: string }) {
    return this.mapboxService.getAllMotosWithRec(address.address);
  }
}
