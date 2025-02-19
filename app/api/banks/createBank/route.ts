import { db } from "@/app/_lib/prisma";
import { PaymentType, RateType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("data:", data);
    if (!data) {
      return NextResponse.json({
        status: 400,
        error: "Dados não informados",
      });
    }

    if (
      !data.name ||
      !data.initialBalance ||
      !data.initialBalanceDate ||
      data.isActive === undefined
    ) {
      throw new Error("Informe todos os campos obrigatórios");
    }

    data.name = data.name.toUpperCase();

    const existingBank = await db.bank.findFirst({
      where: {
        name: data.name.toUpperCase(),
      },
    });

    const existingCoa = await db.chartOfAccounts.findFirst({
      where: {
        name: data.name.toUpperCase(),
      },
    });

    if (existingBank || existingCoa) {
      return NextResponse.json({
        status: 400,
        error: "Banco já cadastrado",
      });
    }

    const parentAccount = await db.chartOfAccounts.findUnique({
      where: { code: "1.1.1" },
    });

    if (!parentAccount) {
      throw new Error("Conta contábil pai não encontrada.");
    }

    const accountCode = `${parentAccount.code}.${
      (await db.chartOfAccounts.count({
        where: { parentCode: parentAccount.code },
      })) + 1
    }`;

    console.log("🔹 Criando conta contábil...");
    const account = await db.chartOfAccounts.create({
      data: {
        code: accountCode,
        name: data.name.toUpperCase(),
        parentCode: "1.1.1",
        isAnalytical: true,
        type: "ASSET",
        balanceType: "DEBIT",
      },
    });
    console.log("✅ Conta contábil criada:", account);
    console.log("🔹 Criando banco...");

    const bank = await db.bank.create({
      data: {
        name: data.name.toUpperCase(),
        accountCode: account.code,
        initialBalance: data.initialBalance,
        initialBalanceDate: data.initialBalanceDate,
        isActive: data.isActive,
        formsOfReceiving: {
          create: data.formsOfReceiving.map(
            (method: {
              method: PaymentType;
              receiveTimeInDays: number;
              taxRate: number;
              typeOfRate: RateType | null | undefined;
              installments?: { installmentNumber: number; taxRate: number }[];
            }) => ({
              method: method.method,
              receiveTimeInDays: method.receiveTimeInDays,
              taxRate: method.taxRate,
              typeOfRate: method.typeOfRate,
              installments:
                method.method === "CREDIT_CARD" && method.installments
                  ? {
                      create: method.installments.map((installment) => ({
                        installmentNumber: installment.installmentNumber,
                        taxRate: installment.taxRate,
                      })),
                    }
                  : undefined,
            }),
          ),
        },
        formsOfPayment: {
          create: data.formsOfPayment.map(
            (method: {
              method: PaymentType;
              taxRate: number;
              typeOfRate: RateType | null | undefined;
            }) => ({
              method: method.method,
              taxRate: method.taxRate,
              typeOfRate: method.typeOfRate,
            }),
          ),
        },
      },
    });

    const newBank = await db.bank.findUnique({
      where: { id: bank.id },
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

    console.log("✅ Banco criado:", bank);

    return NextResponse.json({
      status: 201,
      newBank,
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: "Erro interno do servidor: ",
      e,
    });
  }
}
