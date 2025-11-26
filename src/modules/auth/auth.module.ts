import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { AuthService } from './service/auth.service';

@Module({
  imports: [UsersModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenRepository],
})
export class AuthModule {}
