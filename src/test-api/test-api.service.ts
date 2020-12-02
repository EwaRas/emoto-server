import { Injectable } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import { User } from 'src/interfaces/user.interface';
import { motosArr, user } from '../db';

@Injectable()
export class TestApiService {
  getAllMotos(): Moto[] {
    return [...motosArr];
  }
  getUserWithFavourites(): User {
    return { ...user };
  }
}
