/*
  Warnings:

  - You are about to alter the column `initialBalance` on the `Bank` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `taxRate` on the `Installment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `taxRate` on the `PaymentMethod` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `taxRate` on the `ReceivingMethod` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Bank" ALTER COLUMN "initialBalance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Installment" ALTER COLUMN "taxRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "taxRate" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ReceivingMethod" ALTER COLUMN "taxRate" SET DATA TYPE DOUBLE PRECISION;
