import { db } from "@/app/_lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const companyData = await db.company.findFirst({
      include: {
        companyAddress: true,
      },
    });

    console.log("company data: ", companyData);
    if (!companyData) {
      return NextResponse.json(
        { error: "No company data found" },
        { status: 404 },
      );
    }

    return NextResponse.json(companyData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 },
    );
  }
}
