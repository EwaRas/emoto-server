import { FavouriteDestination } from './favouriteDestination.interface';

export interface User {
  _id?: string;
  name: string;
  password: string;
  lat: number;
  lng: number;
  favorites?: FavouriteDestination[];
}
