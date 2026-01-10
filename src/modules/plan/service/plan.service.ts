import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanInterval, PlanTier } from '@prisma/client';
import { PlanRepository } from '../repository/plan.repository';

@Injectable()
export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  async findAll(filters?: { tier?: PlanTier; interval?: PlanInterval }) {
    return this.planRepository.findAll(filters);
  }

  async findById(id: string) {
    const plan = await this.planRepository.findById(id);

    if (!plan) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }

    return plan;
  }

  async findByStripePriceId(stripePriceId: string) {
    const plan = await this.planRepository.findByStripePriceId(stripePriceId);

    if (!plan) {
      throw new NotFoundException(
        `Plano com stripePriceId ${stripePriceId} não encontrado`,
      );
    }

    return plan;
  }

  async findByTier(tier: PlanTier) {
    return this.planRepository.findByTier(tier);
  }

  async findByInterval(interval: PlanInterval) {
    return this.planRepository.findByInterval(interval);
  }

  async deactivate(id: string) {
    const plan = await this.findById(id); // Valida se existe
    return this.planRepository.deactivate(plan.id);
  }
}
