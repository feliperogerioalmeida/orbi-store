"use server";

import { db } from "@/app/_lib/prisma";

const paymentMethodMap: Record<string, string> = {
  PIX: "Pix",
  BILL: "Boleto",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  CASH: "Dinheiro",
};

export async function getBanks() {
  const banks = await db.bank.findMany({
    orderBy: { name: "asc" },
    include: {
      formsOfReceiving: true,
      formsOfPayment: true,
      account: {
        include: {
          movements: true,
        },
      },
    },
  });

  return banks.map((bank) => ({
    id: bank.id,
    name: bank.name,
    formsOfReceiving: bank.formsOfReceiving
      .map((r) => ({ method: paymentMethodMap[r.method] || r.method }))
      .sort((a, b) => a.method.localeCompare(b.method)),
    formsOfPayment: bank.formsOfPayment
      .map((p) => ({ method: paymentMethodMap[p.method] || p.method }))
      .sort((a, b) => a.method.localeCompare(b.method)),
    hasMovements: bank.account.movements.length > 0,
  }));
}
