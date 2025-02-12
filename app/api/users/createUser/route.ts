import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type Role = "CLIENT" | "MASTER" | "ADMIN" | "EMPLOYEE";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para realizar essa ação." },
        { status: 401 },
      );
    }

    const {
      firstName,
      lastName,
      email,
      password,
      role: requestedRole,
      position,
    } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário com esse e-mail já existe." },
        { status: 400 },
      );
    }

    let role: Role = "CLIENT";

    if (requestedRole === "MASTER") {
      if (token.role !== "MASTER") {
        return NextResponse.json(
          {
            error:
              "Somente usuários MASTER podem criar um novo usuário MASTER.",
          },
          { status: 403 },
        );
      }

      const masterUser = await db.user.findFirst({ where: { role: "MASTER" } });
      if (masterUser) {
        return NextResponse.json(
          { error: "Já existe um usuário MASTER no sistema." },
          { status: 403 },
        );
      }

      role = "MASTER";
    } else if (requestedRole === "ADMIN") {
      if (token.role !== "MASTER") {
        return NextResponse.json(
          { error: "Somente usuários MASTER podem criar usuários ADMIN." },
          { status: 403 },
        );
      }

      role = "ADMIN";
    } else if (requestedRole === "EMPLOYEE") {
      if (!["MASTER", "ADMIN"].includes(token.role as string)) {
        return NextResponse.json(
          { error: "Somente MASTER ou ADMIN podem criar usuários EMPLOYEE." },
          { status: 403 },
        );
      }

      role = "EMPLOYEE";
    }

    const validPosition =
      role === "CLIENT" ? null : position || "Não especificado";

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        position: validPosition,
      },
    });

    return NextResponse.json({
      message: "Usuário criado com sucesso.",
      user: newUser,
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Ocorreu um erro ao criar o usuário. Tente novamente." },
      { status: 500 },
    );
  }
}
