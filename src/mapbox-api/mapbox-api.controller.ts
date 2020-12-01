import { Body, Controller, Post } from '@nestjs/common';
import { MapboxApiService } from './mapbox-api.service';

@Controller('mapbox')
export class MapboxApiController {
  constructor(private readonly mapboxService: MapboxApiService) {}

  @Post()
  getCoordinatesFrom(@Body() address: { address: string }): Promise<any> {
    const coordinates = this.mapboxService
      .getCoordinates(address.address)
      .toPromise()
      .then((res) => {
        return res.features[0].geometry.coordinates;
      })
      .catch((error) => {
        console.log('controller errrrrrror', error);
      });
    return coordinates;
  }
}
