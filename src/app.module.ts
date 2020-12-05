import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MapModule } from './map/map.module';
import { MapboxService } from './apiServices/mapbox.service';
import { FluctuoService } from './apiServices/fluctuo.service';
import { CurrentTripsModule } from './current-trips/current-trips.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/emoto-app', {
      useFindAndModify: false,
      useCreateIndex: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MapModule,
    HttpModule,
    CurrentTripsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MapboxService, FluctuoService],
})
export class AppModule {}
