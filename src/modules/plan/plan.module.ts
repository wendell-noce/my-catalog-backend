import { Module } from '@nestjs/common';
import { PaymentModule } from '../payment/payment.module';
import { PlanController } from './controller/plan.controller';
import { PlanRepository } from './repository/plan.repository';
import { PlanService } from './service/plan.service';

@Module({
  imports: [PaymentModule],
  controllers: [PlanController],
  providers: [PlanService, PlanRepository],
})
export class PlanModule {}
