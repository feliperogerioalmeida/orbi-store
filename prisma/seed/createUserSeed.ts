import "dotenv/config";

import { db } from "@/app/_lib/prisma";
import bcrypt from "bcrypt";

async function createMasterUser() {
  try {
    const hashedPassword = await bcrypt.hash("password", 12);

    const user = await db.user.create({
      data: {
        firstName: "User",
        lastName: "Master",
        email: "master@master.com",
        password: hashedPassword,
        role: "MASTER",
      },
    });

    console.log("Usuário criado com sucesso:", user);
  } catch (error) {
    console.error("Erro ao criar o usuário:", error);
  } finally {
    await db.$disconnect();
  }
}

createMasterUser();
