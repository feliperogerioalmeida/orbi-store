"use server";

import { db } from "@/app/_lib/prisma";
import { ExtendedUser } from "../(admin)/adm/settings/_components/profileTab";

export const getUser = async (email: string): Promise<ExtendedUser | null> => {
  const user = await db.user.findUnique({
    where: { email },
    include: { address: true },
  });

  return user;
};
