"use client";

import React, { useState, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  ArrowUpDown,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/app/_components/ui/dropdown-menu";
import { useToast } from "@/app/_hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import Image from "next/image";

interface ConditionProps {
  id: string;
  conditionType: string;
  costPrice: number;
  sellingPrice: number;
  maxUpgradePrice: number;
}

interface CapacityProps {
  id: string;
  size: string;
  conditions: ConditionProps[];
}

interface colorsProps {
  name: string;
  imageUrl: string;
}
interface iPhoneProps {
  id: string;
  model: string;
  colors: colorsProps[];
  capacities: CapacityProps[];
}

const DataTable = ({ iphones }: { iphones: iPhoneProps[] }) => {
  const { toast } = useToast();

  const [data, setData] = useState(
    iphones.flatMap((iphone) =>
      iphone.capacities.flatMap((capacity) =>
        capacity.conditions.map((condition) => ({
          id: condition.id,
          model: iphone.model,
          capacity: capacity.size,
          conditionType: condition.conditionType,
          costPrice: condition.costPrice.toFixed(2),
          sellingPrice: condition.sellingPrice.toFixed(2),
          maxUpgradePrice: condition.maxUpgradePrice.toFixed(2),
        })),
      ),
    ),
  );

  const [selectediPhone, setSelectediPhone] = useState<iPhoneProps | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewClick = (model: string) => {
    const iphone = iphones.find((iphone) => iphone.model === model);
    setSelectediPhone(iphone || null);
    setIsDialogOpen(true);
  };

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    costPrice?: string;
    sellingPrice?: string;
    maxUpgradePrice?: string;
  } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<{ [key: string]: Set<string> }>({});

  const handleEditClick = (row: {
    id: string;
    costPrice: string;
    sellingPrice: string;
    maxUpgradePrice: string;
  }) => {
    setEditingRowId(row.id);
    setEditedValues({
      costPrice: row.costPrice,
      sellingPrice: row.sellingPrice,
      maxUpgradePrice: row.maxUpgradePrice,
    });
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedValues(null);
    setFocusedField(null);
  };

  const handleSaveClick = async () => {
    if (editingRowId && editedValues) {
      try {
        const response = await fetch(
          `/api/iphones/conditions/${editingRowId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              costPrice: parseFloat(editedValues.costPrice || "0"),
              sellingPrice: parseFloat(editedValues.sellingPrice || "0"),
              maxUpgradePrice: parseFloat(editedValues.maxUpgradePrice || "0"),
            }),
          },
        );

        if (!response.ok) {
          throw new Error("Erro ao salvar no banco de dados.");
        }

        const updatedCondition = await response.json();

        toast({
          description: "Dados salvos com sucesso!",
        });

        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingRowId
              ? {
                  ...item,
                  costPrice: updatedCondition.costPrice.toFixed(2),
                  sellingPrice: updatedCondition.sellingPrice.toFixed(2),
                  maxUpgradePrice: updatedCondition.maxUpgradePrice.toFixed(2),
                }
              : item,
          ),
        );

        setEditingRowId(null);
        setEditedValues(null);
        setFocusedField(null);
      } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao salvar os dados",
          description:
            "Não foi possível salvar os dados. Por favor, tente novamente.",
        });
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setEditedValues((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFilterChange = (columnKey: string, value: string) => {
    setFilters((prev) => {
      const columnFilters = new Set(prev[columnKey] || []);
      if (columnFilters.has(value)) {
        columnFilters.delete(value);
      } else {
        columnFilters.add(value);
      }
      return { ...prev, [columnKey]: columnFilters };
    });
  };

  const clearFilter = (columnKey: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
  };

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.entries(filters).every(([key, values]) => {
        const valueArray = Array.from(values);

        const typedKey = key as keyof typeof row;
        return (
          valueArray.length === 0 ||
          valueArray.includes(row[typedKey] as string)
        );
      }),
    );
  }, [data, filters]);

  const columns: ColumnDef<{
    id: string;
    model: string;
    capacity: string;
    conditionType: string;
    costPrice: string;
    sellingPrice: string;
    maxUpgradePrice: string;
  }>[] = [
    {
      accessorKey: "model",
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Modelo
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" ml-4">
            <DropdownMenuItem
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ordenar <ArrowUpDown className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clearFilter("model")}>
              Limpar Filtro
            </DropdownMenuItem>
            {Array.from(new Set(data.map((item) => item.model))).map(
              (value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  onCheckedChange={() => handleFilterChange("model", value)}
                  className="justify-start w-full pl-2"
                >
                  {value} {filters.model?.has(value) ? "✔" : ""}
                </DropdownMenuCheckboxItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Capacidade
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ordenar <ArrowUpDown className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clearFilter("capacity")}>
              Limpar Filtro
            </DropdownMenuItem>
            {Array.from(new Set(data.map((item) => item.capacity))).map(
              (value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  onCheckedChange={() => handleFilterChange("capacity", value)}
                  className="justify-start w-full pl-2"
                >
                  {value} {filters.capacity?.has(value) ? "✔" : ""}
                </DropdownMenuCheckboxItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "conditionType",
      header: ({ column }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Condição
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ordenar <ArrowUpDown className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => clearFilter("conditionType")}>
              Limpar Filtro
            </DropdownMenuItem>
            {Array.from(new Set(data.map((item) => item.conditionType))).map(
              (value) => (
                <DropdownMenuCheckboxItem
                  key={value}
                  onCheckedChange={() =>
                    handleFilterChange("conditionType", value)
                  }
                  className="justify-start w-full pl-2"
                >
                  {value} {filters.conditionType?.has(value) ? "✔" : ""}
                </DropdownMenuCheckboxItem>
              ),
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      accessorKey: "costPrice",
      header: "Preço de Custo",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.costPrice || ""}
            onChange={(e) => handleInputChange(e, "costPrice")}
            onFocus={() => setFocusedField("costPrice")}
            autoFocus={focusedField === "costPrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.costPrice}`
        ),
    },
    {
      accessorKey: "sellingPrice",
      header: "Preço de Venda",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.sellingPrice || ""}
            onChange={(e) => handleInputChange(e, "sellingPrice")}
            onFocus={() => setFocusedField("sellingPrice")}
            autoFocus={focusedField === "sellingPrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.sellingPrice}`
        ),
    },
    {
      accessorKey: "maxUpgradePrice",
      header: "Preço de Repasse",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <input
            type="text"
            value={editedValues?.maxUpgradePrice || ""}
            onChange={(e) => handleInputChange(e, "maxUpgradePrice")}
            onFocus={() => setFocusedField("maxUpgradePrice")}
            autoFocus={focusedField === "maxUpgradePrice"}
            className="w-full border p-1 text-sm"
          />
        ) : (
          `R$ ${row.original.maxUpgradePrice}`
        ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSaveClick}>
              Salvar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancelClick}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditClick(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewClick(row.original.model)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
    },
  });

  return (
    <div className="h-full">
      <div className="rounded-md border border-gray-300 overflow-hidden">
        <Table className="w-full border-collapse ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 border-b border-gray-300"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={`${header.id === "actions" ? "text-center" : "text-left"} text-nowrap text-sm`}
                    key={header.id}
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
                    <TableCell
                      className="text-sm text-nowrap text-left p-2"
                      key={cell.id}
                    >
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
                  Nenhum dado encontrado.
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
        <DialogContent className="w-[80%] rounded-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {selectediPhone?.model}
            </DialogTitle>
          </DialogHeader>

          {selectediPhone ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <p className="font-bold text-sm">Cores Disponíveis:</p>
                <div className="flex flex-wrap w-[90%] gap-4">
                  {selectediPhone.colors.map((color) => (
                    <div key={color.name} className="flex items-center gap-1">
                      <Image
                        src={color.imageUrl}
                        width={15}
                        height={15}
                        alt={selectediPhone.model}
                      />
                      <p className="text-xs">{color.name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-sm">Capacidades:</p>
                <div className="flex flex-wrap w-[90%] gap-4">
                  {selectediPhone.capacities.map((capacity) => (
                    <p key={capacity.id} className="text-xs">
                      {capacity.size}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p>iPhone não encontrado.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataTable;
