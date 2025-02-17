-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BILL', 'CASH');

-- CreateEnum
CREATE TYPE "RateType" AS ENUM ('PERCENTAGE', 'CASH');

-- CreateTable
CREATE TABLE "Bank" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "initialBalance" DECIMAL(65,30) NOT NULL,
    "initialBalanceDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivingMethod" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "method" "PaymentType" NOT NULL,
    "receiveTimeInDays" INTEGER NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "typeOfRate" "RateType",

    CONSTRAINT "ReceivingMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "method" "PaymentType" NOT NULL,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "typeOfRate" "RateType",

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bank_name_key" ON "Bank"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Bank_accountCode_key" ON "Bank"("accountCode");

-- AddForeignKey
ALTER TABLE "Bank" ADD CONSTRAINT "Bank_accountCode_fkey" FOREIGN KEY ("accountCode") REFERENCES "ChartOfAccounts"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivingMethod" ADD CONSTRAINT "ReceivingMethod_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "Bank"("id") ON DELETE CASCADE ON UPDATE CASCADE;
