import { NextRequest, NextResponse } from "next/server";
import { AccountType, BalanceType } from "@prisma/client";
import { db } from "@/app/_lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, type, balanceType, parentCode } = await req.json();

    if (!name || !type || !balanceType) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 },
      );
    }

    let generatedCode: string;

    if (!parentCode) {
      const lastRootAccount = await db.chartOfAccounts.findFirst({
        where: { parentCode: null },
        orderBy: { code: "desc" },
      });

      const nextNumber = lastRootAccount
        ? parseInt(lastRootAccount.code) + 1
        : 1;

      generatedCode = nextNumber.toString();
    } else {
      const parentAccount = await db.chartOfAccounts.findUnique({
        where: { code: parentCode },
      });

      if (!parentAccount) {
        return NextResponse.json(
          { error: `Conta pai ${parentCode} não encontrada.` },
          { status: 400 },
        );
      }

      const lastChildAccount = await db.chartOfAccounts.findFirst({
        where: { parentCode: parentAccount.code },
        orderBy: { code: "desc" },
      });

      const nextSubNumber = lastChildAccount
        ? parseInt(lastChildAccount.code.split(".").pop()!) + 1
        : 1;

      generatedCode = `${parentAccount.code}.${nextSubNumber}`;
    }

    const newAccount = await db.chartOfAccounts.create({
      data: {
        name,
        code: generatedCode,
        type: type as AccountType,
        balanceType: balanceType as BalanceType,
        isAnalytical: true,
        parentCode: parentCode || null,
        balance: 0,
      },
    });

    if (parentCode) {
      await db.chartOfAccounts.update({
        where: { code: parentCode },
        data: { isAnalytical: false },
      });
    }

    return NextResponse.json(
      { message: "Conta criada com sucesso.", account: newAccount },
      { status: 201 },
    );
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
