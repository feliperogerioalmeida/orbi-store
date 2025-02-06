"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar";
import { Card, CardContent } from "@/app/_components/ui/card";

import { User, Address } from "@prisma/client";
import { Pencil } from "lucide-react";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useState } from "react";

interface ExtendedUser extends User {
  address?: Address | null;
}

const ProfileTab = (loggedUser: { loggedUser: ExtendedUser }) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [cep, setCep] = useState(loggedUser.loggedUser.address?.zipCode || "");

  const initialAddress = {
    id: loggedUser.loggedUser.address?.id || "",
    userId: loggedUser.loggedUser.address?.userId || "",
    street: loggedUser.loggedUser.address?.street || "",
    city: loggedUser.loggedUser.address?.city || "",
    neighborhood: loggedUser.loggedUser.address?.neighborhood || "",
    number: loggedUser.loggedUser.address?.number || "",
    complement: loggedUser.loggedUser.address?.complement || "",
    state: loggedUser.loggedUser.address?.state || "",
    country: loggedUser.loggedUser.address?.state || "",
    zipCode: loggedUser.loggedUser.address?.zipCode || "",
  };

  const [address, setAddress] = useState<Address>(initialAddress);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value.replace(/\D/g, "").slice(0, 8);
    setCep(newCep);
    setAddress((prev) => ({ ...prev, zipCode: newCep }));

    if (newCep.length === 8) {
      fetchAddressByCep(newCep);
    }
  };

  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setAddress((prev) => ({
          ...prev,
          street: data.logradouro || "",
          city: data.localidade || "",
          neighborhood: data.bairro || "",
          zipCode: data.cep || cep,
          complement: data.complemento || "",
          state: data.estado || "",
          country: "Brasil",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Address,
  ) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");

    return digits.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      (_, ddd, firstPart, secondPart) => `(${ddd}) ${firstPart}-${secondPart}`,
    );
  };

  const handleCancelClick = () => {
    setAddress(initialAddress);
    setCep(initialAddress.zipCode);
    setIsDisabled(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h4 className="font-bold pl-2 text-xl pt-4">Perfil</h4>
        <Card className="p-0 w-full h-[100px] h-min-[50px] h-max-[100px]">
          <CardContent className=" p-0 pl-4 flex items-center h-full gap-2">
            <Avatar className=" h-20 w-20 justify-self-center items-center overflow-visible">
              <AvatarFallback>
                {loggedUser.loggedUser.firstName?.[0].toUpperCase()}
                {loggedUser.loggedUser.lastName?.[0].toUpperCase()}
              </AvatarFallback>

              {loggedUser.loggedUser.image && (
                <AvatarImage src={loggedUser.loggedUser.image} />
              )}

              <div className=" flex absolute right-0 bottom-0 bg-black rounded-full w-6 h-6 items-center justify-center cursor-pointer">
                <Pencil size={16} color="#ffffff" strokeWidth={1.25} />
              </div>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-lg font-semibold sm:text-sm">
                {loggedUser.loggedUser.firstName}{" "}
                {loggedUser.loggedUser.lastName}
              </p>
              <p className="text-sm sm:text-xs">
                {loggedUser.loggedUser.position}
              </p>
              <p className="text-sm sm:text-xs">
                {loggedUser.loggedUser.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Telefone</h4>
          <Input
            type="tel"
            value={
              loggedUser.loggedUser.phoneNumber
                ? formatPhoneNumber(loggedUser.loggedUser.phoneNumber)
                : ""
            }
            placeholder="Telefone"
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">CPF</h4>
          <Input
            type="text"
            value={"064.212.405-18"}
            placeholder="CPF"
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Chave Pix</h4>
          <Input
            type="text"
            value={"06421240518"}
            placeholder="Chave Pix"
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-bold text-xl pt-4 ">Endereço</h4>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={cep}
            placeholder="CEP"
            disabled={isDisabled}
            onChange={handleCepChange}
            className="text-xs md:text-sm lg:text-lg"
          />
          <Input
            type="text"
            value={address.neighborhood}
            placeholder="Bairro"
            onChange={(e) => handleInputChange(e, "neighborhood")}
            disabled
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.street}
            placeholder="Endereço"
            disabled
            className="text-xs md:text-sm lg:text-lg w-[90%]"
          />
          <Input
            type="text"
            value={address.number}
            placeholder="Número"
            onChange={(e) => handleInputChange(e, "number")}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg w-[10%]"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.complement || ""}
            onChange={(e) => handleInputChange(e, "complement")}
            placeholder="Complemento"
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
          <Input
            type="text"
            value={address.city}
            placeholder="Cidade"
            onChange={(e) => handleInputChange(e, "city")}
            disabled
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.state}
            placeholder="Estado"
            onChange={(e) => handleInputChange(e, "state")}
            disabled
            className="text-xs md:text-sm lg:text-lg"
          />
          <Input
            type="text"
            value={address.country}
            placeholder="País"
            onChange={(e) => handleInputChange(e, "country")}
            disabled
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
      </div>
      {isDisabled ? (
        <div className="flex flex-col gap-2">
          <div className="flex max-w-[120px]">
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setIsDisabled(false)}
            >
              Atualizar Perfil
            </Button>
          </div>
          <div className="flex max-w-[120px]">
            <Button variant="outline" size="lg" className="w-full">
              Alterar Senha
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex max-w-[120px]">
            <Button variant="outline" size="lg" className="w-full">
              Salvar
            </Button>
          </div>
          <div className="flex max-w-[120px]">
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={handleCancelClick}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
