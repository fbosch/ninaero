"use client";

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useId, useState } from "react";

import { Badge } from "@/registry/ninaero/ui/badge";
import { Button } from "@/registry/ninaero/ui/button";
import { Checkbox } from "@/registry/ninaero/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/registry/ninaero/ui/field";
import { InputGroup, InputGroupInput } from "@/registry/ninaero/ui/input-group";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/ninaero/ui/table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const payments: Payment[] = [
  { id: "728ed52f", amount: 316, status: "success", email: "ken99@example.com" },
  { id: "489e1d42", amount: 242, status: "success", email: "abe45@example.com" },
  { id: "9a7b2c11", amount: 837, status: "processing", email: "monserrat44@example.com" },
  { id: "c2d4e6f8", amount: 874, status: "success", email: "silas22@example.com" },
  { id: "a1b3c5d7", amount: 721, status: "failed", email: "carmella@example.com" },
  { id: "f6e4d2c0", amount: 125, status: "pending", email: "m@example.com" },
  { id: "3e5a7c9d", amount: 489, status: "processing", email: "example@gmail.com" },
  { id: "8f6d4b2a", amount: 560, status: "success", email: "nina@example.com" },
];

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
});

type DataTableFeatures = typeof features;

const columnHelper = createColumnHelper<DataTableFeatures, Payment>();
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all payments on this page"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked === true)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select payment for ${row.original.email}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      />
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
  }),
  columnHelper.accessor("email", {
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Sort by email"
          aria-pressed={sorted !== false}
          onClick={() => column.toggleSorting(sorted === "asc")}
        >
          Email{" "}
          <span aria-hidden="true">{sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}</span>
        </Button>
      );
    },
    filterFn: "includesString",
    sortFn: "alphanumeric",
  }),
  columnHelper.accessor("amount", {
    header: () => <span className="block text-right">Amount</span>,
    cell: ({ getValue }) => (
      <span className="block text-right font-medium">{currency.format(getValue())}</span>
    ),
    enableSorting: false,
  }),
]);

const visibilityColumns = [
  { id: "status", label: "Status" },
  { id: "email", label: "Email" },
  { id: "amount", label: "Amount" },
] as const;

export default function DataTablePreview() {
  const tableId = useId();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 4 });

  const table = useTable({
    features,
    data: payments,
    columns,
    getRowId: (payment: Payment) => payment.id,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, columnVisibility, rowSelection, pagination },
  });

  const emailColumn = table.getColumn("email");
  const emailFilter = emailColumn?.getFilterValue();
  const visibleColumns = table.getVisibleLeafColumns();
  const pageCount = Math.max(1, table.getPageCount());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-xl border bg-background p-4 sm:flex-row sm:items-end sm:justify-between">
        <Field className="w-full max-w-sm">
          <FieldLabel htmlFor={`${tableId}-email`}>Filter by email</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id={`${tableId}-email`}
              type="search"
              autoComplete="off"
              placeholder="Filter emails…"
              value={typeof emailFilter === "string" ? emailFilter : ""}
              onChange={(event) => emailColumn?.setFilterValue(event.target.value)}
            />
          </InputGroup>
        </Field>
        <FieldSet className="min-w-0">
          <FieldLegend variant="label">Visible columns</FieldLegend>
          <FieldGroup className="flex flex-row flex-wrap gap-x-4 gap-y-2">
            {visibilityColumns.map(({ id, label }) => {
              const column = table.getColumn(id);
              return (
                <Field key={id} orientation="horizontal" className="w-auto gap-2">
                  <Checkbox
                    id={`${tableId}-column-${id}`}
                    checked={column?.getIsVisible() ?? false}
                    onCheckedChange={(checked) => column?.toggleVisibility(checked === true)}
                  />
                  <FieldLabel htmlFor={`${tableId}-column-${id}`}>{label}</FieldLabel>
                </Field>
              );
            })}
          </FieldGroup>
        </FieldSet>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background">
        <Table>
          <TableCaption className="sr-only">Recent payments</TableCaption>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : undefined
                      }
                      className={header.column.id === "select" ? "w-10" : undefined}
                    >
                      {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                  No payments match this email.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} shown payments selected.
        </p>
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm text-muted-foreground">
            Page {pagination.pageIndex + 1} of {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
