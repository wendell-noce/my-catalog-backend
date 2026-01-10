import { Injectable } from '@nestjs/common';
import { PlanInterval, PlanTier } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class PlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: { tier?: PlanTier; interval?: PlanInterval }) {
    const where: any = { active: true };

    if (filters?.tier) {
      where.tier = filters.tier;
    }

    if (filters?.interval) {
      where.interval = filters.interval;
    }

    return this.prisma.plan.findMany({
      where,
      orderBy: { price: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.plan.findUnique({
      where: { id },
    });
  }

  async findByStripePriceId(stripePriceId: string) {
    return this.prisma.plan.findUnique({
      where: { stripePriceId },
    });
  }

  async findByTier(tier: PlanTier) {
    return this.prisma.plan.findMany({
      where: { tier, active: true },
      orderBy: { price: 'asc' },
    });
  }

  async findByInterval(interval: PlanInterval) {
    return this.prisma.plan.findMany({
      where: { interval, active: true },
      orderBy: { price: 'asc' },
    });
  }

  async deactivate(id: string) {
    return this.prisma.plan.update({
      where: { id },
      data: { active: false },
    });
  }
}
