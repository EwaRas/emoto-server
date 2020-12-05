import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Moto } from 'src/interfaces/motos.interface';
import { DestionationCoordinates } from '../interfaces/trip';

export type TripDocument = Trip & Document;

@Schema()
export class Trip {
  @Prop()
  destination: any;
  @Prop({ required: true })
  moto: Moto;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
