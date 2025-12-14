/*
  Warnings:

  - A unique constraint covering the columns `[document]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SELLER', 'MANAGER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "cellPhone" TEXT,
ADD COLUMN     "document" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "code" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phone_verifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "email_verifications_userId_idx" ON "email_verifications"("userId");

-- CreateIndex
CREATE INDEX "email_verifications_token_idx" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "email_verifications_expiresAt_idx" ON "email_verifications"("expiresAt");

-- CreateIndex
CREATE INDEX "phone_verifications_userId_idx" ON "phone_verifications"("userId");

-- CreateIndex
CREATE INDEX "phone_verifications_phone_idx" ON "phone_verifications"("phone");

-- CreateIndex
CREATE INDEX "phone_verifications_code_idx" ON "phone_verifications"("code");

-- CreateIndex
CREATE INDEX "phone_verifications_expiresAt_idx" ON "phone_verifications"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_document_key" ON "users"("document");

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_verifications" ADD CONSTRAINT "phone_verifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
