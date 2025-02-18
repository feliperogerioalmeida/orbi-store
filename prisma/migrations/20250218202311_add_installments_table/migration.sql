-- CreateTable
CREATE TABLE "Installment" (
    "id" TEXT NOT NULL,
    "receivingMethodId" TEXT NOT NULL,
    "installmentNumber" INTEGER NOT NULL,
    "taxRate" DECIMAL(65,30) NOT NULL,
    "typeOfRate" "RateType" NOT NULL DEFAULT 'PERCENTAGE',

    CONSTRAINT "Installment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_receivingMethodId_fkey" FOREIGN KEY ("receivingMethodId") REFERENCES "ReceivingMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
