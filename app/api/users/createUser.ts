import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";
import { requireMaster } from "@/app/_lib/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  const masterCheck = await requireMaster(req as NextRequest);
  if (masterCheck) return masterCheck;

  const { firstName, lastName, email, password } = await req.json();

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios." },
      { status: 400 },
    );
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "Usuário já existe." }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await db.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  });

  return NextResponse.json({
    message: "Usuário criado com sucesso.",
    user: newUser,
  });
}
