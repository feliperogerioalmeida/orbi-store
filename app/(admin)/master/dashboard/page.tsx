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
    <div className="grid grid-cols-2 w-full items-center justify-center gap-4 p-2">
      <div className="flex flex-col aspect-video bg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
        <p className="text-xs ">Usuários</p>
        <p className="text-2xl font-bold">2</p>
      </div>
      <div className="flex flex-col aspect-videobg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
        <p className="text-xs ">Simulações</p>
        <p className="text-2xl font-bold">2</p>
      </div>
      <div className="flex flex-col aspect-video bg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
        <p className="text-xs ">Avaliação Média</p>
        <p className="text-2xl font-bold">2</p>
      </div>
    </div>
  );
};

export default DashboardPage;
