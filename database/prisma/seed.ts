import { PrismaClient } from '@prisma/client';
import { seed202512292045CreatePlans } from './seeds/202512292045_create_plans.seed';

const prisma = new PrismaClient();

/**
 * Executa um seed de forma idempotente.
 * Só roda se ainda não tiver sido executado.
 */
async function runSeed(name: string, seedFunction: () => Promise<void>) {
  const executed = await prisma.seed.findUnique({
    where: { name },
  });

  if (executed) {
    console.log(`⏭️  Seed "${name}" already executed. Skipping...`);
    return;
  }

  console.log(`🌱 Running seed "${name}"...`);
  await seedFunction();

  await prisma.seed.create({
    data: { name },
  });

  console.log(`✅ Seed "${name}" completed.`);
}

async function main() {
  console.log('🚀 [START] Database Seeding...');

  /**
   * 🔐 BOOTSTRAP CRÍTICO
   * Garante que a tabela _seeds exista ANTES de qualquer uso do Prisma Client.
   * Isso evita o erro P2021 após migrate reset.
   */
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_seeds" (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      "executedAt" TIMESTAMP DEFAULT NOW()
    )
  `);

  /**
   * 👉 Registre seus seeds aqui
   * A ordem importa se houver dependências
   */
  await runSeed('202512292045_create_plans', seed202512292045CreatePlans);

  console.log('🏁 [FINISHED] All seeds processed.');
}

main()
  .catch((error) => {
    console.error('❌ [ERROR] Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
