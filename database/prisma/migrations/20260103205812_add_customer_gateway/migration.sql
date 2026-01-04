-- CreateTable
CREATE TABLE "customer_gateways" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "externalCustomerId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_gateways_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "customer_gateways_userId_idx" ON "customer_gateways"("userId");

-- CreateIndex
CREATE INDEX "customer_gateways_gateway_externalCustomerId_idx" ON "customer_gateways"("gateway", "externalCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_gateways_userId_gateway_key" ON "customer_gateways"("userId", "gateway");

-- AddForeignKey
ALTER TABLE "customer_gateways" ADD CONSTRAINT "customer_gateways_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
