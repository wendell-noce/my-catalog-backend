import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

@Injectable()
export class SubscriptionRepository {
  constructor(private prisma: PrismaService) {}
  async upsertSubscription(data: CreateSubscriptionDto) {
    try {
      return await this.prisma.subscription.upsert({
        where: { userId: data.userId },
        update: {
          planId: data.planId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripeCustomerId: data.stripeCustomerId,
          stripePriceId: data.stripePriceId,
          stripeItemId: data.stripeItemId,
          status: data.status,
          amount: data.amount,
          currentPeriodStart: data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd,
          canceledAt: null,
          endedAt: null,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId: data.userId,
          planId: data.planId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripeCustomerId: data.stripeCustomerId,
          stripePriceId: data.stripePriceId,
          stripeItemId: data.stripeItemId,
          status: data.status,
          amount: data.amount,
          currentPeriodStart: data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd,
        },
      });
    } catch (error) {
      console.error(`❌ Erro ao salvar assinatura:`, error);
      throw new InternalServerErrorException(
        'Erro no banco de dados ao salvar assinatura.',
      );
    }
  }

  async updateByStripeId(stripeId: string, data: any) {
    return await this.prisma.subscription.update({
      where: { stripeSubscriptionId: stripeId },
      data: data,
    });
  }
}
