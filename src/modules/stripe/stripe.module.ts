import { forwardRef, Module } from '@nestjs/common';
import { SubscriptionModule } from '../subscription/subscription.module';
import { StripeController } from './controller/stripe.controller';
import { StripeService } from './service/stripe.service';

@Module({
  imports: [forwardRef(() => SubscriptionModule)],
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
