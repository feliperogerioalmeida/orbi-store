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
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.number ?? "Numero"}`}
        />
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.city ?? "Cidade"}`}
        />
      </div>
      <Input
        type="text"
        disabled
        value={`${loggedUser?.address?.complement ?? "Complemento"}`}
      />
      <div className="flex w-full gap-2">
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.zipCode ?? "CEP"}`}
        />
        <Input
          type="text"
          disabled
          value={`${loggedUser?.address?.neighborhood ?? "Bairro"}`}
        />
      </div>
      <Input
        type="text"
        disabled
        value={`${loggedUser?.address?.country ?? "Pais"}`}
      />
    </div>
  );
};

export default AddressSection;
