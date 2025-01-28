import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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

    const issuesToSave = Array.isArray(issues) ? JSON.stringify(issues) : "[]";

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

    const simulation = await db.simulation.create({
      data: payload,
    });

    console.log("Simulação salva com sucesso no banco:", simulation);

    return NextResponse.json(simulation, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro específico do Prisma:", error.message);
    }

    console.error("Erro ao salvar simulação no banco de dados:", error);

    return NextResponse.json(
      { error: "Erro ao salvar simulação. Tente novamente mais tarde." },
      { status: 500 },
    );
  }
}
