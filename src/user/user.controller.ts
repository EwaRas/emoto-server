import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/interfaces/user.interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  async updateUserLocation(@Body() userDetails: User) {
    //userDetails: username, password, lat, lng
    const user = await this.userService.updateCurrentLocation(userDetails);
    return user;
  }

  @Patch()
  updateUserFavDestinations() {
    //params: @Body: {userId: string, label: string}
    const user = await this.userService.updateFavDestinations();
    return user;
  }
}
