import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentGateway, SubscriptionStatus } from '@prisma/client';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PaymentService } from 'src/modules/payment/payment.service';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { SubscriptionRepository } from '../repository/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async create(dto: CreateSubscriptionDto) {
    const { userId, planId } = dto;

    // *** Get Stripe Plans
    const plan = await this.subscriptionRepository.findPlanWithGateway(
      planId,
      PaymentGateway.STRIPE,
    );

    if (!plan) {
      throw new NotFoundException('Plano não encontrado');
    }

    if (!plan.active) {
      throw new BadRequestException('Plano não está ativo');
    }

    const planGateway = plan.planGateways[0];
    if (!planGateway) {
      throw new NotFoundException(
        'Plano não configurado no gateway de pagamento',
      );
    }

    // *** Get user By ID
    const user = await this.subscriptionRepository.findUser(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // *** Set Stripe Customer
    const stripeCustomer = await this.getCustomer(user);

    // *** Save CustomerGateway in Database
    const gatewayCustomer = await this.setGatewayCustomer(
      userId,
      stripeCustomer,
    );
    if (!gatewayCustomer) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // *** Create Subscription in Stripe (trial for 7 days)
    const stripeSubscription: any = await this.createStripeSubscription(
      stripeCustomer,
      planGateway,
      userId,
      planId,
    );

    // *** Set Dates
    const dates = this.setDates();

    // *** Set Subscription in database
    const subscription: any = await this.saveLocalSubscription(
      userId,
      planId,
      new Date(),
      dates.trialEndsAt,
      dates.endsAt,
      plan,
    );

    return ResponseHelper.success(
      {
        data: {
          subscription,
          stripeSubscriptionId: stripeSubscription.id,
        },
      },
      'Assinatura criada com sucesso! Trial de 7 dias iniciado.',
    );
  }

  private setDates() {
    const now = new Date();
    const trialEndsAt = new Date(now);
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const endsAt = new Date(trialEndsAt);
    endsAt.setMonth(endsAt.getMonth() + 1);

    return { trialEndsAt, endsAt };
  }

  private async getCustomer(user: any) {
    return await this.paymentService.createCustomer({
      // ← RETURN
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
  }

  private async setGatewayCustomer(userId: string, stripeCustomer: any) {
    return await this.subscriptionRepository.findOrCreateCustomerGateway(
      userId,
      PaymentGateway.STRIPE,
      stripeCustomer.id,
    );
  }

  private async createSubscription(
    stripeCustomer: any,
    planGateway: any,
    userId: string,
    planId: string,
  ) {
    try {
      const result = await this.paymentService.createSubscription({
        customerId: stripeCustomer.id,
        priceId: planGateway.externalPriceId,
        trialPeriodDays: 7,
        metadata: { userId, planId },
      });
      return result;
    } catch (error) {
      console.error('Stripe error:', error);
      console.error('customerId:', stripeCustomer.id);
      console.error('priceId:', planGateway.externalPriceId);
      throw error;
    }
  }

  private async createStripeSubscription(
    stripeCustomer: any,
    planGateway: any,
    userId: string,
    planId: string,
  ) {
    const result = await this.createSubscription(
      stripeCustomer,
      planGateway,
      userId,
      planId,
    );

    return result;
  }

  private async saveLocalSubscription(
    userId: string,
    planId: string,
    now: Date,
    trialEndsAt: Date,
    endsAt: Date,
    plan: any,
  ) {
    return await this.subscriptionRepository.createSubscription({
      userId,
      planId,
      status: SubscriptionStatus.TRIAL,
      startsAt: now,
      endsAt,
      trialStartedAt: now,
      trialEndsAt,
      originalPrice: Number(plan.price),
      contractedPrice: Number(plan.price),
      preferredGateway: PaymentGateway.STRIPE,
    });
  }

  async getSubscriptionsByUserId(userId: string) {
    const plans =
      await this.subscriptionRepository.findActiveSubscriptionByUserId(userId);
    return ResponseHelper.success(plans, 'Assinaturas listadas com sucesso');
  }
}
