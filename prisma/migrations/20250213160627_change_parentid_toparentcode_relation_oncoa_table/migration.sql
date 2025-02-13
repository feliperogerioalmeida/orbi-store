/*
  Warnings:

  - You are about to drop the column `parentId` on the `ChartOfAccounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChartOfAccounts" DROP CONSTRAINT "ChartOfAccounts_parentId_fkey";

-- AlterTable
ALTER TABLE "ChartOfAccounts" DROP COLUMN "parentId",
ADD COLUMN     "parentCode" TEXT;

-- AddForeignKey
ALTER TABLE "ChartOfAccounts" ADD CONSTRAINT "ChartOfAccounts_parentCode_fkey" FOREIGN KEY ("parentCode") REFERENCES "ChartOfAccounts"("code") ON DELETE SET NULL ON UPDATE CASCADE;
