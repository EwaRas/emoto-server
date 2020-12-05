import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrentTripsService } from './current-trips.service';
import { TripSchema } from './trip.schema';
import { CurrentTripsController } from './current-trips.controller';
import { MapboxService } from 'src/apiServices/mapbox.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]),
    HttpModule,
  ],
  providers: [CurrentTripsService, MapboxService],
  controllers: [CurrentTripsController],
  exports: [CurrentTripsService],
})
export class CurrentTripsModule {}
