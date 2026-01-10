import { registerAs } from '@nestjs/config';
import Stripe from 'stripe';

export const stripeConfig = registerAs('stripe', () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // Opcional em dev

  // Validação básica
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables',
    );
  }

  if (!publishableKey) {
    throw new Error(
      'STRIPE_PUBLISHABLE_KEY is not defined in environment variables',
    );
  }

  // Validar formato das chaves
  if (!secretKey.startsWith('sk_')) {
    throw new Error('STRIPE_SECRET_KEY must start with "sk_"');
  }

  if (!publishableKey.startsWith('pk_')) {
    throw new Error('STRIPE_PUBLISHABLE_KEY must start with "pk_"');
  }

  // Webhook secret é opcional em desenvolvimento (Stripe CLI gera dinamicamente)
  if (webhookSecret && !webhookSecret.startsWith('whsec_')) {
    throw new Error('STRIPE_WEBHOOK_SECRET must start with "whsec_"');
  }

  return {
    secretKey,
    webhookSecret: webhookSecret || null, // Null se não definido
    publishableKey,
    apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    successUrl:
      process.env.STRIPE_SUCCESS_URL || `${process.env.FRONTEND_URL}/success`,
    cancelUrl:
      process.env.STRIPE_CANCEL_URL || `${process.env.FRONTEND_URL}/pricing`,
    currency: 'brl',
    locale: 'pt-BR',
  };
});

// Instância do Stripe Client (singleton)
let stripeInstance: Stripe | null = null;

export const getStripeClient = (): Stripe => {
  if (!stripeInstance) {
    const config = stripeConfig();

    stripeInstance = new Stripe(config.secretKey, {
      apiVersion: config.apiVersion,
      typescript: true,
      appInfo: {
        name: 'Seu SaaS',
        version: '1.0.0',
      },
    });
  }

  return stripeInstance;
};

// Export da instância para uso direto
export const stripe = getStripeClient();
