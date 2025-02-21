import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url);
    const id = pathname.split("/").pop();

    console.log(id);

    if (!id) {
      return NextResponse.json({
        status: 400,
        error: "ID não informado",
      });
    }

    const bank = await db.bank.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            movements: true,
          },
        },
      },
    });

    if (!bank) {
      return NextResponse.json({
        status: 404,
        error: "Banco não encontrado",
      });
    }

    if (bank.account.movements.length > 0) {
      return NextResponse.json({
        status: 400,
        error: "Não é possível excluir um banco com movimentações",
      });
    }

    await db.bank.delete({ where: { id } });
    await db.chartOfAccounts.delete({ where: { id: bank?.account.id } });

    return NextResponse.json({
      status: 200,
      message: "Banco excluído com sucesso",
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: "Erro interno do servidor",
      e,
    });
  }
}
