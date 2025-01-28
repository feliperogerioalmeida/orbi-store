"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/app/_components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
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
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreHorizontal,
  PlusIcon,
  Star,
} from "lucide-react";
import AddUserModal from "./addUserModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/app/_components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

interface UserProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  simulations?: SimulationProps[] | null;
  reviews?: ReviewProps[] | null;
}

interface SimulationProps {
  id: string;
  model: string;
  color: string;
  capacity: string;
  batteryHealth: string;
  issues: string;
  estimatedValue: number;
  createdAt: Date;
}

interface ReviewProps {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: Date;
}

const UsersTable = ({ users }: { users: UserProps[] }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [dropdownFocus, setDropdownFocus] = useState<string | null>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editedValues, setEditedValues] = useState<{
    firstName?: string;
    lastName?: string;
    role?: string;
  } | null>(null);

  const [focusedField, setFocusedField] = useState<string | null>(null); // Campo atualmente focado

  const handleEditClick = (row: UserProps) => {
    setEditingRowId(row.id);
    setEditedValues({
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role,
    });
    setFocusedField("firstName"); // Inicia o foco no primeiro campo
  };

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedValues(null);
    setFocusedField(null); // Limpa o campo focado
  };

  const handleInputFocus = (field: string) => {
    setFocusedField(field); // Atualiza o campo atualmente focado
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const firstNameFilter = filters.firstName
        ? user.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
        : true;

      const lastNameFilter = filters.lastName
        ? user.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
        : true;

      const roleFilter = filters.role ? user.role === filters.role : true;

      return firstNameFilter && lastNameFilter && roleFilter;
    });
  }, [users, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[key];
      return updatedFilters;
    });
    setDropdownFocus(key); // Mantém o foco no input após limpar
  };

  const focusInput = (key: string) => {
    setTimeout(() => {
      inputRefs.current[key]?.focus();
    }, 0);
  };

  const columns: ColumnDef<UserProps>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DropdownMenu
          open={dropdownFocus === "firstName"}
          onOpenChange={(open) => {
            setDropdownFocus(open ? "firstName" : null);
            if (open) focusInput("firstName");
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Nome
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Input
              ref={(el) => {
                inputRefs.current.firstName = el;
              }}
              placeholder="Buscar por nome"
              value={filters.firstName || ""}
              onChange={(e) => handleFilterChange("firstName", e.target.value)}
              autoFocus={dropdownFocus === "firstName"}
              className="w-full px-2"
            />
            <DropdownMenuItem
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ordenar <ArrowUpDown className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
            {filters.firstName && (
              <DropdownMenuItem
                onClick={() => {
                  clearFilter("firstName");
                  focusInput("firstName");
                }}
                className="text-red-500"
              >
                Limpar Filtro
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <Input
            value={editedValues?.firstName || ""}
            onChange={(e) =>
              setEditedValues((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            onFocus={() => handleInputFocus("firstName")}
            autoFocus={focusedField === "firstName"} // Foco automático se for o campo atual
            className="w-full text-sm p-2 border rounded-md"
          />
        ) : (
          row.original.firstName
        ),
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <DropdownMenu
          open={dropdownFocus === "lastName"}
          onOpenChange={(open) => {
            setDropdownFocus(open ? "lastName" : null);
            if (open) focusInput("lastName");
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Sobrenome
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Input
              ref={(el) => {
                inputRefs.current.lastName = el;
              }}
              placeholder="Buscar por sobrenome"
              value={filters.lastName || ""}
              onChange={(e) => handleFilterChange("lastName", e.target.value)}
              autoFocus={dropdownFocus === "lastName"}
              className="w-full px-2"
            />
            <DropdownMenuItem
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Ordenar <ArrowUpDown className="h-4 w-4 ml-2" />
            </DropdownMenuItem>
            {filters.lastName && (
              <DropdownMenuItem
                onClick={() => {
                  clearFilter("lastName");
                  focusInput("lastName");
                }}
                className="text-red-500"
              >
                Limpar Filtro
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <Input
            value={editedValues?.lastName || ""}
            onChange={(e) =>
              setEditedValues((prev) => ({
                ...prev,
                lastName: e.target.value,
              }))
            }
            onFocus={() => handleInputFocus("lastName")}
            autoFocus={focusedField === "lastName"} // Foco automático se for o campo atual
            className="w-full text-sm p-2 border rounded-md"
          />
        ) : (
          row.original.lastName
        ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DropdownMenu
          open={dropdownFocus === "role"}
          onOpenChange={(open) => {
            setDropdownFocus(open ? "role" : null);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Tipo de Usuário
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
            {["CLIENT", "EMPLOYEE", "ADMIN", "MASTER"].map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleFilterChange("role", role)}
                className={`${
                  filters.role === role ? "bg-primary text-white" : ""
                }`}
              >
                {role}
              </DropdownMenuItem>
            ))}
            {filters.role && (
              <DropdownMenuItem
                onClick={() => clearFilter("role")}
                className="text-red-500"
              >
                Limpar Filtro
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <Select
            value={editedValues?.role || ""}
            onValueChange={(value) =>
              setEditedValues((prev) => ({
                ...prev,
                role: value,
              }))
            }
          >
            <SelectTrigger
              onFocus={() => handleInputFocus("role")}
              autoFocus={focusedField === "role"} // Foco automático se for o campo atual
              className="w-full text-sm"
            >
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CLIENT">Cliente</SelectItem>
              <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="MASTER">Master</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          row.original.role
        ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <DropdownMenu
          open={dropdownFocus === "rating"}
          onOpenChange={(open) => {
            setDropdownFocus(open ? "rating" : null);
          }}
        >
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              Avaliação
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
            {[5, 4, 3, 2, 1].map((rating) => (
              <DropdownMenuItem
                key={rating}
                onClick={() => handleFilterChange("rating", rating.toString())}
                className={`${
                  filters.rating === rating.toString()
                    ? "bg-secondary text-white"
                    : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>
                      {index < rating ? (
                        <Star
                          fill="currentColor"
                          className="text-primary w-4 h-4"
                        />
                      ) : (
                        <Star className="text-primary w-4 h-4" />
                      )}
                    </span>
                  ))}
                </div>
              </DropdownMenuItem>
            ))}
            {filters.rating && (
              <DropdownMenuItem
                onClick={() => clearFilter("rating")}
                className="text-red-500"
              >
                Limpar Filtro
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) =>
        editingRowId === row.original.id ? (
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm">
              Salvar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleCancelClick}>
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditClick(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Painel de Controle</DropdownMenuItem>
                <DropdownMenuItem>Desativar Usuário</DropdownMenuItem>
                <DropdownMenuItem>Ação 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="relative">
      <div className="hidden md:flex justify-end mb-4">
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Usuário</Button>
      </div>

      <div className="fixed bottom-4 right-4 md:hidden lg:hidden xl:hidden">
        <Button
          variant="outline"
          className="p-2 rounded-full shadow-md bg-primary text-white w-8 h-8"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-8 w-8" />
        </Button>
      </div>

      <div className="rounded md border border-gray-300 overflow-hidden">
        <Table className="w-full ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 border-b border-gray-300 "
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className={`${
                      header.id === "actions" ? "text-center" : "text-left"
                    } text-nowrap text-sm`}
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

      {/* Paginação */}
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
      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UsersTable;
