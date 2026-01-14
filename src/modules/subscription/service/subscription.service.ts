import { Injectable } from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { PlanRepository } from 'src/modules/plan/repository/plan.repository';
import { StripeService } from 'src/modules/stripe/service/stripe.service';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import Stripe from 'stripe';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
import { UpdateSubscriptionDto } from '../dto/update-subscription.dto';

import { SubscriptionStatus } from '@prisma/client';
import { SubscriptionRepository } from '../repository/subscription.repository';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userRepository: UsersRepository,
    private readonly planRepository: PlanRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async checkout(userId: string, planId: string) {
    // *** Get plan and user info
    const plan = await this.planRepository.findById(planId);
    if (!plan) {
      throw new Error('O plano selecionado não foi encontrado');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // *** Check if user has a Stripe Customer ID, if not, create one
    let stripeId = user.stripeCustomerId;
    if (!stripeId) {
      const customer = await this.stripeService.createCustomer(
        user.email,
        user.name,
        user.id,
      );
      await this.userRepository.updateStripeId(user.id, customer.id);
      stripeId = customer.id;
    }

    // *** Create checkout session
    const session = await this.stripeService.createSubscriptionSession(
      stripeId,
      plan.stripePriceId,
      { userId: user.id, planId: plan.id }, // *** [ Essencial para o Webhook saber o que fazer depois ] ***
    );

    return ResponseHelper.success({ url: session.url });
  }

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return `This action adds a new subscription ${createSubscriptionDto}`;
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findByUserId(userId: string) {
    const subscription = this.subscriptionRepository.findByUserId(userId);
    return ResponseHelper.success(
      { subscription },
      'Subscrição encontrada com sucesso',
    );
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription ${updateSubscriptionDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const subscription = await this.stripeService.stripe.subscriptions.retrieve(
      session.subscription as string,
      {
        expand: ['latest_invoice.lines.data'],
      },
    );

    if (
      !subscription.latest_invoice ||
      typeof subscription.latest_invoice === 'string'
    ) {
      throw new Error('Invoice não expandida');
    }

    const line = subscription.latest_invoice.lines.data[0];

    const periodStart = line.period.start;
    const periodEnd = line.period.end;

    // *** Get the necessary data from the session and save/activate the subscription in your DB
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    if (!userId || !planId) {
      throw new Error(
        'Falta informação no metada de retorno do Stripe Checkout Session',
      );
    }

    // *** get plan to fetch amount and period info
    const subscriptionData = {
      userId: userId,
      planId: planId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeItemId: subscription.items.data[0].id,
      status: SubscriptionStatus.ACTIVE,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      currentPeriodStart: new Date(periodStart * 1000),
      currentPeriodEnd: new Date(periodEnd * 1000),
    };

    return await this.subscriptionRepository.upsertSubscription(
      subscriptionData,
    );
  }

  async handleRenewal(event: Stripe.Event) {
    const invoice = event.data.object as any;

    const stripeSubscriptionId = invoice.subscription as string;

    if (!stripeSubscriptionId) {
      console.log(`Fatura ${invoice.id} não possui assinatura vinculada.`);
      return;
    }

    const subscription =
      (await this.stripeService.stripe.subscriptions.retrieve(
        stripeSubscriptionId,
      )) as Stripe.Subscription;

    const periodStart = (subscription as any).current_period_start;
    const periodEnd = (subscription as any).current_period_end;

    if (!periodStart || !periodEnd) {
      throw new Error('Datas de período não encontradas na assinatura');
    }

    return await this.subscriptionRepository.updateByStripeId(
      stripeSubscriptionId,
      {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(periodStart * 1000),
        currentPeriodEnd: new Date(periodEnd * 1000),
        amount: invoice.amount_paid / 100,
      },
    );
  }

  async handleCancellation(subscription: Stripe.Subscription) {
    const newStatus = subscription.status.toUpperCase() as SubscriptionStatus;

    return await this.subscriptionRepository.updateByStripeId(subscription.id, {
      status: newStatus,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      endedAt: subscription.ended_at
        ? new Date(subscription.ended_at * 1000)
        : null,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
    });
  }
}
