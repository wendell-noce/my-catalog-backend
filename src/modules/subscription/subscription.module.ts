import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/primas.module';
import { PaymentModule } from '../payment/payment.module';
import { SubscriptionController } from './controller/subscription.controller';
import { SubscriptionRepository } from './repository/subscription.repository';
import { SubscriptionService } from './service/subscription.service';

@Module({
  imports: [PaymentModule, PrismaModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
