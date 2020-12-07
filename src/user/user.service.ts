import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavouriteDestination } from 'src/interfaces/favouriteDestination.interface';
import { EmotoProvider } from 'src/interfaces/provider.interface';
import { UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUsername(username: string): Promise<boolean> {
    try {
      console.log('username', username);

      const userExists = await this.userModel.find();
      console.log('userExists', userExists);

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
      console.log('userInfo', userInfo);

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
    try {
      const { latitude, longitude } = await this.userModel.findOne({
        username,
      });
      return { latitude, longitude };
    } catch (error) {
      console.log('error getting user location from db', error);
    }
  }

  async updateUser(
    _id: string,
    updatedArray: FavouriteDestination[] | EmotoProvider[],
    propertyToUpdate: string,
  ): Promise<UserDocument> {
    try {
      const updatedUser: UserDocument = await this.userModel.findByIdAndUpdate(
        { _id },
        { $set: { [propertyToUpdate]: updatedArray } },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      console.log(`error updating ${propertyToUpdate} from db`, error);
    }
  }
}
