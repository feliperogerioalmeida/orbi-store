import DataTable from "./components/dataTable";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";

const PricingPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(
      `/${session.user.role === "EMPLOYEE" || session.user.role === "ADMIN" ? "adm" : "client"}/dashboard`,
    );
  }

  const fetchIphones = async () => {
    const iphones = await db.iPhone.findMany({
      include: {
        colors: true,
        capacities: {
          include: {
            conditions: true,
          },
        },
      },
    });
    return iphones;
  };

  const iphones = await fetchIphones();

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <CustomSidebarTrigger content="Precificação de iPhones" />

      <DataTable iphones={iphones} />
    </div>
  );
};

export default PricingPage;
