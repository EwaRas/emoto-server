import { Controller, Post, Body, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';
import { FavouriteDestination } from 'src/interfaces/favouriteDestination.interface';
import { EmotoProvider } from 'src/interfaces/provider.interface';

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
    return this.userService.addLocationAndGetUser(
      username,
      latitude,
      longitude,
    );
  }

  // can be providers or favourites
  @Put(':propertyToUpdate/:userId')
  updateUserFavouritesOrProviders(
    @Body('updatedValues')
    updatedFavouritesOrProviders: FavouriteDestination[] | EmotoProvider[],
    @Param('userId') _id: string,
    @Param('propertyToUpdate') favouritesOrProviders: string,
  ): Promise<UserDocument> {
    return this.userService.updateUser(
      _id,
      updatedFavouritesOrProviders,
      favouritesOrProviders,
    );
  }
}
