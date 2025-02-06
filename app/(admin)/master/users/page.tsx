import { authOptions } from "@/app/_lib/auth";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import UsersTable from "./_components/usersTable";
import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";

const UsersListPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(
      `/${session.user.role === "EMPLOYEE" || session.user.role === "ADMIN" ? "adm" : "client"}/dashboard`,
    );
  }

  const users = await db.user.findMany({
    include: {
      simulations: true,
      reviews: true,
    },
  });

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <CustomSidebarTrigger content="Usuários" />
      <UsersTable users={users} />
    </div>
  );
};

export default UsersListPage;
