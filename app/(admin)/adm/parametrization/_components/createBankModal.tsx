"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_components/ui/tabs";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/_components/ui/select";

import { Label } from "@/app/_components/ui/label";
import { Plus } from "lucide-react";
import { createBank } from "@/app/_actions/createBank";
import { PaymentType, RateType } from "@prisma/client";

const paymentMethods = ["PIX", "Débito", "Crédito", "Boleto"];

const CreateBankModal = ({ onBankCreated }: { onBankCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("payments");
  const [paymentMethodsState, setPaymentMethodsState] = useState<
    Record<
      string,
      {
        taxRate: string;
        type: string;
        receiveTime?: string;
        installments?: string[];
      }
    >
  >({});
  const [receivableMethodsState, setReceivableMethodsState] = useState<
    Record<
      string,
      {
        taxRate: string;
        type: string;
        receiveTime?: string;
        installments?: string[];
      }
    >
  >({});
  const [installments, setInstallments] = useState<number>();
  const [bankName, setBankName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [status, setStatus] = useState("");
  const [initialBalanceDate, setInitialBalanceDate] = useState<
    Date | undefined
  >(undefined);
  const [isPending, startTransition] = useTransition();

  const toggleMethod = (method: string, type: "payments" | "receivables") => {
    if (type === "payments") {
      setPaymentMethodsState((prev) => {
        const newState = { ...prev };
        if (prev[method]) {
          delete newState[method];
        } else {
          newState[method] = { taxRate: "", type: "" };
        }
        return newState;
      });
    } else {
      setReceivableMethodsState((prev) => {
        const newState = { ...prev };
        if (prev[method]) {
          delete newState[method];
        } else {
          newState[method] = {
            taxRate: "",
            type: "",
            receiveTime: "",
            installments: [],
          };
        }
        return newState;
      });
    }
  };
  const handleChange = (
    type: "payments" | "receivables",
    method: string,
    field: string,
    value: string,
  ) => {
    let formattedValue = value;

    // Se o campo for "type", converter para "PERCENTAGE" ou "CASH"
    if (field === "type") {
      formattedValue = value === "Porcentagem" ? "PERCENTAGE" : "CASH";
    }

    if (type === "payments") {
      setPaymentMethodsState((prev) => ({
        ...prev,
        [method]: prev[method]
          ? { ...prev[method], [field]: formattedValue }
          : { taxRate: "", type: formattedValue },
      }));
    } else {
      setReceivableMethodsState((prev) => ({
        ...prev,
        [method]: prev[method]
          ? { ...prev[method], [field]: formattedValue }
          : { taxRate: "", type: formattedValue },
      }));
    }
  };

  const handleInstallmentChange = (index: number, value: string) => {
    setReceivableMethodsState((prev) => {
      const updatedInstallments = [...(prev["Crédito"]?.installments || [])];
      updatedInstallments[index] = value;

      return {
        ...prev,
        ["Crédito"]: { ...prev["Crédito"], installments: updatedInstallments },
      };
    });
  };

  const paymentMethodMapping: Record<string, PaymentType> = {
    PIX: "PIX",
    Crédito: "CREDIT_CARD",
    Débito: "DEBIT_CARD",
    Boleto: "BILL",
  };
  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        if (
          !bankName ||
          !initialBalance ||
          !initialBalanceDate ||
          status === undefined
        ) {
          console.error("❌ Preencha todos os campos obrigatórios.");
          return;
        }
        const formattedInitialBalance = Number(initialBalance).toFixed(2);

        const payload = {
          name: bankName,
          initialBalance: parseFloat(formattedInitialBalance),
          initialBalanceDate: new Date(initialBalanceDate),
          isActive: status === "active",
          formsOfReceiving: Object.entries(receivableMethodsState).length
            ? Object.entries(receivableMethodsState).map(
                ([method, values]) => ({
                  method: paymentMethodMapping[method] || "PIX", // 🔥 Converte para PaymentType
                  receiveTimeInDays: Number(values?.receiveTime || 0),
                  taxRate: values?.taxRate ? Number(values.taxRate) : 0,
                  typeOfRate: values?.type
                    ? (values.type as RateType)
                    : undefined,
                }),
              )
            : [],
          formsOfPayment: Object.entries(paymentMethodsState).length
            ? Object.entries(paymentMethodsState).map(([method, values]) => ({
                method: paymentMethodMapping[method] || "PIX", // 🔥 Converte para PaymentType
                taxRate: values?.taxRate ? Number(values.taxRate) : 0,
                typeOfRate: values?.type
                  ? (values.type as RateType)
                  : undefined,
              }))
            : [],
        };

        console.log("🚀 Enviando Payload para `createBank`:", payload);

        const result = await createBank(payload);

        if (result.success) {
          console.log("✅ Banco criado com sucesso!");
          setOpen(false);
          onBankCreated();
        } else {
          console.error("❌ Erro ao criar banco:", result.error);
        }
      } catch (error) {
        console.error("❌ Erro inesperado ao criar banco:", error);
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="hidden md:flex">Criar Banco</Button>
      </DialogTrigger>
      <DialogContent className="w-[80%] rounded-md md:w-full">
        <DialogHeader>
          <DialogTitle>Informações do Banco</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 text-xs md:text-sm">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Nome do Banco*"
              className="text-xs md:text-sm"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
            <Input
              placeholder="Saldo Inicial*"
              className="text-xs md:text-sm"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Data do Saldo Inicial*"
              className="text-xs md:text-sm"
              value={
                initialBalanceDate
                  ? initialBalanceDate.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setInitialBalanceDate(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue
                  placeholder="Status"
                  className="text-xs md:text-sm"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="receivables">Recebimentos</TabsTrigger>
            </TabsList>

            {["payments", "receivables"].map((type) => (
              <TabsContent
                key={type}
                value={type}
                className="flex flex-col gap-2 w-full"
              >
                {paymentMethods.map((method) => {
                  const isPayment = type === "payments";
                  const state = isPayment
                    ? paymentMethodsState
                    : receivableMethodsState;
                  return (
                    <div key={method} className="flex flex-col gap-2 w-full">
                      <div className="flex items-center space-x-2 w-full">
                        <Checkbox
                          id={method}
                          checked={!!state[method]}
                          onCheckedChange={() =>
                            toggleMethod(
                              method,
                              type as "payments" | "receivables",
                            )
                          }
                        />
                        <Label htmlFor={method}>{method}</Label>
                      </div>

                      {state[method] && (
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-row w-full gap-2">
                            <Input
                              placeholder="Taxa"
                              className="text-xs md:text-sm"
                              type="number"
                              value={state[method]?.taxRate || ""}
                              onChange={(e) =>
                                handleChange(
                                  type as "payments" | "receivables",
                                  method,
                                  "taxRate",
                                  e.target.value,
                                )
                              }
                            />
                            <Select
                              value={state[method]?.type || ""}
                              onValueChange={(value) =>
                                handleChange(
                                  type as "payments" | "receivables",
                                  method,
                                  "type",
                                  value,
                                )
                              }
                            >
                              <SelectTrigger className="text-xs md:text-sm">
                                <SelectValue
                                  placeholder="Tipo de Taxa"
                                  className="text-xs md:text-sm"
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PERCENTAGE">
                                  Porcentagem
                                </SelectItem>
                                <SelectItem value="CASH">Valor Fixo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="flex flex-row w-full gap-2">
                            {!isPayment && method !== "PIX" && (
                              <Input
                                placeholder="Tempo de Recebimento (dias)"
                                className="text-xs md:text-sm"
                                type="number"
                                value={state[method]?.receiveTime || ""}
                                onChange={(e) =>
                                  handleChange(
                                    type as "payments" | "receivables",
                                    method,
                                    "receiveTime",
                                    e.target.value,
                                  )
                                }
                              />
                            )}

                            {method === "Crédito" && !isPayment && (
                              <Input
                                type="number"
                                min={1}
                                max={18}
                                value={installments || ""}
                                onChange={(e) =>
                                  setInstallments(Number(e.target.value))
                                }
                                placeholder="Número de Parcelas"
                                className="text-xs md:text-sm"
                              />
                            )}
                          </div>

                          {method === "Crédito" &&
                            !isPayment &&
                            installments && (
                              <div className="grid grid-cols-2 gap-2 w-full">
                                {[...Array(installments)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center space-x-2 border p-2 rounded-md w-full"
                                  >
                                    <span className="w-8 text-center font-medium">
                                      {i + 1}
                                    </span>
                                    <Input
                                      placeholder="Taxa"
                                      className="text-xs md:text-sm w-full"
                                      type="number"
                                      onChange={(e) =>
                                        handleInstallmentChange(
                                          i,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter className="flex mt-4 gap-2 w-full">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 md:hidden rounded-full p-3 shadow-lg"
        >
          <Plus size={20} />
        </Button>
      </DialogTrigger>
    </Dialog>
  );
};

export default CreateBankModal;
