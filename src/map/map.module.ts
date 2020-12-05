import { HttpModule, Module } from '@nestjs/common';
import { FluctuoService } from 'src/apiServices/fluctuo.service';
import { MapboxService } from 'src/apiServices/mapbox.service';
import { CurrentTripsModule } from 'src/current-trips/current-trips.module';
import { UserModule } from 'src/user/user.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  imports: [UserModule, HttpModule, CurrentTripsModule],
  controllers: [MapController],
  providers: [MapService, FluctuoService, MapboxService],
})
export class MapModule {}
