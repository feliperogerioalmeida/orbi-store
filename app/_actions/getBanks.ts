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
      formsOfReceiving: {
        include: {
          installments: true,
        },
      },
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
    initialBalance: bank.initialBalance?.toFixed(2) || "0.00",
    initialBalanceDate: bank.initialBalanceDate
      ? bank.initialBalanceDate.toISOString()
      : null,
    isActive: bank.isActive,
    formsOfReceiving: bank.formsOfReceiving
      .map((r) => ({
        method: paymentMethodMap[r.method] || r.method,
        taxRate: r.taxRate?.toFixed(2) || "0.00",
        typeOfRate: r.typeOfRate || "",
        receiveTime: r.receiveTimeInDays?.toString() || "0",
      }))
      .sort((a, b) => a.method.localeCompare(b.method)),
    formsOfPayment: bank.formsOfPayment
      .map((p) => ({
        method: paymentMethodMap[p.method] || p.method,
        taxRate: p.taxRate?.toFixed(2) || "0.00",
        typeOfRate: p.typeOfRate || "",
      }))
      .sort((a, b) => a.method.localeCompare(b.method)),
    hasMovements: bank.account.movements.length > 0,
  }));
}
