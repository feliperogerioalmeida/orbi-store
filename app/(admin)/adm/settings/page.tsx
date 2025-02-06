import CustomSidebarTrigger from "@/app/_components/customSidebarTrigger";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";
import ProfileSection from "./components/profileSection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/_lib/auth";
import { redirect } from "next/navigation";
import PersonalDataSection from "./components/personalDataSection";
import AddressSection from "./components/addressSection";
import { Button } from "@/app/_components/ui/button";

const SettingsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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
            {session?.user.role === "ADMIN" && (
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
            <div className="flex flex-col gap-4">
              <ProfileSection email={session?.user.email} />
              <PersonalDataSection email={session?.user.email} />
              <AddressSection email={session?.user.email} />
              <div className="flex flex-col gap-2">
                <div className="flex ">
                  <Button variant="default" size="lg">
                    Atualizar Perfil
                  </Button>
                </div>
                <div className="flex ">
                  <Button variant="outline" size="lg">
                    Alterar Senha
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="company">Change your password here.</TabsContent>
          <TabsContent value="team">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
