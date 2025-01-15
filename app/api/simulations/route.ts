import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse do corpo da requisição
    const body = await request.json();

    const {
      userId,
      model,
      color,
      capacity,
      batteryHealth,
      issues,
      estimatedValue,
    } = body;

    // Validação de campos obrigatórios
    if (
      !model ||
      !color ||
      !capacity ||
      !batteryHealth ||
      estimatedValue === undefined
    ) {
      console.error("Campos obrigatórios faltando no payload:", body);
      return NextResponse.json(
        { error: "Campos obrigatórios estão faltando no payload." },
        { status: 400 },
      );
    }

    // Garantir que `issues` seja uma string JSON válida
    const issuesToSave = Array.isArray(issues) ? JSON.stringify(issues) : "[]";

    // Log do payload antes de salvar no banco
    const payload = {
      userId: userId || null,
      model,
      color,
      capacity,
      batteryHealth,
      issues: issuesToSave,
      estimatedValue,
    };
    console.log("Dados preparados para salvar no banco:", payload);

    // Tentativa de criar a simulação no banco de dados
    const simulation = await db.simulation.create({
      data: payload,
    });

    console.log("Simulação salva com sucesso no banco:", simulation);

    // Retorna a simulação salva
    return NextResponse.json(simulation, { status: 201 });
  } catch (error: unknown) {
    // Verifica se o erro é relacionado ao Prisma
    if (error instanceof Error) {
      console.error("Erro específico do Prisma:", error.message);
    }

    // Log detalhado do erro
    console.error("Erro ao salvar simulação no banco de dados:", error);

    // Retorna mensagem de erro ao cliente
    return NextResponse.json(
      { error: "Erro ao salvar simulação. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
