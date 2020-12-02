import { Module } from '@nestjs/common';
import { TestApiController } from './test-api.controller';
import { TestApiService } from './test-api.service';

@Module({
  controllers: [TestApiController],
  providers: [TestApiService],
  exports: [TestApiService],
})
export class TestApiModule {}
