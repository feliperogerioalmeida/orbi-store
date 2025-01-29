import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/app/_lib/prisma";
import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(`/${session.user.role.toLocaleLowerCase()}/dashboard`);
  }

  const simulations = await db.simulation.findMany({
    include: { user: true },
  });

  const users = await db.user.findMany();

  const reviews = await db.review.findMany();

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <CustomSidebarTrigger content="Dashboard" />

      <div className="grid grid-cols-2 w-full items-center justify-center gap-4 p-2">
        <div className="flex flex-col aspect-video bg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
          <p className="text-xs ">Usuários</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </div>
        <div className="flex flex-col aspect-video bg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
          <p className="text-xs ">Simulações</p>
          <p className="text-2xl font-bold">{simulations?.length}</p>
        </div>
        <div className="flex flex-col aspect-video bg-muted/50 w-full p-2 rounded-xl gap-1 h-min-[80px] h-[80px] justify-between">
          <p className="text-xs ">Avaliação Média</p>
          <p className="text-2xl font-bold">{reviews?.length}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
