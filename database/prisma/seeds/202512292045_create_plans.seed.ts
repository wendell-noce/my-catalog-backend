import {
  PaymentGateway,
  PlanInterval,
  PlanTier,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();

// ⚠️ SUBSTITUA ESSES IDs PELOS SEUS PRICE IDs DO STRIPE
const STRIPE_PRICE_IDS = {
  BASIC_MONTHLY: 'price_1SlHN0J2HuAz4yaEGDTuxUwv',
  BASIC_YEARLY: 'price_1SlHMTJ2HuAz4yaEVIbz279l',
  PRO_MONTHLY: 'price_1SlIG2J2HuAz4yaEYDqUrafl',
  PRO_YEARLY: 'price_1SlIFcJ2HuAz4yaExbA2vZ1h',
  ENTERPRISE_MONTHLY: 'price_1Sla4NJ2HuAz4yaEt0D6zpH3',
  ENTERPRISE_YEARLY: 'price_1Sla43J2HuAz4yaEy7LORmj4',
};

/* eslint-disable max-lines-per-function */
export async function seed202512292045CreatePlans() {
  console.log('🌱 [202512292045] Seeding plans...');

  const plans = [
    {
      name: 'Básico Mensal',
      description: 'Plano ideal para começar',
      tier: PlanTier.BASIC,
      interval: PlanInterval.MONTHLY,
      price: 29.9,
      currency: 'BRL',
      intervalCount: 1,
      isRecurring: true,
      features: {
        maxProducts: 50,
        maxImages: 5,
        storage: '1GB',
        support: 'Email',
        analytics: false,
        customDomain: false,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.BASIC_MONTHLY,
    },
    {
      name: 'Básico Anual',
      description: 'Plano ideal para começar - Economize 20%',
      tier: PlanTier.BASIC,
      interval: PlanInterval.YEARLY,
      price: 287.04,
      currency: 'BRL',
      intervalCount: 12,
      isRecurring: false,
      features: {
        maxProducts: 50,
        maxImages: 5,
        storage: '1GB',
        support: 'Email',
        analytics: false,
        customDomain: false,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.BASIC_YEARLY,
    },
    {
      name: 'Pro Mensal',
      description: 'Para negócios em crescimento',
      tier: PlanTier.PRO,
      interval: PlanInterval.MONTHLY,
      price: 79.9,
      currency: 'BRL',
      intervalCount: 1,
      isRecurring: true,
      features: {
        maxProducts: 500,
        maxImages: 20,
        storage: '10GB',
        support: 'Email e Chat',
        analytics: true,
        customDomain: true,
        prioritySupport: false,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.PRO_MONTHLY,
    },
    {
      name: 'Pro Anual',
      description: 'Para negócios em crescimento - Economize 25%',
      tier: PlanTier.PRO,
      interval: PlanInterval.YEARLY,
      price: 719.1,
      currency: 'BRL',
      intervalCount: 12,
      isRecurring: false,
      features: {
        maxProducts: 500,
        maxImages: 20,
        storage: '10GB',
        support: 'Email e Chat',
        analytics: true,
        customDomain: true,
        prioritySupport: false,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.PRO_YEARLY,
    },
    {
      name: 'Enterprise Mensal',
      description: 'Recursos ilimitados para sua empresa',
      tier: PlanTier.ENTERPRISE,
      interval: PlanInterval.MONTHLY,
      price: 199.9,
      currency: 'BRL',
      intervalCount: 1,
      isRecurring: true,
      features: {
        maxProducts: 'unlimited',
        maxImages: 'unlimited',
        storage: '100GB',
        support: '24/7 Priority',
        analytics: true,
        customDomain: true,
        prioritySupport: true,
        dedicatedAccount: true,
        apiAccess: true,
        whitelabel: true,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.ENTERPRISE_MONTHLY,
    },
    {
      name: 'Enterprise Anual',
      description: 'Recursos ilimitados para sua empresa - Economize 30%',
      tier: PlanTier.ENTERPRISE,
      interval: PlanInterval.YEARLY,
      price: 1679.16,
      currency: 'BRL',
      intervalCount: 12,
      isRecurring: false,
      features: {
        maxProducts: 'unlimited',
        maxImages: 'unlimited',
        storage: '100GB',
        support: '24/7 Priority',
        analytics: true,
        customDomain: true,
        prioritySupport: true,
        dedicatedAccount: true,
        apiAccess: true,
        whitelabel: true,
      },
      active: true,
      stripePriceId: STRIPE_PRICE_IDS.ENTERPRISE_YEARLY,
    },
  ];

  for (const planData of plans) {
    const { stripePriceId, ...planDataWithoutStripe } = planData;

    // Cria o plano
    const plan = await prisma.plan.create({
      data: planDataWithoutStripe,
    });

    // Vincula com o Stripe
    await prisma.planGateway.create({
      data: {
        planId: plan.id,
        gateway: PaymentGateway.STRIPE,
        externalPriceId: stripePriceId,
      },
    });

    console.log(`   ✅ ${planData.name} (Stripe: ${stripePriceId})`);
  }

  console.log('🎉 Plans seeded successfully with Stripe integration!');
}
