import { Body, Controller, Get, Post } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { CurrentTripsService } from './current-trips.service';
import { TripDocument } from './trip.schema';

@Controller('add-trip')
export class CurrentTripsController {
  constructor(private readonly currentTripsService: CurrentTripsService) {}
  @Post()
  createNewCurrentTrip(
    @Body('destination') destination: string,
    @Body('moto') moto: Moto,
  ): Promise<TripDocument> {
    return this.currentTripsService.addCurrentTrip(destination, moto);
  }

  @Get()
  testGetTrips(): Promise<TripDocument[]> {
    return this.currentTripsService.getAllTrips();
  }
}

// : Promise<TripDocument[]>
