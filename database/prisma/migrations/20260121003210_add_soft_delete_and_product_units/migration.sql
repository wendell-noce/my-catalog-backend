/*
  Warnings:

  - The `unit` column on the `inventory_items` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `price` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `discount` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[inventoryItemId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Made the column `discount` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ProductUnit" AS ENUM ('UN', 'KG', 'GR', 'LT', 'ML', 'MT', 'CM', 'CX', 'PC', 'PAR', 'KIT');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "inventory_items" DROP COLUMN "unit",
ADD COLUMN     "unit" "ProductUnit" NOT NULL DEFAULT 'UN';

-- AlterTable
ALTER TABLE "product_images" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_reviews" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "product_tags" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "inventoryItemId" TEXT,
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ADD COLUMN     "unit" "ProductUnit" NOT NULL DEFAULT 'UN',
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "discount" SET NOT NULL,
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE UNIQUE INDEX "products_inventoryItemId_key" ON "products"("inventoryItemId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
