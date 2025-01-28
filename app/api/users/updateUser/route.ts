import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para realizar essa ação." },
        { status: 401 },
      );
    }

    const { id, firstName, lastName, role } = await req.json();

    if (!id || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 },
      );
    }

    const userToUpdate = await db.user.findUnique({ where: { id } });

    if (!userToUpdate) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    if (userToUpdate.role === "MASTER" && userToUpdate.id === token.sub) {
      return NextResponse.json(
        { error: "Você não pode alterar seu próprio papel." },
        { status: 403 },
      );
    }

    if (role && role !== userToUpdate.role) {
      if (token.role !== "MASTER") {
        return NextResponse.json(
          {
            error:
              "Somente usuários MASTER podem alterar papéis para ADMIN, EMPLOYEE ou CLIENT.",
          },
          { status: 403 },
        );
      }

      if (
        userToUpdate.role === "EMPLOYEE" &&
        !["ADMIN", "MASTER"].includes(token.role)
      ) {
        return NextResponse.json(
          {
            error:
              "Somente usuários ADMIN ou MASTER podem alterar papéis de EMPLOYEE.",
          },
          { status: 403 },
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        ...(role ? { role } : {}),
      },
    });

    return NextResponse.json({
      message: "Usuário atualizado com sucesso.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar o usuário. Tente novamente." },
      { status: 500 },
    );
  }
}
