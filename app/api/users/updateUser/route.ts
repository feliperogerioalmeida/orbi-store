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

    console.log("Payload recebido na rota:", { id, data });
    // Validação de ID e dados
    if (!id || !data || typeof data !== "object") {
      return NextResponse.json(
        { error: "O ID do usuário e os dados são obrigatórios." },
        { status: 400 },
      );
    }

    const userToUpdate = await db.user.findUnique({
      where: { id },
      include: { address: true },
    });

    if (!userToUpdate) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 },
      );
    }

    // Impedir alteração de papel do próprio usuário
    if (userToUpdate.role === "MASTER" && userToUpdate.id === token.sub) {
      return NextResponse.json(
        { error: "Você não pode alterar seu próprio papel." },
        { status: 403 },
      );
    }

    // Atualizar senha
    if ("password" in data) {
      if (token.role !== "MASTER") {
        return NextResponse.json(
          { error: "Somente usuários MASTER podem alterar senhas." },
          { status: 403 },
        );
      }

      data.password = await bcrypt.hash(data.password, 12);
    }

    // Validação e restrições de papel
    if ("role" in data && data.role !== userToUpdate.role) {
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

      if (data.role === "CLIENT" && token.role !== "MASTER") {
        return NextResponse.json(
          { error: "Somente MASTER pode alterar papéis para CLIENT." },
          { status: 403 },
        );
      }

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

    // Validação de endereço se for enviado
    if (data.address) {
      const requiredFields = [
        "street",
        "number",
        "city",
        "neighborhood",
        "zipCode",
        "state",
        "country",
      ];

      const missingFields = requiredFields.filter(
        (field) => !data.address[field],
      );

      if (missingFields.length > 0) {
        return NextResponse.json(
          {
            error: `Campos obrigatórios do endereço ausentes: ${missingFields.join(
              ", ",
            )}`,
          },
          { status: 400 },
        );
      }
    }

    // Preparar dados para atualização
    const validFields = [
      "firstName",
      "lastName",
      "role",
      "position",
      "password",
      "phoneNumber",
      "cpf",
      "pixKey",
    ];
    const updateData: Record<string, unknown> = {};

    validFields.forEach((field) => {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    });

    // Atualizar endereço se enviado
    if (data.address) {
      const addressUpdate = {
        street: data.address.street,
        number: data.address.number,
        city: data.address.city,
        neighborhood: data.address.neighborhood,
        zipCode: data.address.zipCode,
        state: data.address.state,
        country: data.address.country,
        complement: data.address.complement || null,
      };

      if (userToUpdate.address?.id) {
        await db.address.update({
          where: { id: userToUpdate.address.id },
          data: addressUpdate,
        });
      } else {
        const newAddress = await db.address.create({
          data: {
            ...addressUpdate,
            userId: id,
          },
        });

        updateData.addressId = newAddress.id;
      }
    }

    // Atualizar usuário no banco de dados
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
