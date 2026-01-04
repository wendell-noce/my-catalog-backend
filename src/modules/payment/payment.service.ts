// src/modules/payment/payment.service.ts

import { Injectable } from '@nestjs/common';
import {
  CreateCustomerDTO,
  CreatePaymentDTO,
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
} from './adapters/payment-gateway.interface';
import { StripeAdapter } from './adapters/stripe.adapter';

@Injectable()
export class PaymentService {
  constructor(private readonly stripeAdapter: StripeAdapter) {}

  // Por hora só usa Stripe, mas no futuro você pode ter factory aqui
  private getGateway() {
    return this.stripeAdapter;
  }

  async createCustomer(data: CreateCustomerDTO) {
    const gateway = this.getGateway();
    return gateway.createCustomer(data);
  }

  async createSubscription(data: CreateSubscriptionDTO) {
    const gateway = this.getGateway();
    return gateway.createSubscription(data);
  }

  async cancelSubscription(subscriptionId: string) {
    const gateway = this.getGateway();
    return gateway.cancelSubscription(subscriptionId);
  }

  async createPayment(data: CreatePaymentDTO) {
    const gateway = this.getGateway();
    return gateway.createPayment(data);
  }

  async updateSubscription(data: UpdateSubscriptionDTO) {
    const gateway = this.getGateway();
    return gateway.updateSubscription(data);
  }

  async getSubscription(subscriptionId: string) {
    const gateway = this.getGateway();
    return gateway.getSubscription(subscriptionId);
  }
}
