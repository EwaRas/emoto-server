import { HttpModule, Module } from '@nestjs/common';
import { MapboxApiService } from './mapbox-api.service';
import { MapboxApiController } from './mapbox-api.controller';

@Module({
  imports: [HttpModule],
  providers: [MapboxApiService],
  controllers: [MapboxApiController],
})
export class MapboxApiModule {}
