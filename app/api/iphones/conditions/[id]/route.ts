import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "O ID da condição não foi fornecido." },
      { status: 400 },
    );
  }

  try {
    // Obtendo o corpo da requisição
    const body = await request.json();

    const { costPrice, sellingPrice, maxUpgradePrice } = body;

    // Validando os dados recebidos
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

    // Atualizando a condição no banco de dados
    const updatedCondition = await db.condition.update({
      where: { id },
      data: {
        costPrice,
        sellingPrice,
        maxUpgradePrice,
      },
    });

    // Retornando a resposta de sucesso
    return NextResponse.json(updatedCondition, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar a condição:", error);

    // Retornando a resposta de erro genérico
    return NextResponse.json(
      { error: "Erro ao atualizar a condição no banco de dados." },
      { status: 500 },
    );
  }
}
