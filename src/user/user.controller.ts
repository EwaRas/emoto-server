import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { FavouriteDestination } from 'src/interfaces/favouriteDestination.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  // todo change to Get passing auth headers
  @Post()
  login(@Body('username') username: string): Promise<boolean> {
    return this.userService.validateUsername(username);
  }

  @Put('info')
  getUser(
    @Body('username') username: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number,
  ): Promise<UserDocument> {
    console.log('longitude in controller', longitude);
    return this.userService.addLocationAndGetUser(
      username,
      latitude,
      longitude,
    );
  }

  @Put('favourites/:userId')
  addAddressToFavourites(
    @Body('favourites') newFavourites: FavouriteDestination[],
    @Param('userId') _id: string,
  ) {
    return this.userService.updateUserFavouriteDestinations(_id, newFavourites);
  }
}
