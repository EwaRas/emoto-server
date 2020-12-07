import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FavouriteDestination } from 'src/interfaces/favouriteDestination.interface';
import { EmotoProvider } from '../interfaces/provider.interface';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop({ default: [] })
  favourites: FavouriteDestination[];
  @Prop({ default: [] })
  providers: EmotoProvider[];
}

export const UserSchema = SchemaFactory.createForClass(User);
