/*
  Warnings:

  - You are about to drop the column `currentPlanTier` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStatus` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_subscriptionStatus_idx";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "currentPlanTier",
DROP COLUMN "subscriptionStatus";
