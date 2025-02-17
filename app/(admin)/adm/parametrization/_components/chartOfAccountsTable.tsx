"use client";

import { useState, useEffect, JSX } from "react";
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
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { getChartOfAccounts } from "@/app/_actions/getChartOfAccounts";

interface Account {
  id: string;
  name: string;
  code: string;
  type: string;
  isAnalytical: boolean;
  parentCode?: string | null;
}

const typeMap: Record<string, string> = {
  ASSET: "Ativo",
  LIABILITY: "Passivo",
  EQUITY: "Patrimônio Líquido",
  REVENUE: "Receita",
  EXPENSE: "Despesa",
  COST: "Custo",
};

const toProperCase = (str: string) =>
  str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

const ChartOfAccountsTable = () => {
  const [data, setData] = useState<Account[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      const result = await getChartOfAccounts();
      setData(result);
    }
    fetchData();
  }, []);

  const toggleExpand = (code: string) => {
    setExpanded((prev) => {
      const isClosing = prev[code];

      const newExpanded = { ...prev, [code]: !prev[code] };

      if (isClosing) {
        closeBranch(code, newExpanded);
      }

      return newExpanded;
    });
  };

  const closeBranch = (
    parentCode: string,
    expandedState: Record<string, boolean>,
  ) => {
    data.forEach((account) => {
      if (account.parentCode === parentCode) {
        delete expandedState[account.code];
        closeBranch(account.code, expandedState);
      }
    });
  };

  const columns: ColumnDef<Account>[] = [
    {
      id: "expand",
      cell: ({ row }) => {
        const account = row.original;
        const hasChildren = data.some(
          (item) => item.parentCode === account.code,
        );
        const indentLevel = account.code.split(".").length - 1;

        return (
          <div
            style={{
              paddingLeft: `${indentLevel * 12}px`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleExpand(account.code)}
              >
                {expanded[account.code] ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </Button>
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "code",
      header: "Código",
      cell: ({ row }) => {
        const indentLevel = row.original.code.split(".").length - 1;
        return (
          <div style={{ paddingLeft: `${indentLevel * 12}px` }}>
            <span className={row.original.isAnalytical ? "" : "font-bold"}>
              {row.original.code}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => {
        const indentLevel = row.original.code.split(".").length - 1;
        return (
          <div style={{ paddingLeft: `${indentLevel * 12}px` }}>
            <span className={row.original.isAnalytical ? "" : "font-bold"}>
              {toProperCase(row.original.name)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isAnalytical",
      header: "Classificação",
      cell: ({ row }) => (row.original.isAnalytical ? "A" : "S"),
    },
    {
      accessorKey: "type",
      header: "Tipo",
      cell: ({ row }) => typeMap[row.original.type] || row.original.type,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  function renderRows(): JSX.Element[] {
    return table.getRowModel().rows.map((row) => {
      const account = row.original;
      const isVisible = !account.parentCode || expanded[account.parentCode];

      return (
        <TableRow key={account.code} className={isVisible ? "" : "hidden"}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      );
    });
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table className="text-xs md:text-sm ">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
            renderRows()
          ) : (
            <TableRow>
              <TableCell colSpan={5}>Nenhuma conta encontrada</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChartOfAccountsTable;
