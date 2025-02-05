import { Input } from "@/app/_components/ui/input";
import { db } from "@/app/_lib/prisma";

interface UserParameters {
  email: string;
}
const AddressSection = async (email: UserParameters) => {
  const loggedUser = await db.user.findUnique({
    where: {
      email: email.email,
    },
    include: {
      address: true,
    },
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      <h4 className="font-bold text-xl pt-4 ">Endereço</h4>
      <Input
        type="text"
        value={`${loggedUser?.address?.street ?? "Endereço"}`}
        disabled
        className="text-xs md:text-sm lg:text-lg"
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          value={`${loggedUser?.address?.number ?? "Numero"}`}
          disabled
          className="text-xs md:text-sm lg:text-lg"
        />
        <Input
          type="text"
          value={`${loggedUser?.address?.city ?? "Cidade"}`}
          disabled
          className="text-xs md:text-sm lg:text-lg"
        />
      </div>
      <Input
        type="text"
        value={`${loggedUser?.address?.complement ?? "Complemento"}`}
        disabled
        className="text-xs md:text-sm lg:text-lg"
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          value={`${loggedUser?.address?.zipCode ?? "CEP"}`}
          disabled
          className="text-xs md:text-sm lg:text-lg"
        />
        <Input
          type="text"
          value={`${loggedUser?.address?.neighborhood ?? "Bairro"}`}
          disabled
          className="text-xs md:text-sm lg:text-lg"
        />
      </div>
      <Input
        type="text"
        value={`${loggedUser?.address?.country ?? "Pais"}`}
        disabled
        className="text-xs md:text-sm lg:text-lg"
      />
    </div>
  );
};

export default AddressSection;
