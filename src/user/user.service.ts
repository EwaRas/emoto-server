import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUsername(username: string): Promise<boolean> {
    try {
      const userExists = await this.userModel.findOne({ username });
      if (!userExists) return false;
      return true;
    } catch (error) {
      console.log('error validating user', error);
    }
  }

  async addLocationAndGetUser(
    username: string,
    latitude: number,
    longitude: number,
  ): Promise<UserDocument> {
    try {
      const userInfo = await this.userModel.findOneAndUpdate(
        { username },
        { $set: { latitude, longitude } },
        { new: true },
      );
      return userInfo;
    } catch (error) {
      console.log('error adding current location', error);
    }
  }

  async getUserLocation(
    username: string,
  ): Promise<{
    latitude: number;
    longitude: number;
  }> {
    const { latitude, longitude } = await this.userModel.findOne({ username });
    return { latitude, longitude };
  }

  updateFavDestinations() {
    //params: @Body: {userId: string, label: string}
    // const destination = this.mapService.getDestinationInfo();
    //destination = {address: string, lat: number, lng: number}
    //call db, update user.favorites[{label, address, lat, lng}]
  }
}
