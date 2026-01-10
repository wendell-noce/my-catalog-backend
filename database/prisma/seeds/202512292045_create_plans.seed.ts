import { PlanInterval, PlanTier, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STRIPE_PRICE_IDS = {
  STARTER: 'price_1SlHMTJ2HuAz4yaEVIbz279l',
  PRO: 'price_1SnSpPJ2HuAz4yaE0hTJNU1m',
  UNLIMITED: 'price_1SnSq8J2HuAz4yaE6fFAvyDo',
};

/* eslint-disable max-lines-per-function */
export async function seed202512292045CreatePlans() {
  console.log('🌱 [202512292045] Seeding plans...');

  const plans = [
    {
      name: 'Starter',
      description: 'Plano ideal para começar',
      tier: PlanTier.STARTER,
      interval: PlanInterval.MONTHLY,
      price: 29.9,
      currency: 'BRL',
      intervalCount: 1,
      stripePriceId: STRIPE_PRICE_IDS.STARTER,
      stripeProductId: null, // Opcional: adicione se quiser
      trialDays: 7,
      features: {
        maxProducts: 50,
        maxImages: 5,
        storage: '1GB',
        support: 'Email',
        analytics: false,
        customDomain: false,
      },
      active: true,
    },
    {
      name: 'Pro',
      description: 'Plano ilimitado para conta única',
      tier: PlanTier.PRO,
      interval: PlanInterval.MONTHLY,
      price: 79.9,
      currency: 'BRL',
      intervalCount: 1,
      stripePriceId: STRIPE_PRICE_IDS.PRO,
      stripeProductId: null,
      trialDays: 14,
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
    },
    {
      name: 'Unlimited',
      description: 'Recursos ilimitados e multi lojas',
      tier: PlanTier.UNLIMITED,
      interval: PlanInterval.MONTHLY,
      price: 199.9,
      currency: 'BRL',
      intervalCount: 1,
      stripePriceId: STRIPE_PRICE_IDS.UNLIMITED,
      stripeProductId: null,
      trialDays: 14,
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
    },
  ];

  for (const planData of plans) {
    await prisma.plan.create({
      data: planData,
    });

    console.log(`   ✅ ${planData.name} (Stripe: ${planData.stripePriceId})`);
  }

  console.log('🎉 Plans seeded successfully with Stripe integration!');
}
