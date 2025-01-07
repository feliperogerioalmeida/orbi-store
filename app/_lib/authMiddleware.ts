import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function requireMaster(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "MASTER") {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }
}
