"use client"

import  * as React from "react"
import AppLayout from '@/layouts/app-layout'

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {ArrowUpDown, ChevronDown, HardHat, Search} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    // DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type {BreadcrumbItem} from "@/types";
import {Head} from "@inertiajs/react";
import {DatePicker} from "@/components/DatePicker";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {useEffect, useState} from "react";
import { type SubmissionSchedule, SimpleOption, Laboratory_Simple} from "@/types";



export const columns: ColumnDef<SubmissionSchedule>[] = [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "id",
        header: "ID Pengajuan",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "test_submission_date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className={`text-center w-full`}
                >
                    Tanggal Pengujian
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => (
            <div className="capitalize text-center">{row.getValue("test_submission_date")}</div>
        ),
    },
    {
        accessorKey: "company_name",
        header: () => <div>Perusahaan</div>,
        cell: ({ row }) => <div>{row.getValue("company_name")}</div>,
    },
    {
        accessorKey: "lab_code",
        header: () => <div>Lab</div>,
        cell: ({ row }) => <div>{row.getValue("lab_code")}</div>,
    },
    {
        accessorKey: "test_name",
        header: () => <div>Jenis Pengujian</div>,
        cell: ({ row }) => {
            const test = row.getValue("test_name") as string | null;
            const pkg = row.original.package_name as string | null;
            return <div>{(test || pkg || "-") as React.ReactNode}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className={`text-center`}>Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status")
            const statusColor =
                status === "approved"
                    ? "bg-green-500"
                    : status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"

            return (
                <div className={`capitalize text-center items-center mx-0 px-0 rounded-2xl py-1 w-[6rem] font-medium ${statusColor}`}>
                    {row.getValue("status")}
                </div>
            )
        },
    }
]

export const columnLabels: Record<string, string> = {
    id: "ID Pengajuan",
    test_submission_date: "Tanggal Pengujian",
    company_name: "Perusahaan",
    lab_code: "Lab",
    test_name: "Jenis Pengujian",
    status: "Status",
};


export default function DataTable({ submissions, tests }: { submissions: SubmissionSchedule[], tests: SimpleOption[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [rows, setRows] = useState<number>(10);

    const table = useReactTable<SubmissionSchedule>({
        data: submissions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    useEffect(() => {
        table.setPageSize(rows);
    }, [rows, table]);

    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [finalDate, setFinalDate] = useState<Date | undefined>(undefined);
    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        if (alertMessage) {
            toast.error(alertMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setAlertMessage(null);
        }
    }, [alertMessage]);

    const handleInitialDateSelect = (date: Date | undefined) => {
        setInitialDate(date ?? new Date());
    }

    const handleFinalDateSelect = (date: Date | undefined) => {
        if (date && date.getTime() === initialDate.getTime()) {
            setFinalDate(undefined);
        } else if (date && date.getTime() < initialDate.getTime()) {
            setAlertMessage("Tanggal akhir tidak boleh lebih kecil dari tanggal awal");
            setFinalDate(undefined);
            setFinalDateKey(Date.now());
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Jadwal Pengujian",
            href: "/experiment",
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Pengujian" />

            <div className="w-[90vw] mx-auto flex flex-col">

                <div className="page-header flex flex-col">
                    <div className="page-title">
                        <h1 className="text-4xl items-center justify-center text-center mt-2 font-extrabold">Agenda Pengujian Lab Teknik Sipil</h1>
                    </div>
                    <div className="table-filters flex justify-between mx-10 mt-6">
                        <div className="test-type">
                            <SearchableSelect
                                label="Jenis Pengujian"
                                options={tests}
                                selectedOption={selectedTest}
                                setSelectedOption={setSelectedTest}
                                placeholder="Cari Jenis Pengujian..."
                                searchIcon={<HardHat size={18} />}
                            />

                        </div>

                        <div className="date-range-picker flex items-center gap-4">
                            <div className="flex flex-col text-sm">
                                <span>Tanggal Awal:</span>
                                <DatePicker placeholder="Pilih Tanggal Awal" onDateSelect={handleInitialDateSelect}/>
                            </div>
                            -
                            <div className="flex flex-col text-sm">
                                <span>Tanggal Akhir:</span>
                                <DatePicker key={finalDateKey} placeholder="Pilih Tanggal Akhir" onDateSelect={handleFinalDateSelect} />
                            </div>
                        </div>
                    </div>
                    <div className="table-label ms-3 mt-6 text-lg font-medium text-center">
                        <div> Jadwal Pengujian {selectedTest?.name ?? ''} </div>
                        {initialDate ? format(initialDate, 'PPPP', { locale: id }) : ''}
                        {finalDate && finalDate !== initialDate ? ` - ${format(finalDate, 'PPPP', { locale: id })}` : ''}
                    </div>
                </div>

                <div className="table">

                    <div className="flex justify-between">
                        <div className="table-column-filter mb-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                        Kolom <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {columnLabels[column.id] ?? column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="pagination-rows-selector mb-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Tampilkan {rows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" >
                                {[10, 25, 50, 100].map((size) => (
                                    <DropdownMenuCheckboxItem
                                        key={size}
                                        checked={rows === size}
                                        onCheckedChange={() => setRows(size)}
                                        className="text-sm "
                                    >
                                        {size} baris
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    </div>


                    <div className="table-main">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
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
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
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

            </div>

            <ToastContainer />
        </AppLayout>
    )
}
