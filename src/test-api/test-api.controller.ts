import { Body, Controller, Get, Post } from '@nestjs/common';
import { Moto } from '../interfaces/motos.interface';
import { User } from '../interfaces/user.interface';
import { TestApiService } from './test-api.service';

@Controller('test')
export class TestApiController {
  constructor(private testApiService: TestApiService) {}
  @Get()
  async getMotos(): Promise<Moto[]> {
    return this.testApiService.getAllMotos();
  }
  @Post()
  async getUserInfo(@Body() userInfo: User) {
    return userInfo;
  }
}
