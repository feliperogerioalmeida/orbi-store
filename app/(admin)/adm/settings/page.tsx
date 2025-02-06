import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";

import { db } from "@/app/_lib/prisma";
import ProfileTab from "./_components/profileTab";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  const loggedUser = await db.user.findUnique({
    where: { email: session?.user.email },
    include: {
      address: true,
    },
  });

  if (!session || !session.user || !loggedUser) {
    redirect("/login");
  }

  if (
    session.user.role !== "MASTER" &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "EMPLOYEE"
  ) {
    redirect(`/client/dashboard`);
  }

  return (
    <div className="flex flex-col justify-start p-4 gap-4 w-full h-full overscroll-none">
      <CustomSidebarTrigger content="Configurações" />
      <div className="w-full flex flex-col justify-start gap-3 items-start">
        <Tabs defaultValue="profile" className=" w-full">
          <TabsList className="w-full justify-evenly gap-8">
            <TabsTrigger value="profile" className="w-min-[100px] w-full">
              Perfil
            </TabsTrigger>
            {(loggedUser.role === "ADMIN" || loggedUser.role === "MASTER") && (
              <>
                <TabsTrigger value="company" className="w-min-[100px] w-full">
                  Empresa
                </TabsTrigger>
                <TabsTrigger value="team" className="w-min-[100px] w-full">
                  Time
                </TabsTrigger>
              </>
            )}
          </TabsList>
          <TabsContent value="profile">
            <ProfileTab loggedUser={loggedUser} />
          </TabsContent>
          <TabsContent value="company">Change your password here.</TabsContent>
          <TabsContent value="team">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
