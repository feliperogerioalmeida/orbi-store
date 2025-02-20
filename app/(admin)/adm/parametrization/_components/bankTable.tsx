"use client";
import { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import {
  Eye,
  Pencil,
  BarChart,
  Trash,
  MoreHorizontal,
  Plus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Link from "next/link";

import { useToast } from "@/app/_hooks/use-toast";
import BankSheet from "./bankSheet";
import {
  Account,
  Bank,
  Installment,
  Movement,
  PaymentMethod,
  ReceivingMethod,
} from "@prisma/client";

interface ExtendedFormsOfReceiving extends ReceivingMethod {
  receiveTime: string;
  type: string;
  installments?: Installment[];
}

interface ExtendedAccount extends Account {
  movements: Movement[];
}
export interface ExtendedBank extends Bank {
  formsOfReceiving: ExtendedFormsOfReceiving[];
  formsOfPayment: PaymentMethod[];
  account: ExtendedAccount;
}

const BankTable = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<ExtendedBank[]>([]);
  const [selectedBank, setSelectedBank] = useState<ExtendedBank | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  const { toast } = useToast();
  const paymentMethodMap: Record<string, string> = {
    PIX: "Pix",
    BILL: "Boleto",
    CREDIT_CARD: "Cartão de Crédito",
    DEBIT_CARD: "Cartão de Débito",
    CASH: "Dinheiro",
  };

  const formatMethods = (methods: { method: string }[]) => {
    return methods.length
      ? methods.map((m) => paymentMethodMap[m.method]).join(" | ")
      : "-";
  };

  const openModal = (
    bank: ExtendedBank | null,
    mode: "create" | "edit" | "view",
  ) => {
    setSelectedBank(bank);
    setModalMode(mode);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBank(null);
    setOpen(false);
  };

  const fetchData = async () => {
    const res = await fetch("/api/banks/getBanks");
    const json = await res.json();
    const data = json.banks;

    setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatBankName = (name: string) => {
    return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este banco?")) {
      fetch(`/api/banks/deleteBank/${id}`, {
        method: "DELETE",
      }).then(() => {
        toast({
          title: "Sucesso!",
          description: "Banco excluido com sucesso.",
          variant: "default",
        });
        fetchData();
      });
    }
  };

  const columns: ColumnDef<ExtendedBank>[] = [
    {
      accessorKey: "name",
      header: "Nome do Banco",
      cell: ({ row }) => (
        <span className="font-regular">
          {formatBankName(row.original.name)}
        </span>
      ),
    },
    {
      accessorKey: "formsOfReceiving",
      header: "Recebimentos",
      cell: ({ row }) => formatMethods(row.original.formsOfReceiving),
    },
    {
      accessorKey: "formsOfPayment",
      header: "Pagamentos",
      cell: ({ row }) => formatMethods(row.original.formsOfPayment),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openModal(row.original, "view")}>
                <Eye size={16} className="mr-2" />
                Visualizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal(row.original, "edit")}>
                <Pencil size={16} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="">
                  <BarChart size={16} className="mr-2" />
                  Ver Movimentações
                </Link>
              </DropdownMenuItem>
              {row.original.account.movements.length == 0 &&
                row.original.name.toUpperCase() != "CAIXA" && (
                  <DropdownMenuItem
                    className="text-red-500 hover:bg-red-100"
                    onClick={() => handleDeleteClick(row.original.id)}
                  >
                    <Trash size={16} className="mr-2" />
                    Excluir
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="relative mt-4">
      <div className="mb-4 flex justify-end">
        <Button
          className="hidden md:flex "
          onClick={() => {
            openModal(null, "create");
          }}
        >
          Criar Banco
        </Button>

        <BankSheet
          open={open}
          mode={modalMode}
          bankData={selectedBank || undefined}
          onBankCreated={fetchData}
          onClose={handleCloseModal}
        />
      </div>
      <div className="border rounded-lg overflow-hidden pl-2">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.original.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Nenhum banco encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button
        onClick={() => openModal(null, "create")}
        className="fixed bottom-8 right-8 md:hidden rounded-full p-3 shadow-lg"
      >
        <Plus size={20} />
      </Button>
    </div>
  );
};

export default BankTable;
