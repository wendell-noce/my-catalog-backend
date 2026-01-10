import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlanInterval, PlanTier } from '@prisma/client';
import { ApiFindAllPlans } from '../decorators/api-docs.decorator';
import { PlanService } from '../service/plan.service';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiFindAllPlans()
  findAll(
    @Query('tier') tier?: PlanTier,
    @Query('interval') interval?: PlanInterval,
  ) {
    return this.planService.findAll({ tier, interval });
  }

  @Get('tier/:tier')
  findByTier(@Param('tier') tier: PlanTier) {
    return this.planService.findByTier(tier);
  }

  @Get('interval/:interval')
  findByInterval(@Param('interval') interval: PlanInterval) {
    return this.planService.findByInterval(interval);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Mudou de +id para string
    return this.planService.findById(id);
  }
}
