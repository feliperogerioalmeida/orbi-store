import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

type Role = "CLIENT" | "MASTER" | "ADMIN" | "EMPLOYEE";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Verifica se o token é válido
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
    } = await req.json();

    // Verifica se todos os campos obrigatórios foram fornecidos
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 },
      );
    }

    // Verifica se o usuário já existe
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário com esse e-mail já existe." },
        { status: 400 },
      );
    }
    let role: Role = "CLIENT";

    // Valida e ajusta o role, se necessário
    if (requestedRole === "MASTER") {
      // Apenas usuários MASTER podem criar outro MASTER
      if (token.role !== "MASTER") {
        return NextResponse.json(
          {
            error:
              "Somente usuários MASTER podem criar um novo usuário MASTER.",
          },
          { status: 403 },
        );
      }

      // Verifica se já existe um MASTER no banco
      const masterUser = await db.user.findFirst({ where: { role: "MASTER" } });
      if (masterUser) {
        return NextResponse.json(
          { error: "Já existe um usuário MASTER no sistema." },
          { status: 403 },
        );
      }

      role = "MASTER";
    } else if (requestedRole === "ADMIN") {
      // Apenas MASTER pode criar usuários ADMIN
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

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Criação do novo usuário no banco
    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
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
