import { Module } from '@nestjs/common';
import { StoreRepository } from './repository/store.repository';
import { StoreService } from './service/store.service';
import { StoreController } from './store.controller';

@Module({
  controllers: [StoreController],
  providers: [StoreService, StoreRepository],
})
export class StoreModule {}
