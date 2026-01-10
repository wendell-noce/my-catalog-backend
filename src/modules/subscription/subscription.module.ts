import { forwardRef, Module } from '@nestjs/common';
import { PlanModule } from '../plan/plan.module';
import { StripeModule } from '../stripe/stripe.module';
import { UsersModule } from '../users/users.module';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionRepository } from './repository/subscription.repository';
import { SubscriptionService } from './service/subscription.service';

@Module({
  imports: [forwardRef(() => StripeModule), UsersModule, PlanModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
