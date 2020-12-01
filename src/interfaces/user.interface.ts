import { FavDest } from './favDest.interface';

export interface User {
  _id?: string;
  name: string;
  password: string;
  lat: number;
  lng: number;
  favorites?: FavDest[];
}
