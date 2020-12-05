import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Moto } from 'src/interfaces/motos.interface';

export type TripDocument = Trip & Document;

@Schema()
export class Trip {
  @Prop({ type: 'object', required: true })
  destination: {
    longitude: number;
    latitude: number;
  };
  @Prop({ type: 'object', required: true })
  moto: Moto;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
