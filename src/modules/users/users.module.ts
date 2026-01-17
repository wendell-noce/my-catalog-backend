import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [forwardRef(() => AuthModule), StorageModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
