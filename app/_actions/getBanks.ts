"use server";

import { db } from "@/app/_lib/prisma";

export async function getBanks() {
  const banks = await db.bank.findMany({
    orderBy: { name: "asc" },
    include: {
      formsOfReceiving: true,
      formsOfPayment: true,
    },
  });

  return banks.map((bank) => ({
    id: bank.id,
    name: bank.name,
    formsOfReceiving: Object.keys(bank.formsOfReceiving || {}).filter(
      (method) =>
        (
          bank.formsOfReceiving as unknown as Record<
            string,
            { isActive: boolean }
          >
        )[method].isActive,
    ),
    formsOfPayment: Object.keys(bank.formsOfPayment || {}).filter(
      (method) =>
        (
          bank.formsOfPayment as unknown as Record<
            string,
            { isActive: boolean }
          >
        )[method].isActive,
    ),
  }));
}
