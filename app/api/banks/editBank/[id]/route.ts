import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;
    const data = await req.json();

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

    const editedBank = await db.bank.update({
      where: { id },
      data: {
        name: data.name ? data.name.toUpperCase() : undefined,
        initialBalance: data.initialBalance,
        initialBalanceDate: data.initialBalanceDate
          ? new Date(data.initialBalanceDate)
          : undefined,
        isActive: data.isActive,

        // Atualiza os métodos de recebimento sem remover os existentes
        formsOfReceiving: {
          upsert: data.formsOfReceiving?.map(
            (method: {
              method: string;
              receiveTimeInDays: number;
              taxRate: number;
              typeOfRate: string;
              installments?: { installmentNumber: number; taxRate: number }[];
            }) => ({
              where: {
                bankId_method: { bankId: id, method: method.method },
              },
              update: {
                receiveTimeInDays: method.receiveTimeInDays,
                taxRate: method.taxRate,
                typeOfRate: method.typeOfRate,
                installments:
                  method.method === "CREDIT_CARD" && method.installments
                    ? {
                        upsert: method.installments.map(
                          (installment: {
                            installmentNumber: number;
                            taxRate: number;
                          }) => ({
                            where: {
                              receivingMethodId_installmentNumber: {
                                receivingMethodId: id,
                                installmentNumber:
                                  installment.installmentNumber,
                              },
                            },
                            update: { taxRate: installment.taxRate },
                            create: {
                              receivingMethodId: id,
                              installmentNumber: installment.installmentNumber,
                              taxRate: installment.taxRate,
                            },
                          }),
                        ),
                      }
                    : undefined,
              },
              create: {
                bankId: id,
                method: method.method,
                receiveTimeInDays: method.receiveTimeInDays,
                taxRate: method.taxRate,
                typeOfRate: method.typeOfRate,
                installments:
                  method.method === "CREDIT_CARD" && method.installments
                    ? {
                        create: method.installments.map(
                          (installment: {
                            installmentNumber: number;
                            taxRate: number;
                          }) => ({
                            receivingMethodId: id,
                            installmentNumber: installment.installmentNumber,
                            taxRate: installment.taxRate,
                          }),
                        ),
                      }
                    : undefined,
              },
            }),
          ),
        },

        // Atualiza ou cria os métodos de pagamento sem remover os existentes
        formsOfPayment: {
          upsert: data.formsOfPayment?.map(
            (method: {
              method: string;
              taxRate: number;
              typeOfRate: string;
            }) => ({
              where: {
                bankId_method: { bankId: id, method: method.method },
              },
              update: {
                taxRate: method.taxRate,
                typeOfRate: method.typeOfRate,
              },
              create: {
                bankId: id,
                method: method.method,
                taxRate: method.taxRate,
                typeOfRate: method.typeOfRate,
              },
            }),
          ),
        },

        // Atualiza a conta vinculada sem remover dados anteriores
        account: data.account
          ? {
              update: {
                name: data.name.toUpperCase(),
              },
            }
          : undefined,
      },

      // Inclui os relacionamentos no retorno
      include: {
        formsOfReceiving: { include: { installments: true } },
        formsOfPayment: true,
        account: { include: { movements: true } },
      },
    });
    return NextResponse.json({
      status: 200,
      bank: editedBank,
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: "Erro interno do servidor: ",
      e,
    });
  }
}
