"use client";

import { Company, CompanyAddress } from "@prisma/client";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { cn } from "@/app/_lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/app/_components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/app/_components/ui/label";
import { saveDigitalCertificate } from "@/app/_actions/saveDigitalCertificate";
import { useToast } from "@/app/_hooks/use-toast";

interface ExtendedCompany extends Company {
  companyAddress: CompanyAddress | null;
}

const CompanyTab = () => {
  const [company, setCompany] = useState<ExtendedCompany | null>(null);

  const initialAddress = {
    id: company?.companyAddress?.id || "",
    companyId: company?.companyAddress?.companyId || "",
    street: company?.companyAddress?.street || "",
    city: company?.companyAddress?.city || "",
    neighborhood: company?.companyAddress?.neighborhood || "",
    number: company?.companyAddress?.number || "",
    complement: company?.companyAddress?.complement || "",
    ibge: company?.companyAddress?.ibge || "",
    state: company?.companyAddress?.state || "",
    country: company?.companyAddress?.country || "",
    zipCode: company?.companyAddress?.zipCode || "",
  };

  const [isDisabled, setIsDisabled] = useState(true);
  const [cep, setCep] = useState(company?.companyAddress?.zipCode || "");
  const [address, setAddress] = useState<CompanyAddress>(initialAddress);
  const [phoneNumber, setPhoneNumber] = useState(company?.phoneNumber || "");
  const [cnpj, setCnpj] = useState(company?.cnpj || "");
  const [companyName, setCompanyName] = useState(company?.name || "");
  const [companySocialName, setCompanySocialName] = useState(
    company?.socialName || "",
  );
  const [companyEmail, setCompanyEmail] = useState(company?.email || "");
  const [companyStateNumber, setCompanyStateNumber] = useState(
    company?.stateNumber || "",
  );
  const [companyCreationDate, setCompanyCreationDate] = useState<
    Date | undefined
  >(company?.creationDate ? new Date(company.creationDate) : undefined);

  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [certificatePassword, setCertificatePassword] = useState("");
  const [lastNfeIssued, setLastNfeIssued] = useState("");
  const [nfeSeries, setNfeSeries] = useState("");
  const [lastCouponIssued, setLastCouponIssued] = useState("");
  const [couponSeries, setCouponSeries] = useState("");
  const [csc, setCsc] = useState("");
  const [cscId, setCscId] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch("/api/company/getCompany");
        const data = await res.json();
        if (data) {
          setCompany(data);
          setCompanySocialName(data.socialName || "");
          setCompanyEmail(data.email || "");
          setCompanyName(data.name || "");
          setCompanyStateNumber(data.stateNumber || "");
          setPhoneNumber(data.phoneNumber || "");
          setCnpj(data.cnpj || "");
          setCompanyCreationDate(data.creationDate);
          setCep(data.companyAddress?.zipCode || "");
          setCertificateUrl(data.digitalCertificate || null);
          setCertificatePassword(data.certificatePassword || "");
          setLastNfeIssued(data.lastNfeIssued || "");
          setNfeSeries(data.nfeSeries || "");
          setLastCouponIssued(data.lastCouponIssued || "");
          setCouponSeries(data.couponSeries || "");
          setCsc(data.csc || "");
          setCscId(data.cscId || "");
          setCep(data.companyAddress?.zipCode || "");
          setAddress({
            id: data.companyAddress?.id || "",
            street: data.companyAddress?.street || "",
            city: data.companyAddress?.city || "",
            neighborhood: data.companyAddress?.neighborhood || "",
            number: data.companyAddress?.number || "",
            complement: data.companyAddress?.complement || "",
            state: data.companyAddress?.state || "",
            ibge: data.companyAddress?.ibge || "",
            country: data.companyAddress?.country || "",
            zipCode: data.companyAddress?.zipCode || "",
            companyId: data.companyAddress?.companyId || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa:", error);
      }
    };

    fetchCompany();
  }, []);

  useEffect(() => {
    if (company) {
      setPhoneNumber(company.phoneNumber || "");
      setCnpj(company.cnpj || "");
      setCompanySocialName(company.socialName || "");
      setCompanyEmail(company.email || "");
      setCompanyName(company.name || "");
      setCompanyStateNumber(company.stateNumber || "");
      setCertificateUrl(company.digitalCertificate || null);
      setCompanyCreationDate(
        company.creationDate ? new Date(company.creationDate) : undefined,
      );
      if (company.companyAddress) {
        setAddress(company.companyAddress);
        setCep(company.companyAddress.zipCode || "");
      }
    }
  }, [company]);

  const handleCancelClick = () => {
    setPhoneNumber(company?.phoneNumber || "");
    setCnpj(company?.cnpj || "");
    setCompanySocialName(company?.socialName || "");
    setCompanyEmail(company?.email || "");
    setCompanyName(company?.name || "");
    setCompanyStateNumber(company?.stateNumber || "");
    setCompanyCreationDate(
      company?.creationDate ? new Date(company.creationDate) : undefined,
    );
    setCep(initialAddress.zipCode);
    setAddress(initialAddress);
    setCertificatePassword(company?.digitalCertificatePassword || "");
    setLastNfeIssued(company?.lastNFEIssued || "");
    setNfeSeries(company?.NFESeries || "");
    setLastCouponIssued(company?.lastCouponIssued || "");
    setCouponSeries(company?.couponSeries || "");
    setCsc(company?.CSC || "");
    setCscId(company?.CSCId || "");
    setCertificateUrl(company?.digitalCertificate || null);
    setIsDisabled(true);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = removeFormatting(e.target.value).slice(0, 8);

    setCep(newCep);

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
        ibge: "",
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
          ibge: data.ibge || "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const formatCep = (cep: string) => {
    const formatedCep = cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    return formatedCep;
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      (_, ddd, firstPart, secondPart) => `(${ddd}) ${firstPart}-${secondPart}`,
    );
  };

  const formatCnpj = (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, "").slice(0, 14);
    return digits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  };
  const removeFormatting = (formatedValue: string) => {
    const rawValue = formatedValue.replace(/\D/g, "");
    return rawValue;
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompanyAddress,
  ) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDigitalCertificate = async (company: Company, file: File) => {
    try {
      const digitalCertificateUrl = await saveDigitalCertificate(company, file);
      setCertificateUrl(digitalCertificateUrl);
      setCompany((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          digitalCertificate: digitalCertificateUrl,
        };
      });
    } catch (error) {
      console.error("Error updating certificate:", error);
    }
  };

  const handleSaveClick = async () => {
    try {
      if (!company?.id) {
        throw new Error("Company ID is missing");
      }

      const payload: Partial<ExtendedCompany> = {
        cnpj: removeFormatting(cnpj) || null,
        name: companyName || null,
        socialName: companySocialName || null,
        phoneNumber: removeFormatting(phoneNumber) || null,
        email: companyEmail || null,
        stateNumber: companyStateNumber || null,
        creationDate: companyCreationDate || null,
        digitalCertificatePassword: certificatePassword || null,
        lastNFEIssued: lastNfeIssued || null,
        NFESeries: nfeSeries || null,
        lastCouponIssued: lastCouponIssued || null,
        couponSeries: couponSeries || null,
        CSC: csc || null,
        CSCId: cscId || null,
        digitalCertificate: certificateUrl || null,
      };

      if (
        address &&
        Object.values(address).some((value) => value !== "" && value !== null)
      ) {
        payload.companyAddress = {
          ...address,
          companyId: company.id,
          zipCode: cep,
        };
      }

      const response = await fetch("/api/company/updateCompany", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: company.id, data: payload }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro desconhecido");
      }

      setCompany(result.company);
      setAddress(result.companyAddress);
      if (result.company.companyAddress?.zipCode) {
        setCep(result.company.companyAddress.zipCode);
      }
      setIsDisabled(true);

      toast({
        title: "Sucesso!",
        description: "Empresa atualizada com sucesso.",
        variant: "default",
      });
    } catch (error: unknown) {
      toast({
        title: "Erro",
        description: String(error) || "Não foi possível atualizar a empresa.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <h4 className="font-bold text-xl pt-4 ">Dados Gerais</h4>
          <div className="flex w-full gap-2">
            <Input
              type="text"
              value={companyName}
              placeholder="Nome da Loja"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              type="text"
              value={companySocialName}
              placeholder="Razão Social"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCompanySocialName(e.target.value)}
            />
          </div>
          <div className="flex w-full gap-2">
            <Input
              type="text"
              value={formatCnpj(cnpj)}
              placeholder="CNPJ"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
            />
            <div className="flex gap-2 w-[50%]">
              <Input
                type="tel"
                value={formatPhoneNumber(phoneNumber)}
                placeholder="Telefone"
                disabled={isDisabled}
                className="text-xs md:text-sm w-[50%]"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Input
                type="email"
                value={companyEmail}
                placeholder="Email"
                disabled={isDisabled}
                className="text-xs md:text-sm w-[50%]"
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full gap-2">
            <Input
              type="text"
              value={companyStateNumber}
              placeholder="Inscrição Estadual"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCompanyStateNumber(e.target.value)}
            />
            <div className="flex gap-2 w-[50%]">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[100%] md:w-[49.5%] justify-start text-left font-normal p-2",
                      !companyCreationDate && "text-muted-foreground",
                    )}
                    disabled={isDisabled}
                  >
                    <CalendarIcon />
                    {companyCreationDate ? (
                      format(companyCreationDate, "PPP")
                    ) : (
                      <span className="text-xs md:text-sm">
                        Data de Abertura
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={companyCreationDate || undefined}
                    onSelect={(day) => setCompanyCreationDate(day || undefined)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-bold text-xl pt-4 ">Endereço</h4>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={formatCep(cep)}
            placeholder="CEP"
            disabled={isDisabled}
            onChange={handleCepChange}
            className="text-xs md:text-sm "
          />
          <Input
            type="text"
            value={address.neighborhood}
            placeholder="Bairro"
            onChange={(e) => handleAddressChange(e, "neighborhood")}
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
            onChange={(e) => handleAddressChange(e, "number")}
            disabled={isDisabled}
            className="text-xs md:text-sm  w-[20%] lg:w-[10%]"
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.complement || ""}
            onChange={(e) => handleAddressChange(e, "complement")}
            placeholder="Complemento"
            disabled={isDisabled}
            className="text-xs md:text-sm "
          />
          <Input
            type="text"
            value={address.city}
            placeholder="Cidade"
            onChange={(e) => handleAddressChange(e, "city")}
            disabled
            className="text-xs md:text-sm "
          />
        </div>
        <div className="flex w-full gap-2">
          <Input
            type="text"
            value={address.state}
            placeholder="Estado"
            onChange={(e) => handleAddressChange(e, "state")}
            disabled
            className="text-xs md:text-sm w-[50%]"
          />
          <div className="flex gap-2 w-[50%]">
            <Input
              type="text"
              value={address.country}
              placeholder="País"
              onChange={(e) => handleAddressChange(e, "country")}
              disabled
              className="text-xs md:text-sm w-[50%]"
            />
            <Input
              type="text"
              value={address.ibge}
              placeholder="IBGE"
              onChange={(e) => handleAddressChange(e, "ibge")}
              disabled
              className="text-xs md:text-sm w-[50%] lg:w-[25%]"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h4 className="font-bold text-xl pt-4 ">Dados Fiscais</h4>
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="relative md:w-[50%]">
            <Input
              type="file"
              id="certificate"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleDigitalCertificate(company!, e.target.files[0])
              }
              disabled={isDisabled}
            />
            <Label
              htmlFor="certificate"
              className={`text-xs md:text-sm w-full flex items-center justify-center py-2 rounded-md cursor-pointer transition-all ${
                certificateUrl
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {certificateUrl ? "Edit Certificate" : "Add Certificate"}
            </Label>
          </div>
          <div className="flex gap-2 md:w-[50%] ">
            <Input
              type="text"
              value={certificatePassword}
              placeholder="Senha Certificado"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCertificatePassword(e.target.value)}
            />
            <Input
              type="text"
              value={lastNfeIssued}
              placeholder="Ultima NFE Emitida"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setLastNfeIssued(e.target.value)}
            />
            <Input
              type="text"
              value={nfeSeries}
              placeholder="Serie NFE"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setNfeSeries(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="flex gap-2 w-[100%] md:w-[50%]">
            <Input
              type="text"
              value={lastCouponIssued}
              placeholder="Ultimo Cupom Emitido"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setLastCouponIssued(e.target.value)}
            />
            <Input
              type="text"
              value={couponSeries}
              placeholder="Serie Cupom"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%]"
              onChange={(e) => setCouponSeries(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-[100%] md:w-[50%]">
            <Input
              type="text"
              value={csc}
              placeholder="CSC"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%] lg:w-[75%]"
              onChange={(e) => setCsc(e.target.value)}
            />
            <Input
              type="text"
              value={cscId}
              placeholder="CSC ID"
              disabled={isDisabled}
              className="text-xs md:text-sm w-[50%] lg:w-[25%]"
              onChange={(e) => setCscId(e.target.value)}
            />
          </div>
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
              onClick={handleSaveClick}
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

export default CompanyTab;
