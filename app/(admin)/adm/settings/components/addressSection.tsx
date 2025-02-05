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
        disabled
        value={`${loggedUser?.address?.street ?? "Endereço"}`}
        className="sm:text-xs"
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.number ?? "Numero"}`}
          className="sm:text-xs"
        />
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.city ?? "Cidade"}`}
          className="sm:text-xs"
        />
      </div>
      <Input
        type="text"
        disabled
        value={`${loggedUser?.address?.complement ?? "Complemento"}`}
        className="sm:text-xs"
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.zipCode ?? "CEP"}`}
          className="sm:text-xs"
        />
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.neighborhood ?? "Bairro"}`}
          className="sm:text-xs"
        />
      </div>
      <Input
        type="text"
        disabled
        value={`${loggedUser?.address?.country ?? "Pais"}`}
        className="sm:text-xs"
      />
    </div>
  );
};

export default AddressSection;
