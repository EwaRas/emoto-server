import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapboxService } from 'src/apiServices/mapbox.service';
import { Moto } from 'src/interfaces/motos.interface';
import { Trip, TripDocument } from './trip.schema';

@Injectable()
export class CurrentTripsService {
  constructor(
    @InjectModel('Trip') private readonly tripModel: Model<TripDocument>,
    private readonly mapboxService: MapboxService,
  ) {}

  async addCurrentTrip(destination: string, moto: Moto) {
    // get coordinates from destination
    const [
      destinationLongitude,
      destinationLatitude,
    ] = await this.mapboxService.getCoordinates(destination);
    // create a new currentTrip object
    const currentTrip: Trip = {
      destination: {
        longitude: destinationLongitude,
        latitude: destinationLatitude,
      },
      moto,
    };
    // save the trip into trip collection
    const newTrip = await this.tripModel.create(currentTrip);
    return newTrip;
  }
}
