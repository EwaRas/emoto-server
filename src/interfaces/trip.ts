import { Moto } from './motos.interface';

export interface Trip {
  destination: {
    longitude: number;
    latitude: number;
  };
  moto: Moto;
}
