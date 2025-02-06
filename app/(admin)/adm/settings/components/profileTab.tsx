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

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");

    return digits.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      (_, ddd, firstPart, secondPart) => `(${ddd}) ${firstPart}-${secondPart}`,
    );
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
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">CPF</h4>
          <Input
            type="text"
            value={"064.212.405-18"}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Chave Pix</h4>
          <Input
            type="text"
            value={"06421240518"}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-bold text-xl pt-4 ">Endereço</h4>
        <Input
          type="text"
          value={`${loggedUser.loggedUser.address?.street ?? "Endereço"}`}
          disabled={isDisabled}
          className="text-xs md:text-sm lg:text-lg"
        />
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={`${loggedUser.loggedUser.address?.number ?? "Numero"}`}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
          <Input
            type="text"
            value={`${loggedUser.loggedUser.address?.city ?? "Cidade"}`}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <Input
          type="text"
          value={`${loggedUser.loggedUser.address?.complement ?? "Complemento"}`}
          disabled={isDisabled}
          className="text-xs md:text-sm lg:text-lg"
        />
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={`${loggedUser.loggedUser.address?.zipCode ?? "CEP"}`}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
          <Input
            type="text"
            value={`${loggedUser.loggedUser.address?.neighborhood ?? "Bairro"}`}
            disabled={isDisabled}
            className="text-xs md:text-sm lg:text-lg"
          />
        </div>
        <Input
          type="text"
          value={`${loggedUser.loggedUser.address?.country ?? "Pais"}`}
          disabled={isDisabled}
          className="text-xs md:text-sm lg:text-lg"
        />
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
              onClick={() => setIsDisabled(true)}
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
