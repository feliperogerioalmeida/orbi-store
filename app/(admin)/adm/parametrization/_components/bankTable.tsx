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
import { Eye, Pencil, BarChart, Trash, MoreHorizontal } from "lucide-react";
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
  formsOfReceiving: string[];
  formsOfPayment: string[];
  hasMovements?: boolean;
}

const formatMethods = (methods: string[]) => {
  return methods.length ? methods.map((m) => m.toUpperCase()).join(", ") : "-";
};

const BankTable = () => {
  const [data, setData] = useState<Bank[]>([]);

  const fetchData = async () => {
    const result = await getBanks();
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnDef<Bank>[] = [
    {
      accessorKey: "name",
      header: "Nome do Banco",
      cell: ({ row }) => (
        <span className="font-regular">{row.original.name}</span>
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
              <DropdownMenuItem asChild>
                <Link href="">
                  <Eye size={16} className="mr-2" />
                  Visualizar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="">
                  <Pencil size={16} className="mr-2" />
                  Editar
                </Link>
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
        <CreateBankModal onBankCreated={fetchData} />
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
    </div>
  );
};

export default BankTable;
