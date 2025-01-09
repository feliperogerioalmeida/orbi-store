import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-4">
      <h1>Bem-vindo ao MASTER Dashboard</h1>
      <p>Olá, {session.user.email}!</p>
    </div>
  );
};

export default DashboardPage;
