import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { PlanModule } from './modules/plan/plan.module';
import { StoreModule } from './modules/store/store.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './shared/prisma/primas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StoreModule,
    StripeModule,
    SubscriptionModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PlanModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
