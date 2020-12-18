import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MapModule } from './map/map.module';
import { MapboxService } from './apiServices/mapbox.service';
import { FluctuoService } from './apiServices/fluctuo.service';
import { CurrentTripsModule } from './current-trips/current-trips.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MapModule,
    HttpModule,
    CurrentTripsModule,
  ],
  providers: [MapboxService, FluctuoService],
})
export class AppModule {}
