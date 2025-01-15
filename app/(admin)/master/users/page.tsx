import { Separator } from "@/app/_components/ui/separator";
import { SidebarTrigger } from "@/app/_components/ui/sidebar";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const UsersListPage = () => {
  const { data: session } = useSession();

  if (!session || session.user.role !== "MASTER") {
    redirect(`/${session?.user.role.toLowerCase()}/dashboard`);
  }

  return (
    <div className="flex flex-col justify-center p-4 gap-3 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="text-2xl font-bold ">Usuários</h1>
        <div></div>
      </div>
    </div>
  );
};

export default UsersListPage;
