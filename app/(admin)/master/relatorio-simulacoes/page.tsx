import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SimulationsTable from "./_components/simulationsTable";
import { db } from "@/app/_lib/prisma";
import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";

const SimulationsRequests = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(
      `/${session.user.role === "EMPLOYEE" || session.user.role === "ADMIN" ? "adm" : "client"}/dashboard`,
    );
  }

  const simulations = await db.simulation.findMany({
    include: {
      user: true,
    },
  });

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <CustomSidebarTrigger content="Relatório de Simulações" />

      <SimulationsTable simulations={simulations} />
    </div>
  );
};

export default SimulationsRequests;
