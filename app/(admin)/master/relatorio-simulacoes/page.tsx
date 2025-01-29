import { Separator } from "@/app/_components/ui/separator";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SimulationsTable from "./components/simulationsTable";
import { db } from "@/app/_lib/prisma";

const SimulationsRequests = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(`/${session.user.role.toLocaleLowerCase()}/dashboard`);
  }

  const simulations = await db.simulation.findMany({
    include: {
      user: true,
    },
  });

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-2xl font-bold ">Relatório de Simulações</h1>
      </div>
      <SimulationsTable simulations={simulations} />
    </div>
  );
};

export default SimulationsRequests;
