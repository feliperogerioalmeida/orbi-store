import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("id");

    const where: {
      id?: string;
    } = {};

    if (name) where.id = name;

    const banks = await db.bank.findMany({
      where,
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

    return NextResponse.json({
      status: 200,
      banks: banks,
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: "Erro interno do servidor: ",
      e,
    });
  }
}
