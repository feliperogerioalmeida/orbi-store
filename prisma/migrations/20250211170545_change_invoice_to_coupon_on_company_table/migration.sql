/*
  Warnings:

  - You are about to drop the column `invoiceSeries` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the column `lastInvoiceIssued` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "invoiceSeries",
DROP COLUMN "lastInvoiceIssued",
ADD COLUMN     "couponSeries" TEXT,
ADD COLUMN     "lastCouponIssued" TEXT;
