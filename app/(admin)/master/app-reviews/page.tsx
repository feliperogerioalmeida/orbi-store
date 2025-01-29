import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";
import { authOptions } from "@/app/_lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
const ReviewsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role !== "MASTER") {
    redirect(`/${session.user.role.toLocaleLowerCase()}/dashboard`);
  }
  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <CustomSidebarTrigger content="Avaliações" />
    </div>
  );
};

export default ReviewsPage;
