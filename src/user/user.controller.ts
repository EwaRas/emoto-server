import { Controller, Post, Body, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDocument } from './user.schema';

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
}
