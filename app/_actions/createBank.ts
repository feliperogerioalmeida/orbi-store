"use server";

import { db } from "@/app/_lib/prisma";
import { PaymentType, RateType } from "@prisma/client";

interface BankInput {
  name: string;
  initialBalance: number;
  initialBalanceDate: Date;
  formsOfReceiving?: {
    method: PaymentType;
    receiveTimeInDays?: number;
    taxRate?: number;
    typeOfRate?: RateType;
  }[];
  formsOfPayment?: {
    method: PaymentType;
    taxRate?: number;
    typeOfRate?: RateType;
  }[];
}

export async function createBank({
  name,
  initialBalance,
  initialBalanceDate,
  formsOfReceiving = [],
  formsOfPayment = [],
}: BankInput) {
  try {
    const parentAccount = await db.chartOfAccounts.findUnique({
      where: { code: "1.1.1" },
    });

    if (!parentAccount) {
      return {
        error: "Conta contábil 'Caixa e Equivalente de Caixa' não encontrada.",
      };
    }

    const accountCode = `${parentAccount.code}.${(await db.chartOfAccounts.count({ where: { parentCode: parentAccount.code } })) + 1}`;

    const newAccount = await db.chartOfAccounts.create({
      data: {
        name,
        code: accountCode,
        type: "ASSET",
        balanceType: "DEBIT",
        isAnalytical: true,
        parentCode: parentAccount.code,
        balance: initialBalance,
      },
    });

    const newBank = await db.bank.create({
      data: {
        name,
        accountCode: newAccount.code,
        initialBalance,
        initialBalanceDate,
        isActive: true,
        formsOfReceiving: {
          create: formsOfReceiving.map((r) => ({
            method: r.method,
            receiveTimeInDays: r.receiveTimeInDays ?? 0,
            taxRate: r.taxRate ?? 0,
            typeOfRate: r.typeOfRate ?? null,
          })),
        },
        formsOfPayment: {
          create: formsOfPayment.map((p) => ({
            method: p.method,
            taxRate: p.taxRate ?? 0,
            typeOfRate: p.typeOfRate ?? null,
          })),
        },
      },
    });

    return {
      success: "Banco criado com sucesso!",
      bank: newBank,
      account: newAccount,
    };
  } catch (error) {
    console.error("Erro ao criar banco:", error);
    return { error: "Erro interno ao criar o banco." };
  }
}
