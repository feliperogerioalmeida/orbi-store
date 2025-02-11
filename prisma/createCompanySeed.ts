import "dotenv/config";

import { db } from "@/app/_lib/prisma";

async function createCompany() {
  try {
    const company = await db.company.create({
      data: {
        name: "Orbi Store",
      },
    });

    console.log("Empresa criada com sucesso:", company);
  } catch (error) {
    console.error("Erro ao criar a empresa:", error);
  } finally {
    await db.$disconnect();
  }
}

createCompany();
