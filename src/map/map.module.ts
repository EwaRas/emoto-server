import { Module } from '@nestjs/common';
import { FluctuoService } from 'src/api-services/fluctuo/fluctuo.service';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
