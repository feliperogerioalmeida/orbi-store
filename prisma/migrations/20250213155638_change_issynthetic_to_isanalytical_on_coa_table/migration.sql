/*
  Warnings:

  - You are about to drop the column `isSynthetic` on the `ChartOfAccounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChartOfAccounts" DROP COLUMN "isSynthetic",
ADD COLUMN     "isAnalytical" BOOLEAN NOT NULL DEFAULT false;
