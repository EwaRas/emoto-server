import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Moto } from 'src/interfaces/motos.interface';

export type TripDocument = Trip & Document;

@Schema()
export class Trip {
  @Prop()
  expireAt: Date;
  @Prop({ type: 'object', required: true })
  moto: Moto;
}

const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

export { TripSchema };
