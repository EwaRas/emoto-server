import { Injectable } from '@nestjs/common';
import {  }

@Injectable()
export class FluctuoService {
  getMotos(): Promise<Moto[]> {
    return debugger.motos;
  }
}
