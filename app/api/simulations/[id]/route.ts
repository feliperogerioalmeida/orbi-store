import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const simulationId = pathname.split("/").pop(); // Extrai o ID da simulação da URL

    if (!simulationId) {
      return NextResponse.json(
        { error: "ID da simulação não foi fornecido." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário não foi fornecido." },
        { status: 400 },
      );
    }

    console.log(
      `Atualizando simulação ${simulationId} para o usuário ${userId}`,
    );

    const updatedSimulation = await db.simulation.update({
      where: { id: simulationId },
      data: { userId },
    });

    return NextResponse.json(updatedSimulation, { status: 200 });
  } catch (error) {
    console.error("Erro ao vincular simulação:", error);
    return NextResponse.json(
      { error: "Erro ao vincular simulação. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
