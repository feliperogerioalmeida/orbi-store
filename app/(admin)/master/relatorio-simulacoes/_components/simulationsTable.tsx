"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

interface SimulationProps {
  id: string;
  model: string;
  color: string;
  capacity: string;
  batteryHealth: string;
  issues: string;
  estimatedValue: number;
  createdAt: Date;
  user?: {
    id: string;
    firstName: string | null;
    email: string;
    lastName: string | null;
  } | null;
  imageUrl?: string;
}

const SimulationsTable = ({
  simulations,
}: {
  simulations: SimulationProps[];
}) => {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
  const [selectedSimulation, setSelectedSimulation] =
    useState<SimulationProps | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [localSimulations, setLocalSimulations] = useState(simulations);

  useEffect(() => {
    setLocalSimulations(simulations);
  }, [simulations]);

  const handleViewClick = (simulation: SimulationProps) => {
    setSelectedSimulation(simulation);
    setIsDialogOpen(true);
  };

  const columns: ColumnDef<SimulationProps>[] = [
    {
      accessorKey: "model",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-start p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modelo
        </Button>
      ),
    },
    {
      accessorKey: "color",
      header: "Cor",
    },
    {
      accessorKey: "capacity",
      header: "Capacidade",
    },
    {
      accessorKey: "batteryHealth",
      header: "Saúde da Bateria",
    },
    {
      accessorKey: "issues",
      header: "Problemas Relatados",
    },
    {
      accessorKey: "estimatedValue",
      header: "Valor Estimado",
      cell: ({ row }) => `R$ ${row.original.estimatedValue.toFixed(2)}`,
    },
    {
      accessorKey: "user",
      header: "Usuário",
      cell: ({ row }) =>
        row.original.user && row.original.user.firstName
          ? `${row.original.user.firstName} ${row.original.user.lastName ?? ""}`.trim()
          : "Desconhecido",
    },
    {
      accessorKey: "createdAt",
      header: "Data de Criação",
      enableSorting: true,
      sortingFn: "datetime",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewClick(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Ação 1</DropdownMenuItem>
              <DropdownMenuItem>Ação 2</DropdownMenuItem>
              <DropdownMenuItem>Ação 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: localSimulations,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 20,
      },
    },
  });

  return (
    <div className="relative">
      <div className="rounded-md border border-gray-300 overflow-hidden">
        <Table className="w-full border-collapse">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 border-b border-gray-300"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`${
                      header.id === "actions" ? "text-center" : "text-left"
                    } text-nowrap text-sm`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-sm text-left p-2">
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
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhuma simulação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center py-4 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Simulação</DialogTitle>
          </DialogHeader>
          {selectedSimulation ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <p>
                  <strong>Modelo:</strong> {selectedSimulation.model}
                </p>
                <p>
                  <strong>Cor:</strong> {selectedSimulation.color}
                </p>
                <p>
                  <strong>Capacidade:</strong> {selectedSimulation.capacity}
                </p>
                <p>
                  <strong>Saúde da Bateria:</strong>{" "}
                  {selectedSimulation.batteryHealth}
                </p>
                <p>
                  <strong>Problemas Relatados:</strong>{" "}
                  {selectedSimulation.issues}
                </p>
                <p>
                  <strong>Valor Estimado:</strong> R${" "}
                  {selectedSimulation.estimatedValue.toFixed(2)}
                </p>
                <p>
                  <strong>Usuário:</strong>{" "}
                  {selectedSimulation.user
                    ? `${selectedSimulation.user.firstName ?? ""} ${selectedSimulation.user.lastName ?? ""}`.trim()
                    : "Desconhecido"}
                </p>
                <p>
                  <strong>Data de Criação:</strong>{" "}
                  {new Date(selectedSimulation.createdAt).toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
              </div>
            </div>
          ) : (
            <p>Simulação não encontrada.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SimulationsTable;
