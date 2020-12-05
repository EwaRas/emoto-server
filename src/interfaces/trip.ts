import { Moto } from './motos.interface';
export interface DestionationCoordinates {
  longitude: number;
  latitude: number;
}
export interface Trip {
  destination: DestionationCoordinates;
  moto: Moto;
}
