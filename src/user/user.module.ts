import { Module } from '@nestjs/common';
import { FluctuoService } from 'src/api-services/fluctuo/fluctuo.service';
import { MapService } from 'src/map/map.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MapService, FluctuoService],
})
export class UserModule {}
