import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MapboxService } from 'src/apiServices/mapbox.service';
import { Moto } from 'src/interfaces/motos.interface';
import { TripDocument } from './trip.schema';

@Injectable()
export class CurrentTripsService {
  constructor(
    @InjectModel('Trip') private readonly tripModel: Model<TripDocument>,
    private readonly mapboxService: MapboxService,
  ) {}
  // : Promise<TripDocument>
  async addCurrentTrip(destination: string, moto: Moto) {
    try {
      // get coordinates from destination
      const [
        destinationLongitude,
        destinationLatitude,
      ] = await this.mapboxService.getCoordinates(destination);
      // get the time to expire
      const expireDate = new Date();
      console.log('initial time', expireDate);

      expireDate.setSeconds(expireDate.getSeconds() + moto.totalTravelTime);

      // create a new Moto object modifying its current loc
      const currentTrip = {
        expireAt: expireDate,
        moto: {
          id: moto.id,
          publicId: moto.publicId,
          type: moto.type,
          latitude: destinationLatitude,
          longitude: destinationLongitude,
          provider: moto.provider,
          battery: moto.battery,
          walkTime: moto.walkTime,
          driveTime: moto.driveTime,
          totalTravelTime: moto.totalTravelTime,
          isIncomming: true,
          creationTime: Date.now(),
        },
      };
      // save the trip into trip collection
      const newTrip = await this.tripModel.create(currentTrip);

      return newTrip;
    } catch (error) {
      console.log('error saving trip into the db', error);
    }
  }

  async getAllTrips() {
    try {
      return await this.tripModel.find();
    } catch (error) {
      console.log('error getting trips from db', error);
    }
  }
}
