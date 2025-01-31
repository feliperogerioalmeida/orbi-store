import { db } from "@/app/_lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Você precisa estar autenticado para realizar essa ação." },
        { status: 401 },
      );
    }

    const { id, data } = await req.json();

    if (!id || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: "O ID do usuário e os dados são obrigatórios." },
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

    // Não permitir atualização do próprio papel
    if (userToUpdate.role === "MASTER" && userToUpdate.id === token.sub) {
      return NextResponse.json(
        { error: "Você não pode alterar seu próprio papel." },
        { status: 403 },
      );
    }

    // Regras para alteração de senha
    if ("password" in data) {
      if (token.role !== "MASTER") {
        return NextResponse.json(
          { error: "Somente usuários MASTER podem alterar senhas." },
          { status: 403 },
        );
      }

      data.password = await bcrypt.hash(data.password, 12);
    }

    // Regras para alteração de role
    if ("role" in data && data.role !== userToUpdate.role) {
      // Apenas MASTER pode alterar papéis para ADMIN, EMPLOYEE ou CLIENT
      if (
        !(
          token.role === "MASTER" ||
          (token.role === "ADMIN" &&
            userToUpdate.role === "EMPLOYEE" &&
            data.role === "EMPLOYEE")
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Somente MASTER ou ADMIN podem alterar papéis de usuários, com restrições para EMPLOYEE.",
          },
          { status: 403 },
        );
      }

      // Restringir alteração para CLIENT apenas para MASTER
      if (data.role === "CLIENT" && token.role !== "MASTER") {
        return NextResponse.json(
          { error: "Somente MASTER pode alterar papéis para CLIENT." },
          { status: 403 },
        );
      }

      // ADMIN pode alterar apenas EMPLOYEE para EMPLOYEE
      if (
        token.role === "ADMIN" &&
        userToUpdate.role === "EMPLOYEE" &&
        data.role !== "EMPLOYEE"
      ) {
        return NextResponse.json(
          {
            error: "ADMIN só pode alterar papéis de EMPLOYEE para EMPLOYEE.",
          },
          { status: 403 },
        );
      }
    }

    // Verificar se as chaves do body são válidas
    const validFields = Object.keys(data).filter((key) =>
      ["firstName", "lastName", "role", "position", "password"].includes(key),
    );

    if (validFields.length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo válido para atualizar foi fornecido." },
        { status: 400 },
      );
    }

    // Construir o objeto de atualização dinâmico
    const updateData = validFields.reduce(
      (acc: { [key: string]: string | number }, key) => {
        acc[key] = data[key];
        return acc;
      },
      {},
    );

    // Atualizar o usuário no banco de dados
    const updatedUser = await db.user.update({
      where: { id },
      data: updateData,
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
