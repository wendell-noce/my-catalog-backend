-- DropIndex
DROP INDEX "subscriptions_userId_status_idx";

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "stripeItemId" TEXT,
ADD COLUMN     "stripePriceId" TEXT;
