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
import { getBanks } from "@/app/_actions/getBanks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Link from "next/link";
import CreateBankModal from "./createBankModal";

interface Bank {
  id: string;
  name: string;
  initialBalance: string;
  initialBalanceDate: string;
  isActive: boolean;
  formsOfReceiving: { method: string }[];
  formsOfPayment: { method: string }[];
  hasMovements?: boolean;
}

const formatMethods = (methods: { method: string }[]) => {
  return methods.length ? methods.map((m) => m.method).join(" | ") : "-";
};

const BankTable = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  const openModal = (bank: Bank | null, mode: "create" | "edit" | "view") => {
    setSelectedBank(bank);
    setModalMode(mode);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBank(null);
    setOpen(false);
  };

  const mapBankToBankData = (bank: Bank | null) => {
    if (!bank) return undefined;

    return {
      id: bank.id,
      name: bank.name,
      initialBalance: bank.initialBalance,
      initialBalanceDate: bank.initialBalanceDate,
      isActive: bank.isActive,
      formsOfPayment:
        bank.formsOfPayment.reduce(
          (acc, method) => {
            acc[method.method] = { taxRate: "0", type: "" };
            return acc;
          },
          {} as Record<string, { taxRate: string; type: string }>,
        ) || {},
      formsOfReceiving:
        bank.formsOfReceiving.reduce(
          (acc, method) => {
            acc[method.method] = { taxRate: "0", type: "" };
            return acc;
          },
          {} as Record<string, { taxRate: string; type: string }>,
        ) || {},
    };
  };

  const fetchData = async () => {
    const result = (await getBanks()) as Bank[];
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatBankName = (name: string) => {
    return name.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()); // 🔥 Capitaliza a primeira letra de cada palavra
  };

  const columns: ColumnDef<Bank>[] = [
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
              {!row.original.hasMovements && (
                <DropdownMenuItem className="text-red-500 hover:bg-red-100">
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

        <CreateBankModal
          open={open}
          mode={modalMode}
          bankData={mapBankToBankData(selectedBank)}
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
