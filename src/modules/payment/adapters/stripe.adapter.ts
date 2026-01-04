// src/modules/payment/adapters/stripe.adapter.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  CreateCustomerDTO,
  CreatePaymentDTO,
  CreateSubscriptionDTO,
  IPaymentGateway,
  UpdateSubscriptionDTO,
} from './payment-gateway.interface';

@Injectable()
export class StripeAdapter implements IPaymentGateway {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY não configurada');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  async createCustomer(data: CreateCustomerDTO) {
    const customer = await this.stripe.customers.create({
      email: data.email,
      name: data.name,
      metadata: data.metadata,
    });

    return {
      id: customer.id,
      email: customer.email || data.email,
    };
  }

  async createSubscription(data: CreateSubscriptionDTO) {
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: data.customerId,
      items: [{ price: data.priceId }],
      metadata: data.metadata,
    };

    if (data.trialPeriodDays) {
      subscriptionData.trial_period_days = data.trialPeriodDays;
    }

    const subscription =
      await this.stripe.subscriptions.create(subscriptionData);

    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.billing_cycle_anchor * 1000),
    };
  }

  async cancelSubscription(subscriptionId: string) {
    const subscription = await this.stripe.subscriptions.cancel(subscriptionId);

    return {
      id: subscription.id,
      status: subscription.status,
    };
  }

  async createPayment(data: CreatePaymentDTO) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      customer: data.customerId,
      description: data.description,
      metadata: data.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
    };
  }

  async updateSubscription(data: UpdateSubscriptionDTO) {
    const subscription = await this.stripe.subscriptions.retrieve(
      data.subscriptionId,
    );

    const updated = await this.stripe.subscriptions.update(
      data.subscriptionId,
      {
        items: [
          {
            id: subscription.items.data[0].id,
            price: data.newPriceId,
          },
        ],
        proration_behavior: data.prorationBehavior || 'create_prorations',
      },
    );

    return {
      id: updated.id,
      status: updated.status,
    };
  }

  async getSubscription(subscriptionId: string) {
    const subscription =
      await this.stripe.subscriptions.retrieve(subscriptionId);

    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.billing_cycle_anchor * 1000),
    };
  }
}
