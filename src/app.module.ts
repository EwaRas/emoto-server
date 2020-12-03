import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MapboxApiModule } from './mapbox-api/mapbox-api.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/emoto-app'),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MapboxApiModule,
    UserModule,
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
