import { HttpModule, Module } from '@nestjs/common';
import { MapboxApiService } from './mapbox-api.service';
import { MapboxApiController } from './mapbox-api.controller';
import { TestApiModule } from 'src/test-api/test-api.module';

@Module({
  imports: [HttpModule, TestApiModule],
  providers: [MapboxApiService],
  controllers: [MapboxApiController],
})
export class MapboxApiModule {}
