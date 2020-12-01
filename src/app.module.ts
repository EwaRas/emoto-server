import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestApiModule } from './test-api/test-api.module';
import { MapboxApiModule } from './mapbox-api/mapbox-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TestApiModule,
    MapboxApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
