"use server";

import { db } from "@/app/_lib/prisma";

export async function getChartOfAccounts() {
  return await db.chartOfAccounts.findMany({
    orderBy: { code: "asc" },
  });
}
