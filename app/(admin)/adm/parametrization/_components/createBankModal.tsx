"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

import { createBank } from "@/app/_actions/createBank";
import { PaymentType, RateType } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/app/_components/ui/scroll-area";

const paymentMethods = ["PIX", "Débito", "Crédito", "Boleto"];

interface CreateBankModalProps {
  open: boolean;
  mode: "view" | "edit" | "create";
  bankData?: {
    name: string;
    initialBalance: string;
    initialBalanceDate: string;
    isActive: boolean;
    formsOfPayment: Record<string, { taxRate: string; type: string }>;
    formsOfReceiving: Record<
      string,
      {
        taxRate: string;
        type: string;
        receiveTime?: string;
        installments?: string[];
      }
    >;
  };
  onBankCreated: () => void;
  onClose: () => void;
}

const CreateBankModal = ({
  open,
  mode,
  bankData,
  onBankCreated,
  onClose,
}: CreateBankModalProps) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

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

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setBankName("");
      setInitialBalance("");
      setInitialBalanceDate(undefined);
      setStatus("");
      setPaymentMethodsState({});
      setReceivableMethodsState({});
    } else if (bankData) {
      setBankName(bankData.name || "");
      setInitialBalance(
        bankData.initialBalance ? bankData.initialBalance.toString() : "0.00",
      );

      setInitialBalanceDate(
        bankData.initialBalanceDate
          ? new Date(bankData.initialBalanceDate)
          : undefined,
      );

      setStatus(bankData.isActive ? "active" : "inactive");

      // 📌 Correção para Recebimentos (formsOfReceiving)
      const formattedReceivables: Record<
        string,
        {
          taxRate: string;
          type: string;
          receiveTime?: string;
          installments?: string[];
        }
      > = {};

      Object.entries(bankData.formsOfReceiving).forEach(([method, values]) => {
        const upperMethod = method.toUpperCase(); // Garante consistência com as chaves

        formattedReceivables[upperMethod] = {
          taxRate: values.taxRate || "0.00",
          type: values.type || "",
          receiveTime: values.receiveTime ? values.receiveTime.toString() : "0",
          installments:
            upperMethod === "CREDIT_CARD" && values.installments
              ? values.installments.map((inst) => inst.toString()) // Transformamos os valores para string
              : [],
        };
      });

      // 📌 Correção para Pagamentos (formsOfPayment)
      const formattedPayments: Record<
        string,
        { taxRate: string; type: string }
      > = {};

      Object.entries(bankData.formsOfPayment).forEach(([method, values]) => {
        const upperMethod = method.toUpperCase();

        formattedPayments[upperMethod] = {
          taxRate: values.taxRate || "0.00",
          type: values.type || "",
        };
      });

      setPaymentMethodsState(formattedPayments);
      setReceivableMethodsState(formattedReceivables);

      console.log("🔍 Dados do banco carregados:", bankData);
      console.log("🔍 Recebimentos formatados:", formattedReceivables);
      console.log("🔍 Pagamentos formatados:", formattedPayments);
    }
  }, [open, mode, bankData]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) {
      onClose();
    }

    if (mode !== "edit" && mode !== "view") {
      setBankName("");
      setInitialBalance("");
      setInitialBalanceDate(undefined);
      setStatus("");
      setPaymentMethodsState({});
      setReceivableMethodsState({});
    }
  }, [open, mode, onClose]);

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
          newState[method] = { taxRate: "", type: "", receiveTime: "" };
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

    if (field === "type") {
      formattedValue =
        value.toUpperCase() === "PERCENTAGE" || value === "Porcentagem"
          ? "PERCENTAGE"
          : "CASH";
    }

    const upperMethod = method.toUpperCase();

    if (type === "payments") {
      setPaymentMethodsState((prev) => ({
        ...prev,
        [upperMethod]: prev[upperMethod]
          ? { ...prev[upperMethod], [field]: formattedValue }
          : { taxRate: "", type: formattedValue },
      }));
    } else {
      setReceivableMethodsState((prev) => ({
        ...prev,
        [upperMethod]: prev[upperMethod]
          ? { ...prev[upperMethod], [field]: formattedValue }
          : { taxRate: "", type: formattedValue, receiveTime: "" },
      }));
    }
  };

  const handleInstallmentChange = (index: number, value: string) => {
    setReceivableMethodsState((prev) => {
      const updatedInstallments = [
        ...(prev["CREDIT_CARD"]?.installments || []),
      ];
      updatedInstallments[index] = value;

      return {
        ...prev,
        CREDIT_CARD: {
          ...prev["CREDIT_CARD"],
          installments: updatedInstallments,
        },
      };
    });
  };
  const paymentMethodMapping: Record<string, PaymentType> = {
    PIX: "PIX",
    CRÉDITO: "CREDIT_CARD",
    DÉBITO: "DEBIT_CARD",
    BOLETO: "BILL",
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

        const consolidatedCreditCard = {
          ...receivableMethodsState["CRÉDITO"],
          installments:
            receivableMethodsState["CREDIT_CARD"]?.installments || [],
        };

        const formsOfReceiving = Object.entries(receivableMethodsState)
          .map(([method, values]) => {
            const formattedMethod: PaymentType =
              method.toUpperCase() === "CRÉDITO"
                ? "CREDIT_CARD"
                : (paymentMethodMapping[method] as PaymentType);

            const receivingMethod: {
              method: PaymentType;
              receiveTimeInDays: number;
              taxRate: number;
              typeOfRate: RateType | null | undefined;
              installments?: { installmentNumber: number; taxRate: number }[];
            } = {
              method: formattedMethod,
              receiveTimeInDays: Number(values?.receiveTime || 0),
              taxRate: values?.taxRate ? Number(values.taxRate) : 0,
              typeOfRate: values?.type ? (values.type as RateType) : undefined,
            };

            if (
              formattedMethod === "CREDIT_CARD" &&
              consolidatedCreditCard.installments?.length
            ) {
              receivingMethod.installments = consolidatedCreditCard.installments
                .map((taxRate, index) => ({
                  installmentNumber: index + 1,
                  taxRate: Number(taxRate) || 0,
                }))
                .filter((installment) => installment.taxRate > 0);
            }

            return receivingMethod;
          })
          .filter((method) => method.method);

        const formsOfPayment = Object.entries(paymentMethodsState).length
          ? Object.entries(paymentMethodsState).map(([method, values]) => ({
              method: paymentMethodMapping[method] ?? method,
              taxRate: values?.taxRate ? Number(values.taxRate) : 0,
              typeOfRate: values?.type ? (values.type as RateType) : undefined,
            }))
          : [];

        const payload = {
          name: bankName,
          initialBalance: parseFloat(formattedInitialBalance),
          initialBalanceDate: new Date(initialBalanceDate),
          isActive: status === "active",
          formsOfReceiving,
          formsOfPayment,
        };

        const result = await createBank(payload);

        if (result.success) {
          console.log("✅ Banco criado com sucesso!");
          onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[80%] h-[80vh] flex flex-col overflow-hidden rounded-md md:w-full">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {isViewMode
              ? "Visualizar Banco"
              : isEditMode
                ? "Editar Banco"
                : "Criar Banco"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 text-xs md:text-sm">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Nome do Banco*"
              className="text-xs md:text-sm"
              value={bankName}
              disabled={isViewMode}
              onChange={(e) => setBankName(e.target.value)}
            />
            <Input
              placeholder="Saldo Inicial*"
              className="text-xs md:text-sm"
              type="number"
              value={initialBalance}
              disabled={isViewMode}
              onChange={(e) => setInitialBalance(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Data do Saldo Inicial*"
              className="text-xs md:text-sm"
              disabled={isViewMode}
              value={
                initialBalanceDate instanceof Date &&
                !isNaN(initialBalanceDate.getTime())
                  ? format(initialBalanceDate, "yyyy-MM-dd", { locale: ptBR })
                  : ""
              }
              onChange={(e) =>
                setInitialBalanceDate(
                  e.target.value ? new Date(e.target.value) : undefined,
                )
              }
            />
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
              disabled={isViewMode}
            >
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
            <TabsList className="flex justify-between w-full">
              <TabsTrigger value="payments" className="w-full">
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="receivables" className="w-full">
                Recebimentos
              </TabsTrigger>
            </TabsList>

            {["payments", "receivables"].map((type) => (
              <TabsContent
                key={type}
                value={type}
                className="flex gap-2 w-full overflow-y-auto flex-grow p-2 items-start "
              >
                <ScrollArea className="h-[450px] w-full flex gap-2 px-2">
                  {paymentMethods.map((method) => {
                    const isPayment = type === "payments";

                    return (
                      <div
                        key={method}
                        className="flex flex-col gap-2 w-full pt-1"
                      >
                        <div className="flex items-center w-full gap-2">
                          <Checkbox
                            id={method}
                            checked={
                              !!(isPayment
                                ? paymentMethodsState[method.toUpperCase()]
                                : receivableMethodsState[method.toUpperCase()])
                            }
                            disabled={isViewMode}
                            onCheckedChange={() =>
                              toggleMethod(
                                method.toUpperCase(),
                                type as "payments" | "receivables",
                              )
                            }
                          />
                          <Label htmlFor={method}>{method}</Label>
                        </div>

                        {(isPayment
                          ? paymentMethodsState[method.toUpperCase()]
                          : receivableMethodsState[method.toUpperCase()]) && (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex flex-row w-full gap-2">
                              <Input
                                placeholder="Taxa"
                                disabled={isViewMode}
                                className="text-xs md:text-sm"
                                type="number"
                                value={
                                  (isPayment
                                    ? paymentMethodsState[method.toUpperCase()]
                                        ?.taxRate
                                    : receivableMethodsState[
                                        method.toUpperCase()
                                      ]?.taxRate) || ""
                                }
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
                                value={
                                  type === "payments"
                                    ? paymentMethodsState[method.toUpperCase()]
                                        ?.type || ""
                                    : receivableMethodsState[
                                        method.toUpperCase()
                                      ]?.type || ""
                                }
                                disabled={isViewMode}
                                onValueChange={(value) =>
                                  handleChange(
                                    type as "payments" | "receivables",
                                    method.toUpperCase(),
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
                                  <SelectItem value="CASH">
                                    Valor Fixo
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex flex-row w-full gap-2">
                              {!isPayment && method !== "PIX" && (
                                <Input
                                  placeholder="Tempo de Recebimento (dias)"
                                  className="text-xs md:text-sm"
                                  type="number"
                                  disabled={isViewMode}
                                  value={
                                    receivableMethodsState[method.toUpperCase()]
                                      ?.receiveTime || ""
                                  }
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
                                  onChange={(e) => {
                                    const newInstallments = Number(
                                      e.target.value,
                                    );

                                    setInstallments(newInstallments);

                                    setReceivableMethodsState((prev) => ({
                                      ...prev,
                                      ["CREDIT_CARD"]: {
                                        ...prev["CREDIT_CARD"],
                                        installments: new Array(
                                          newInstallments,
                                        ).fill(""),
                                      },
                                    }));
                                  }}
                                  placeholder="Número de Parcelas"
                                  className="text-xs md:text-sm"
                                />
                              )}
                            </div>

                            {method === "Crédito" &&
                              !isPayment &&
                              installments && (
                                <div className="grid grid-cols-2 gap-2 w-full mb-2">
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
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {!isViewMode && (
          <DialogFooter className="absolute bottom-4 flex justify-center items-center w-full mt-4 gap-2  right-0 px-2">
            <Button variant="outline" onClick={handleClose} className="w-full">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateBankModal;
