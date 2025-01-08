import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const iphones = await prisma.iPhone.findMany({
      include: {
        colors: true,
        capacities: true,
      },
    });

    return NextResponse.json({ iphones });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch iPhones" },
      { status: 500 },
    );
  }
}
