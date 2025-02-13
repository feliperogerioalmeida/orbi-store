import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/_lib/prisma";
import { AccountType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const type = searchParams.get("type") as AccountType | undefined;
    const ids = searchParams.getAll("id");
    const parentCode = searchParams.get("parentCode");

    const where: {
      code?: string;
      type?: AccountType;
      id?: { in: string[] };
      parentCode?: string;
    } = {};

    if (code) where.code = code;
    if (type) where.type = type;
    if (ids.length > 0) where.id = { in: ids };
    if (parentCode) where.parentCode = parentCode;

    const accounts = await db.chartOfAccounts.findMany({
      where,
      orderBy: { code: "asc" },
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar contas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
