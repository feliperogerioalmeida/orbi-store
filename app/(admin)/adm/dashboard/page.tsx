import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(`/${session.user.role.toLocaleLowerCase()}/dashboard`);
  }
  return (
    <div className="flex flex-col justify-start p-4 gap-3 w-full h-full overscroll-none">
      <CustomSidebarTrigger content="Dashboard" />
    </div>
  );
};

export default DashboardPage;
