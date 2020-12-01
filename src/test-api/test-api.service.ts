import { Injectable } from '@nestjs/common';
import { Moto } from 'src/interfaces/motos.interface';
import dbMoto from '../db';

@Injectable()
export class TestApiService {
  getAllMotos(): Moto[] {
    return dbMoto;
  }
}
