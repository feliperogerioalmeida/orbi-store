"use client";

import { Card, CardContent } from "@/app/_components/ui/card";

import { User, Address } from "@prisma/client";

import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useEffect, useState } from "react";
import AvatarComponent from "@/app/_components/avatarComponent";
import { useUser } from "@/app/_providers/user";
import { useToast } from "@/app/_hooks/use-toast";

export interface ExtendedUser extends User {
  address?: Address | null;
}

const ProfileTab = () => {
  const { user, setUser } = useUser();

  const initialAddress = {
    id: user?.address?.id || "",
    userId: user?.address?.userId || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    neighborhood: user?.address?.neighborhood || "",
    number: user?.address?.number || "",
    complement: user?.address?.complement || "",
    state: user?.address?.state || "",
    country: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
  };
  const [isDisabled, setIsDisabled] = useState(true);
  const [cep, setCep] = useState(user?.address?.zipCode || "");
  const [address, setAddress] = useState<Address>(initialAddress);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [cpf, setCpf] = useState(user?.cpf || "");
  const [pixKey, setPixKey] = useState(user?.pixKey || "");

  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setPhoneNumber(user.phoneNumber || "");
      setCpf(user.cpf || "");
      setPixKey(user.pixKey || "");
      setCep(user.address?.zipCode || "");
      setAddress({
        id: user.address?.id || "",
        userId: user.address?.userId || "",
        street: user.address?.street || "",
        city: user.address?.city || "",
        neighborhood: user.address?.neighborhood || "",
        number: user.address?.number || "",
        complement: user.address?.complement || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
        zipCode: user.address?.zipCode || "",
      });
    }
  }, [user]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value.replace(/\D/g, "").slice(0, 8);
    const formattedCep = newCep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    setCep(formattedCep);

    if (newCep.length < 8) {
      setAddress((prev) => ({
        ...prev,
        street: "",
        number: "",
        city: "",
        neighborhood: "",
        complement: "",
        state: "",
        zipCode: newCep,
        country: "",
      }));
    }

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

  const formatCpf = (cpf: string) => {
    const digits = cpf.replace(/\D/g, "");
    return digits.replace(
      /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
      (_, part1, part2, part3, part4) => `${part1}.${part2}.${part3}-${part4}`,
    );
  };

  const handlePixKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value.replace(/\s/g, "");
    setPixKey(key);
  };

  const handleCancelClick = () => {
    setAddress(initialAddress);
    setCep(initialAddress.zipCode);
    setIsDisabled(true);
    setPhoneNumber(user?.phoneNumber || "");
    setCpf(user?.cpf || "");
    setPixKey(user?.pixKey || "");
  };

  const handleSaveClick = async (userId: string) => {
    try {
      const payload: Partial<ExtendedUser> = {
        id: userId,
        phoneNumber: phoneNumber || null,
        cpf: cpf || null,
        pixKey: pixKey || null,
      };

      if (
        address &&
        Object.values(address).some((value) => value !== "" && value !== null)
      ) {
        payload.address = address;
      }

      const response = await fetch("/api/users/updateUser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, data: payload }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro desconhecido");
      }
      setUser(result.user);
      setIsDisabled(true);

      toast({
        title: "Sucesso!",
        description: "Usuário atualizado com sucesso.",
        variant: "default",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: String(error) || "Não foi possível atualizar o usuário.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h4 className="font-bold pl-2 text-xl pt-4">Perfil</h4>
        <Card className="p-0 w-full h-[100px] h-min-[50px] h-max-[100px]">
          <CardContent className=" p-0 pl-4 flex items-center h-full gap-2">
            <AvatarComponent
              className="h-20 w-20 justify-self-center items-center overflow-visible"
              isEditable={true}
            />
            <div className="flex flex-col">
              <p className="text-sm font-semibold md:text-lg">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs md:text-sm">{user?.position}</p>
              <p className="text-xs md:text-sm">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Telefone</h4>
          <Input
            type="tel"
            value={formatPhoneNumber(phoneNumber)}
            placeholder="Telefone"
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isDisabled}
            className="text-xs md:text-sm "
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">CPF</h4>
          <Input
            type="text"
            value={formatCpf(cpf)}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            disabled={isDisabled}
            className="text-xs md:text-sm "
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Chave Pix</h4>
          <Input
            type="text"
            value={pixKey}
            onChange={handlePixKeyChange}
            placeholder="Chave Pix"
            disabled={isDisabled}
            className="text-xs md:text-sm "
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
            className="text-xs md:text-sm "
          />
          <Input
            type="text"
            value={address.neighborhood}
            placeholder="Bairro"
            onChange={(e) => handleInputChange(e, "neighborhood")}
            disabled
            className="text-xs md:text-sm "
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.street}
            placeholder="Endereço"
            disabled
            className="text-xs md:text-sm  w-[80%] lg:w-[90%]"
          />
          <Input
            type="text"
            value={address.number}
            placeholder="Número"
            onChange={(e) => handleInputChange(e, "number")}
            disabled={isDisabled}
            className="text-xs md:text-sm  w-[20%] lg:w-[10%]"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.complement || ""}
            onChange={(e) => handleInputChange(e, "complement")}
            placeholder="Complemento"
            disabled={isDisabled}
            className="text-xs md:text-sm "
          />
          <Input
            type="text"
            value={address.city}
            placeholder="Cidade"
            onChange={(e) => handleInputChange(e, "city")}
            disabled
            className="text-xs md:text-sm "
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.state}
            placeholder="Estado"
            onChange={(e) => handleInputChange(e, "state")}
            disabled
            className="text-xs md:text-sm "
          />
          <Input
            type="text"
            value={address.country}
            placeholder="País"
            onChange={(e) => handleInputChange(e, "country")}
            disabled
            className="text-xs md:text-sm "
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
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                if (user?.id) handleSaveClick(user.id);
              }}
            >
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
