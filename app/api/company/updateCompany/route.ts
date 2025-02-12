import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/app/_lib/prisma";
import { authOptions } from "@/app/_lib/auth";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = session.user.role;

    if (userRole !== "MASTER" && userRole !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to update this company.",
        },
        { status: 403 },
      );
    }

    const { id, data } = await req.json();

    if (!id || !data) {
      return NextResponse.json(
        { error: "Missing company ID or data" },
        { status: 400 },
      );
    }

    const { companyAddress, ...companyData } = data;

    const updatedCompany = await db.company.update({
      where: { id },
      data: companyData,
    });

    if (companyAddress) {
      const existingAddress = await db.companyAddress.findUnique({
        where: { companyId: id },
      });

      if (existingAddress) {
        await db.companyAddress.update({
          where: { companyId: id },
          data: companyAddress,
        });
      } else {
        await db.companyAddress.create({
          data: {
            ...companyAddress,
            companyId: id,
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Company updated successfully",
        company: updatedCompany,
        companyAddress: companyAddress,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Failed to update company" },
      { status: 500 },
    );
  }
}
