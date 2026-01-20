/*
  Warnings:

  - The values [default,electronics,pets,fashion,beauty,sports,food,books,home,kids,automotive] on the enum `ThemeStore` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ThemeStore_new" AS ENUM ('DEFAULT', 'MODERN', 'MINIMAL', 'VINTAGE', 'BOLD', 'CLASSIC');
ALTER TABLE "public"."stores" ALTER COLUMN "themeStore" DROP DEFAULT;
ALTER TABLE "stores" ALTER COLUMN "themeStore" TYPE "ThemeStore_new" USING ("themeStore"::text::"ThemeStore_new");
ALTER TYPE "ThemeStore" RENAME TO "ThemeStore_old";
ALTER TYPE "ThemeStore_new" RENAME TO "ThemeStore";
DROP TYPE "public"."ThemeStore_old";
ALTER TABLE "stores" ALTER COLUMN "themeStore" SET DEFAULT 'DEFAULT';
COMMIT;

-- AlterTable
ALTER TABLE "stores" ALTER COLUMN "themeStore" SET DEFAULT 'DEFAULT';
