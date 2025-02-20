"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "@/app/_components/ui/sheet";

import { useEffect, useState, useTransition } from "react";
import { ExtendedBank } from "./bankTable";

import { Button } from "@/app/_components/ui/button";
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { Input } from "@/app/_components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/app/_components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/app/_lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { ptBR } from "date-fns/locale";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/_components/ui/tabs";

import { Label } from "@/app/_components/ui/label";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { useToast } from "@/app/_hooks/use-toast";

interface CreateBankModalProps {
  open: boolean;
  mode: "view" | "edit" | "create";
  bankData?: ExtendedBank;
  onBankCreated: () => void;
  onClose: () => void;
}

const BankSheet = ({
  open,
  mode,
  bankData,
  onBankCreated,
  onClose,
}: CreateBankModalProps) => {
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";
  const [bank, setBank] = useState(() => ({
    name: "" as unknown,
    initialBalance: 0 as unknown,
    initialBalanceDate: undefined as unknown,
    isActive: undefined as unknown,
    formsOfPayment: {} as unknown,
    formsOfReceiving: {} as unknown,
  }));
  const [isOpen, setIsOpen] = useState(open);
  const [isModal, setIsModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bankName, setBankName] = useState<string>(bankData?.name || "");
  const [initialBalance, setInitialBalance] = useState<string>(
    bankData?.initialBalance?.toString().replace(".", ",") || "",
  );
  const [initialBalanceDate, setInitialBalanceDate] = useState<
    Date | undefined
  >();
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const methods = ["BILL", "PIX", "DEBIT_CARD", "CREDIT_CARD"] as const;
  const formattedMethods = {
    BILL: "Boleto",
    PIX: "Pix",
    DEBIT_CARD: "Cartão de Débito",
    CREDIT_CARD: "Cartão de Crédito",
  };
  const [paymentMethodsState, setPaymentMethodsState] = useState<
    Record<
      string,
      {
        taxRate: string;
        type: string;
      }
    >
  >({});
  const [receivableMethodsState, setReceivableMethodsState] = useState<
    Record<
      string,
      {
        taxRate: string;
        type: string;
        receiveTimeInDays?: string;
        installments?: string[];
      }
    >
  >({});

  const [installments, setInstallments] = useState<number>();
  const { toast } = useToast();

  useEffect(() => {
    if (!open) return;

    if (mode === "create") {
      setBankName("");
      setInitialBalance("");
      setInitialBalanceDate(undefined);
      setIsActive(undefined);
      setPaymentMethodsState({});
      setReceivableMethodsState({});
    }

    if (bankData) {
      setBankName(bankData.name);
      setInitialBalance(bankData.initialBalance.toString().replace(".", ","));
      setInitialBalanceDate(new Date(bankData.initialBalanceDate));
      setIsActive(bankData.isActive ?? true);
      if (bankData.formsOfPayment.length > 0) {
        setPaymentMethodsState(
          Object.fromEntries(
            bankData.formsOfPayment.map((payment) => [
              payment.method,
              {
                taxRate: payment.taxRate.toString(),
                type: payment.typeOfRate || "",
              },
            ]),
          ),
        );
      }

      if (bankData.formsOfReceiving.length > 0) {
        setReceivableMethodsState(
          Object.fromEntries(
            bankData.formsOfReceiving.map((receiving) => [
              receiving.method,
              {
                taxRate: receiving.taxRate.toString(),
                type: receiving.typeOfRate || "",
                receiveTimeInDays: receiving.receiveTimeInDays?.toString(),
                installments: receiving.installments?.map((inst) =>
                  inst.taxRate.toString(),
                ),
              },
            ]),
          ),
        );

        setInstallments(
          receivableMethodsState["CREDIT_CARD"]?.installments?.length,
        );
      }
    }
  }, [bankData, open, mode]);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    setReceivableMethodsState((prev) => {
      const creditCardState = prev["CREDIT_CARD"];

      if (!creditCardState) return prev;

      const currentInstallments = creditCardState.installments || [];
      let newInstallments = [...currentInstallments];

      if (
        installments !== undefined &&
        installments < currentInstallments.length
      ) {
        newInstallments = newInstallments.slice(0, installments);
      } else {
        while (
          installments !== undefined &&
          newInstallments.length < installments
        ) {
          newInstallments.push("");
        }
      }

      return {
        ...prev,
        CREDIT_CARD: {
          ...creditCardState,
          installments: newInstallments,
        },
      };
    });
  }, [installments]);

  const handleClose = () => {
    setIsModal(true);
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    const formsofPayment = Object.entries(paymentMethodsState).map(
      ([method, values]) => ({
        method,
        taxRate: values.taxRate
          ? parseFloat(values.taxRate.replace(",", ".")) || 0
          : 0,
        type: values.type || "CASH",
      }),
    );

    const formatedInsallment =
      receivableMethodsState.CREDIT_CARD?.installments?.map((rate, index) => {
        return {
          installmentNumber: index + 1,
          taxRate: rate ? parseFloat(rate.replace(",", ".")) : 0,
        };
      });

    const formsofReceiving = Object.entries(receivableMethodsState).map(
      ([method, values]) => ({
        method,
        taxRate: values.taxRate
          ? parseFloat(values.taxRate.replace(",", "."))
          : 0,
        type: values.type || "CASH",
        receiveTimeInDays: values.receiveTimeInDays
          ? Number(values.receiveTimeInDays)
          : 0,
        ...(method === "CREDIT_CARD" && { installments: formatedInsallment }),
      }),
    );

    setBank((prev) => ({
      ...prev,
      name: bankName,
      initialBalance: parseFloat(initialBalance.replace(",", ".")),

      initialBalanceDate: initialBalanceDate,

      isActive: isActive,
      formsOfPayment: formsofPayment,
      formsOfReceiving: formsofReceiving,
    }));
  }, [
    paymentMethodsState,
    receivableMethodsState,
    bankName,
    initialBalance,
    initialBalanceDate,
    isActive,
  ]);

  const handleSubmitButton = async () => {
    startTransition(async () => {
      try {
        if (
          !bankName ||
          !initialBalance ||
          !initialBalanceDate ||
          isActive === undefined
        ) {
          toast({
            title: "Erro ao criar banco",
            description: "Preencha todos os campos obrigatórios",
            variant: "destructive",
          });
          return;
        }

        const body = bank;
        if (mode === "create") {
          const response = await fetch("/api/banks/createBank", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const responseData = await response.json();

          if (responseData.status === 201) {
            toast({
              title: "Sucesso!",
              description: "Banco criado com sucesso.",
              variant: "default",
            });
            onBankCreated();
            handleClose();
          }

          if (responseData.error) {
            toast({
              title: "Erro ao criar banco",
              description: responseData.error,
              variant: "destructive",
            });
          }
        }

        if (mode === "edit") {
          const response = await fetch(`/api/banks/editBank/${bankData?.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });

          const responseData = await response.json();

          if (responseData.status === 200) {
            toast({
              title: "Sucesso!",
              description: "Banco editado com sucesso.",
              variant: "default",
            });
            onBankCreated();
            handleClose();
          }

          if (responseData.error) {
            toast({
              title: "Erro ao editar banco",
              description: responseData.error,
              variant: "destructive",
            });
          }
        }
      } catch (e) {
        toast({
          title: "Erro ao criar banco",
          description: "Ocorreu um erro ao criar o banco",
          variant: "destructive",
        });
        console.error(e);
      }
    });
  };

  return (
    <Sheet open={isOpen} modal={isModal}>
      <SheetContent
        side="right"
        className="flex flex-col gap-4 h-full justify-between "
      >
        <SheetHeader className="flex ">
          <h2 className="text-lg font-bold">
            {isViewMode
              ? "Vizualizar Banco"
              : isEditMode
                ? "Editar Banco"
                : "Adicionar Novo Banco"}
          </h2>
        </SheetHeader>
        <div className="flex flex-col h-auto gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              id="name"
              placeholder="Nome do Banco"
              className="text-xs md:text-sm"
              value={bankName}
              readOnly={isViewMode || bankData?.name === "CAIXA"}
              onChange={(e) => setBankName(e.target.value)}
              onBlur={() => {
                setBankName(
                  bankName
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase()),
                );
              }}
            />
            <Input
              type="text"
              placeholder="Saldo Inicial"
              value={initialBalance ? `R$ ${initialBalance}` : ""}
              readOnly={isViewMode}
              onChange={(e) => {
                let rawValue = e.target.value;

                rawValue = rawValue.replace(/[^0-9,]/g, "");

                if ((rawValue.match(/,/g) || []).length > 1) return;

                if (rawValue.includes(",")) {
                  const [intPart, decimalPart] = rawValue.split(",");
                  rawValue =
                    decimalPart.length > 2
                      ? `${intPart},${decimalPart.slice(0, 2)}`
                      : rawValue;
                }

                setInitialBalance(rawValue);
              }}
              onBlur={() => {
                if (initialBalance) {
                  if (!initialBalance.includes(",")) {
                    setInitialBalance(`${initialBalance},00`);
                  } else {
                    const [intPart, decimalPart] = initialBalance.split(",");
                    if (decimalPart.length === 1) {
                      setInitialBalance(`${intPart},${decimalPart}0`);
                    }
                  }
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal p-2 gap-1",
                    !initialBalanceDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon />
                  {initialBalanceDate ? (
                    format(new Date(initialBalanceDate), "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Data do Saldo</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    initialBalanceDate
                      ? new Date(initialBalanceDate)
                      : undefined
                  }
                  onSelect={(date) => {
                    setInitialBalanceDate(date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select
              value={
                isActive == true
                  ? "active"
                  : isActive == false
                    ? "inactive"
                    : ""
              }
              onValueChange={(value) => setIsActive(value === "active")}
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
        </div>
        {bankData?.name != "CAIXA" ? (
          <Tabs
            defaultValue="payments"
            className="flex flex-col gap-4 w-full h-full"
          >
            <TabsList className="flex justify-between w-full h-[40px]">
              <TabsTrigger value="payments" className="w-full h-full ">
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="receivables" className="w-full h-full">
                Recebimentos
              </TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[65vh] md:h-[70vh] max-h-screen border-input bg-transparent border-solid border-[1px] rounded-sm pb-2 shadow-sm transition-colors px-2 ">
              <ScrollBar orientation="vertical" />
              <TabsContent value="payments" className="h-full">
                <div className="flex flex-col gap-4">
                  {methods.map((method) => (
                    <div key={method} className=" gap-2 flex flex-col">
                      <div className="flex gap-2 items-center mt-2">
                        <Checkbox
                          id="Pix"
                          className="size-5 "
                          disabled={isViewMode}
                          checked={!!paymentMethodsState[method]}
                          onCheckedChange={(checked) => {
                            if (isViewMode) return;

                            setPaymentMethodsState((prevState) => {
                              const newState = { ...prevState };

                              if (checked === true) {
                                newState[method] = { taxRate: "", type: "" };
                              } else {
                                delete newState[method];
                              }
                              return newState;
                            });
                          }}
                        />
                        <Label htmlFor={method} className="text-xs md:text-sm">
                          {formattedMethods[method]}
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Taxa"
                          disabled={!paymentMethodsState[method]}
                          className="text-xs md:text-sm "
                          readOnly={isViewMode}
                          value={
                            paymentMethodsState[method]?.taxRate
                              ? paymentMethodsState[method].type ===
                                "PERCENTAGE"
                                ? `${paymentMethodsState[method].taxRate}%`
                                : paymentMethodsState[method].type === "CASH"
                                  ? `R$ ${paymentMethodsState[method].taxRate}`
                                  : paymentMethodsState[method].taxRate
                              : ""
                          }
                          onChange={(e) => {
                            if (isViewMode || !paymentMethodsState[method])
                              return;

                            let rawValue = e.target.value.replace(
                              /[^0-9,]/g,
                              "",
                            );

                            if (rawValue.includes(",")) {
                              const [intPart, decimalPart] =
                                rawValue.split(",");
                              rawValue =
                                decimalPart.length > 2
                                  ? `${intPart},${decimalPart.slice(0, 2)}`
                                  : rawValue;
                            }

                            setPaymentMethodsState((prev) => ({
                              ...prev,
                              [method]: { ...prev[method], taxRate: rawValue },
                            }));
                          }}
                          onBlur={() => {
                            if (
                              !paymentMethodsState[method] ||
                              !paymentMethodsState[method].taxRate
                            )
                              return;

                            let tax = paymentMethodsState[method].taxRate;

                            if (!tax.includes(",")) tax += ",00";
                            else if (tax.split(",")[1]?.length === 1)
                              tax += "0";

                            setPaymentMethodsState((prev) => ({
                              ...prev,
                              [method]: { ...prev[method], taxRate: tax },
                            }));
                          }}
                        />
                        <Select
                          value={paymentMethodsState[method]?.type ?? ""}
                          onValueChange={(value) => {
                            setPaymentMethodsState((prev) => ({
                              ...prev,
                              [method]: {
                                ...prev[method],
                                type: value as "CASH" | "PERCENTAGE",
                              },
                            }));
                          }}
                          disabled={isViewMode || !paymentMethodsState[method]}
                        >
                          <SelectTrigger className="text-xs md:text-sm">
                            <SelectValue placeholder="Tipo de Taxa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">
                              Porcentagem
                            </SelectItem>
                            <SelectItem value="CASH">Valor Fixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent
                value="receivables"
                className="h-full max-h-full overflow-hidden"
              >
                <div className="flex flex-col gap-4 h-full max-h-full overflow-y-auto">
                  {methods.map((method) => (
                    <div key={method} className=" gap-2 flex flex-col">
                      <div className="flex gap-2 items-center mt-2">
                        <Checkbox
                          id="Pix"
                          className="size-5 "
                          disabled={isViewMode}
                          checked={!!receivableMethodsState[method]}
                          onCheckedChange={(checked) => {
                            if (isViewMode) return;

                            setReceivableMethodsState((prevState) => {
                              const newState = { ...prevState };

                              if (checked === true) {
                                newState[method] = { taxRate: "", type: "" };
                              } else {
                                delete newState[method];
                                if (method === "CREDIT_CARD")
                                  setInstallments(0);
                              }

                              return newState;
                            });
                          }}
                        />
                        <Label htmlFor={method} className="text-xs md:text-sm">
                          {formattedMethods[method]}
                        </Label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Taxa"
                          disabled={!receivableMethodsState[method]}
                          className="text-xs md:text-sm "
                          readOnly={isViewMode}
                          value={
                            receivableMethodsState[method]?.taxRate
                              ? receivableMethodsState[method].type ===
                                "PERCENTAGE"
                                ? `${receivableMethodsState[method].taxRate}%`
                                : receivableMethodsState[method].type === "CASH"
                                  ? `R$ ${receivableMethodsState[method].taxRate}`
                                  : receivableMethodsState[method].taxRate
                              : ""
                          }
                          onChange={(e) => {
                            if (isViewMode || !receivableMethodsState[method])
                              return;

                            let rawValue = e.target.value.replace(
                              /[^0-9,]/g,
                              "",
                            );

                            if (rawValue.includes(",")) {
                              const [intPart, decimalPart] =
                                rawValue.split(",");
                              rawValue =
                                decimalPart.length > 2
                                  ? `${intPart},${decimalPart.slice(0, 2)}`
                                  : rawValue;
                            }

                            setReceivableMethodsState((prev) => ({
                              ...prev,
                              [method]: { ...prev[method], taxRate: rawValue },
                            }));
                          }}
                          onBlur={() => {
                            if (
                              !receivableMethodsState[method] ||
                              !receivableMethodsState[method].taxRate
                            )
                              return;

                            let tax = receivableMethodsState[method].taxRate;

                            if (!tax.includes(",")) tax += ",00";
                            else if (tax.split(",")[1]?.length === 1)
                              tax += "0";

                            setReceivableMethodsState((prev) => ({
                              ...prev,
                              [method]: { ...prev[method], taxRate: tax },
                            }));
                          }}
                        />
                        <Select
                          value={receivableMethodsState[method]?.type ?? ""}
                          onValueChange={(value) => {
                            setReceivableMethodsState((prev) => ({
                              ...prev,
                              [method]: {
                                ...prev[method],
                                type: value as "CASH" | "PERCENTAGE",
                              },
                            }));
                          }}
                          disabled={
                            isViewMode || !receivableMethodsState[method]
                          }
                        >
                          <SelectTrigger className="text-xs md:text-sm">
                            <SelectValue placeholder="Tipo de Taxa" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PERCENTAGE">
                              Porcentagem
                            </SelectItem>
                            <SelectItem value="CASH">Valor Fixo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Recebimento (dias)"
                          disabled={!receivableMethodsState[method]}
                          className="text-xs md:text-sm"
                          readOnly={isViewMode}
                          value={
                            receivableMethodsState[method]?.receiveTimeInDays ??
                            ""
                          }
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\D/g, "");

                            setReceivableMethodsState((prev) => ({
                              ...prev,
                              [method]: {
                                ...prev[method],
                                receiveTimeInDays: rawValue,
                              },
                            }));
                          }}
                        />
                        {method === "CREDIT_CARD" && (
                          <Input
                            placeholder="Parcelas"
                            disabled={!receivableMethodsState[method]}
                            className="text-xs md:text-sm"
                            readOnly={isViewMode}
                            maxLength={2}
                            value={installments == 0 ? "" : installments}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(
                                /\D/g,
                                "",
                              );

                              const numericValue = Math.min(
                                Number(rawValue),
                                21,
                              );

                              setInstallments(numericValue);
                            }}
                          />
                        )}
                      </div>
                      {installments && method === "CREDIT_CARD" ? (
                        <div className="grid grid-cols-2 gap-2">
                          {[...Array(installments)].map((_, i) => (
                            <div key={i} className="flex flex-row gap-2">
                              <Input
                                value={i + 1}
                                readOnly
                                className="text-xs md:text-sm w-[40%] text-center"
                              />

                              <Input
                                placeholder="%"
                                className="text-xs md:text-sm w-full text-right"
                                value={
                                  receivableMethodsState[method]
                                    ?.installments?.[i]
                                    ? `${receivableMethodsState[method].installments[i]}%`
                                    : ""
                                }
                                onChange={(e) => {
                                  let rawValue = e.target.value.replace(
                                    /[^0-9,]/g,
                                    "",
                                  );

                                  if (!rawValue) {
                                    setReceivableMethodsState((prev) => ({
                                      ...prev,
                                      [method]: {
                                        ...prev[method],
                                        installments: (
                                          prev[method]?.installments ?? []
                                        ).map((value, index) =>
                                          index === i ? "" : value || "",
                                        ),
                                      },
                                    }));
                                    return;
                                  }

                                  if (rawValue.includes(",")) {
                                    const [intPart, decimalPart] =
                                      rawValue.split(",");
                                    rawValue =
                                      decimalPart.length > 2
                                        ? `${intPart},${decimalPart.slice(0, 2)}`
                                        : rawValue;
                                  }

                                  const numericValue = rawValue.replace(
                                    ",",
                                    ".",
                                  );
                                  if (parseFloat(numericValue) > 100) return;

                                  setReceivableMethodsState((prev) => ({
                                    ...prev,
                                    [method]: {
                                      ...prev[method],
                                      installments: prev[method]?.installments
                                        ? prev[method].installments.map(
                                            (value, index) =>
                                              index === i
                                                ? rawValue
                                                : value || "",
                                          )
                                        : Array(installments)
                                            .fill("")
                                            .map((_, index) =>
                                              index === i ? rawValue : "",
                                            ),
                                    },
                                  }));
                                }}
                                onBlur={() => {
                                  if (
                                    !receivableMethodsState[method]
                                      ?.installments?.[i]
                                  )
                                    return;

                                  let tax =
                                    receivableMethodsState[method].installments[
                                      i
                                    ];

                                  if (!tax.includes(",")) tax += ",00";
                                  else if (tax.split(",")[1]?.length === 1)
                                    tax += "0";

                                  setReceivableMethodsState((prev) => ({
                                    ...prev,
                                    [method]: {
                                      ...prev[method],
                                      installments: (
                                        prev[method]?.installments ?? []
                                      ).map((value, index) =>
                                        index === i ? tax : value || "",
                                      ),
                                    },
                                  }));
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        ) : (
          <ScrollArea className="h-[65vh] md:h-[70vh] max-h-screen pb-2 px-2 "></ScrollArea>
        )}

        <SheetFooter className="justify-self-end">
          {!isViewMode ? (
            <div className="flex  w-full gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full"
              >
                Cancelar
              </Button>
              {!isViewMode && (
                <Button className="w-full" onClick={handleSubmitButton}>
                  {isCreateMode
                    ? isPending
                      ? "Criando Banco..."
                      : "Criar Banco"
                    : isPending
                      ? "Editando Banco..."
                      : "Editar Banco"}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex  w-full gap-2">
              <Button variant="black" onClick={handleClose} className="w-full">
                Fechar
              </Button>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default BankSheet;
