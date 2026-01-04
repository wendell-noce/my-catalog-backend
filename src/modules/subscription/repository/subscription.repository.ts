import { Injectable } from '@nestjs/common';

import { PaymentGateway, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class SubscriptionRepository {
  constructor(private prisma: PrismaService) {}

  async findPlanWithGateway(planId: string, gateway: PaymentGateway) {
    return this.prisma.plan.findUnique({
      where: { id: planId },
      include: {
        planGateways: {
          where: { gateway },
        },
      },
    });
  }

  async findOrCreateCustomerGateway(
    userId: string,
    gateway: PaymentGateway,
    externalCustomerId: string,
  ) {
    return this.prisma.customerGateway.upsert({
      where: {
        userId_gateway: {
          userId,
          gateway,
        },
      },
      create: {
        userId,
        gateway,
        externalCustomerId,
      },
      update: {},
    });
  }

  async createSubscription(data: {
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    startsAt: Date;
    endsAt: Date;
    trialEndsAt?: Date;
    trialStartedAt?: Date;
    originalPrice: number;
    contractedPrice: number;
    preferredGateway: PaymentGateway;
  }) {
    return this.prisma.subscription.create({
      data,
      include: {
        plan: true,
        user: true,
      },
    });
  }

  async findUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findActiveSubscriptionByUserId(userId: string) {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        status: {
          in: ['TRIAL', 'ACTIVE'],
        },
        user: {
          deletedAt: null,
        },
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
