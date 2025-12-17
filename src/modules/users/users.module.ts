import { Module } from '@nestjs/common';

import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './service/users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
