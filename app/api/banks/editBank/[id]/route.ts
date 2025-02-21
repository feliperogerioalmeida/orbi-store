import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    const data = await req.json();
    console.log("data:", data);
    if (!id) {
      return {
        status: 400,
        error: "ID não informado",
      };
    }

    if (data.name) {
      data.name = data.name.toUpperCase();

      if (data.account) {
        data.account = { ...data.account, name: data.name };
      } else {
        data.account = { name: data.name };
      }
    }

    const receivingMethods = await db.receivingMethod.findMany({
      where: { bankId: id },
      select: { id: true },
    });

    const receivingMethodIds = receivingMethods.map((method) => method.id);

    console.log("🔹 Excluindo installments dos métodos:", receivingMethodIds);

    await db.installment.deleteMany({
      where: {
        receivingMethodId: { in: receivingMethodIds },
      },
    });

    await db.receivingMethod.deleteMany({ where: { bankId: id } });

    console.log("🔹 Excluindo paymentMethods antigos...");
    await db.paymentMethod.deleteMany({ where: { bankId: id } });

    console.log("Atualizando banco...");
    await db.bank.update({
      where: { id },
      data: {
        name: data.name.toUpperCase(),
        initialBalance: data.initialBalance,
        initialBalanceDate: data.initialBalanceDate
          ? new Date(data.initialBalanceDate)
          : undefined,
        isActive: data.isActive,

        account: data.account
          ? {
              update: {
                name: data.name.toUpperCase(),
              },
            }
          : undefined,
      },
      include: {
        account: true,
      },
    });

    console.log("🔹 Criando novos métodos de recebimento...");
    if (data.formsOfReceiving?.length) {
      await db.receivingMethod.createMany({
        data: data.formsOfReceiving.map(
          (method: {
            method: string;
            receiveTimeInDays: number;
            taxRate: number;
            typeOfRate: string;
            installments?: { installmentNumber: number; taxRate: number }[];
          }) => ({
            bankId: id,
            method: method.method,
            receiveTimeInDays: method.receiveTimeInDays,
            taxRate: method.taxRate,
            typeOfRate: method.typeOfRate,
          }),
        ),
      });
    }

    console.log("🔹 Criando novos métodos de pagamento...");
    if (data.formsOfPayment?.length) {
      await db.paymentMethod.createMany({
        data: data.formsOfPayment.map(
          (method: {
            method: string;
            taxRate: number;
            typeOfRate: string;
          }) => ({
            bankId: id,
            method: method.method,
            taxRate: method.taxRate,
            typeOfRate: method.typeOfRate,
          }),
        ),
      });
    }

    console.log("🔹 Buscando IDs dos novos métodos de recebimento...");
    const updatedReceivingMethods = await db.receivingMethod.findMany({
      where: { bankId: id },
      select: { id: true, method: true },
    });

    const methodIdMap: Record<string, string> = updatedReceivingMethods.reduce(
      (acc: Record<string, string>, method) => {
        acc[method.method] = method.id;
        return acc;
      },
      {},
    );

    console.log("🔹 Criando installments para CREDIT_CARD...");
    for (const method of data.formsOfReceiving || []) {
      if (method.method === "CREDIT_CARD" && method.installments?.length) {
        for (const installment of method.installments) {
          await db.installment.create({
            data: {
              receivingMethodId: methodIdMap["CREDIT_CARD"],
              installmentNumber: installment.installmentNumber,
              taxRate: installment.taxRate,
            },
          });
        }
      }
    }

    const updatedBank = await db.bank.findUnique({
      where: { id },
      include: {
        account: true,
        formsOfReceiving: {
          include: { installments: true },
        },
        formsOfPayment: true,
      },
    });

    return NextResponse.json({
      status: 200,
      bank: updatedBank,
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: "Erro interno do servidor: ",
      e,
    });
  }
}
