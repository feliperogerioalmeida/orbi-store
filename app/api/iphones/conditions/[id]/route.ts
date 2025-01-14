import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const id = pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "O ID da condição não foi fornecido." },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const { costPrice, sellingPrice, maxUpgradePrice } = body;

    if (
      typeof costPrice !== "number" ||
      typeof sellingPrice !== "number" ||
      typeof maxUpgradePrice !== "number"
    ) {
      return NextResponse.json(
        { error: "Os valores enviados devem ser números válidos." },
        { status: 400 },
      );
    }

    const updatedCondition = await db.condition.update({
      where: { id },
      data: {
        costPrice,
        sellingPrice,
        maxUpgradePrice,
      },
    });

    console.log("Atualização bem-sucedida:", updatedCondition);

    return NextResponse.json(updatedCondition, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar a condição:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar a condição no banco de dados." },
      { status: 500 },
    );
  }
}
