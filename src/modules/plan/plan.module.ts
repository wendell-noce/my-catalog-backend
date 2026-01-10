import { Module } from '@nestjs/common';

import { PlanController } from './controller/plan.controller';
import { PlanRepository } from './repository/plan.repository';
import { PlanService } from './service/plan.service';

@Module({
  controllers: [PlanController],
  providers: [PlanService, PlanRepository],
  exports: [PlanRepository],
})
export class PlanModule {}
