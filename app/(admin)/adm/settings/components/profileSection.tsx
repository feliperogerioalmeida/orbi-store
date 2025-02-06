import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { db } from "@/app/_lib/prisma";
import { Pencil } from "lucide-react";

interface UserParameters {
  email: string;
}

const ProfileSection = async (email: UserParameters) => {
  const loggedUser = await db.user.findUnique({
    where: { email: email.email },
  });

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold pl-2 text-xl pt-4">Perfil</h4>
      <Card className="p-0 w-full h-[100px] h-min-[50px] h-max-[100px]">
        <CardContent className=" p-0 pl-4 flex items-center h-full gap-2">
          <Avatar className=" h-20 w-20 justify-self-center items-center overflow-visible">
            <AvatarFallback>
              {loggedUser?.firstName?.[0].toUpperCase()}
              {loggedUser?.lastName?.[0].toUpperCase()}
            </AvatarFallback>

            {loggedUser?.image && <AvatarImage src={loggedUser?.image} />}

            <div className=" flex absolute right-0 bottom-0 bg-black rounded-full w-6 h-6 items-center justify-center cursor-pointer">
              <Pencil size={16} color="#ffffff" strokeWidth={1.25} />
            </div>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-lg font-semibold sm:text-sm">
              {loggedUser?.firstName} {loggedUser?.lastName}
            </p>
            <p className="text-sm sm:text-xs">{loggedUser?.position}</p>
            <p className="text-sm sm:text-xs">{loggedUser?.email}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
