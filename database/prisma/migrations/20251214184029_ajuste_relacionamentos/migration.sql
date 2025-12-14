/*
  Warnings:

  - You are about to drop the column `userId` on the `linktrees` table. All the data in the column will be lost.
  - Added the required column `storeId` to the `linktrees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "linktrees" DROP CONSTRAINT "linktrees_userId_fkey";

-- AlterTable
ALTER TABLE "linktrees" DROP COLUMN "userId",
ADD COLUMN     "storeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "linktrees" ADD CONSTRAINT "linktrees_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
