import { Input } from "@/app/_components/ui/input";
import { db } from "@/app/_lib/prisma";

interface UserParameters {
  email: string;
}

const PersonalDataSection = async (email: UserParameters) => {
  const loggedUser = await db.user.findUnique({
    where: {
      email: email.email,
    },
  });

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");

    return digits.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      (_, ddd, firstPart, secondPart) => `(${ddd}) ${firstPart}-${secondPart}`,
    );
  };

  return (
    <div className="flex gap-4 w-full">
      <div className="flex flex-col gap-2 w-full">
        <h4 className="font-bold text-xl pt-4 ">Telefone</h4>
        <Input
          type="tel"
          disabled
          value={
            loggedUser?.phoneNumber
              ? formatPhoneNumber(loggedUser.phoneNumber)
              : ""
          }
          className="sm:text-xs"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h4 className="font-bold text-xl pt-4 ">CPF</h4>
        <Input
          type="text"
          disabled
          value={"064.212.405-18"}
          className="sm:text-xs"
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <h4 className="font-bold text-xl pt-4 ">Chave Pix</h4>
        <Input
          type="text"
          disabled
          value={"06421240518"}
          className="sm:text-xs"
        />
      </div>
    </div>
  );
};

export default PersonalDataSection;
