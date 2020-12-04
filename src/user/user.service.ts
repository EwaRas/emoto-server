import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavouriteDestination } from 'src/interfaces/favouriteDestination.interface';
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
    try {
      const { latitude, longitude } = await this.userModel.findOne({
        username,
      });
      return { latitude, longitude };
    } catch (error) {
      console.log('error getting user location from db', error);
    }
  }

  async updateUserFavouriteDestinations(
    _id: string,
    newFavourites: FavouriteDestination[],
  ): Promise<UserDocument> {
    try {
      const updatedUser: UserDocument = await this.userModel.findByIdAndUpdate(
        { _id },
        { $set: { favourites: newFavourites } },
        { new: true },
      );
      return updatedUser;
    } catch (error) {
      console.log('error updating user favourites from db', error);
    }
  }
}
