import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  /**
   * Gera uma sessão de Checkout para assinaturas
   * @param customerId ID do cliente na Stripe (cus_xxx)
   * @param priceId ID do preço na Stripe (price_xxx)
   * @param metadata Informações que você quer receber de volta no Webhook (userId, planId, etc)
   */
  async createSubscriptionSession(
    customerId: string,
    priceId: string,
    metadata: Record<string, string>,
  ) {
    try {
      return await this.stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
        metadata,
        allow_promotion_codes: false,
        billing_address_collection: 'required',
      });
    } catch (error) {
      // Logamos o erro internamente para você saber o que aconteceu
      console.error('❌ Erro ao criar sessão Stripe:', error.message);

      // Tratamos erros específicos da Stripe (ex: ID de preço inválido)
      if (error.type === 'StripeInvalidRequestError') {
        throw new BadRequestException(
          'Configuração de pagamento inválida. O plano pode não existir.',
        );
      }

      // Erro genérico para o frontend não receber dados sensíveis do seu servidor
      throw new InternalServerErrorException(
        'Não foi possível iniciar o processo de pagamento. Tente novamente mais tarde.',
      );
    }
  }

  /**
   * Método auxiliar para criar um Customer na Stripe caso o usuário não tenha um
   */
  async createCustomer(email: string, name: string, userId: string) {
    return await this.stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });
  }

  constructEvent(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new BadRequestException('Webhook signature verification failed.');
    }

    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      console.error(
        `[Stripe Error] Falha na validação do Webhook: ${err.message}`,
      );
      throw new BadRequestException('Webhook signature verification failed.');
    }
  }
}
