import { FavouriteDestination } from './favouriteDestination.interface';
import { EmotoProvider } from './provider.interface';

export interface User {
  _id?: string;
  name: string;
  password: string;
  lat: number;
  lng: number;
  favourites?: FavouriteDestination[];
  providers?: EmotoProvider[];
}
