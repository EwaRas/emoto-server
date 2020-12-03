import { Module } from '@nestjs/common';
import { FluctuoService } from './fluctuo.service';

@Module({
  providers: [FluctuoService],
  exports: [FluctuoService],
})
export class FluctuoModule {}
