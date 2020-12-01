import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestApiModule } from './test-api/test-api.module';

@Module({
  imports: [TestApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
