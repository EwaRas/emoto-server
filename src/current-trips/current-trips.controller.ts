import { Body, Controller, Post } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { CurrentTripsService } from './current-trips.service';

@Controller('current-trips')
export class CurrentTripsController {
  constructor(private readonly currentTripsService: CurrentTripsService) {}
  @Post()
  createNewCurrentTrip(
    @Body('destination') destination: string,
    @Body('moto') moto: Moto,
  ) {
    return this.currentTripsService.addCurrentTrip(destination, moto);
  }
}
