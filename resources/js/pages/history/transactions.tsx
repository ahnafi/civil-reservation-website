'use client';

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DropdownSelect from '@/components/ui/DropdownSelect';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, LaboratorySimple, SimpleOption, SubmissionSchedule, Testing, Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import type { Table as TanStackTable } from '@tanstack/react-table';
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from '@tanstack/react-table';
import { Check, ChevronDown, X } from 'lucide-react';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { transactionColumnLabels, transactionColumns, transactionStatusOptions } from './tableConfig';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Transaksi',
        href: '/history/transactions',
    },
];

export default function Transactions({
    userTransactions,
}: {
    userSubmissions: SubmissionSchedule[];
    userTransactions: Transaction[];
    userTestings: Testing[];
    tests: SimpleOption[];
    packages: SimpleOption[];
    laboratories: LaboratorySimple[];
}) {
    // Transaction Table State
    const [transactionSorting, setTransactionSorting] = useState<SortingState>([]);
    const [transactionFilters, setTransactionFilters] = useState<ColumnFiltersState>([]);
    const [transactionVisibility, setTransactionVisibility] = useState<VisibilityState>({});
    const [transactionSelection, setTransactionSelection] = useState({});
    const [transactionRows, setTransactionRows] = useState<number>(10);

    // Transaction Table Filter State
    const [transactionSelectedStatus, setTransactionSelectedStatus] = useState<SimpleOption | null>(null);

    const [transactionInitialDate, setTransactionInitialDate] = useState<Date | undefined>();
    const [transactionFinalDate, setTransactionFinalDate] = useState<Date | undefined>();
    const [transactionFinalDateKey, setTransactionFinalDateKey] = useState<number>(Date.now());

    // Alert State
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Initial Date Select Handlers
    const handleInitialDateSelect = (
        date: Date | undefined,
        setInitialDate: (date: Date | undefined) => void,
        setFinalDate: (date: Date | undefined) => void,
        finalDate: Date | undefined,
    ) => {
        const selected = date ?? new Date();
        setInitialDate(selected);

        if (!finalDate || (date && finalDate.getTime() === selected.getTime())) {
            setFinalDate(selected);
        } else if (selected.getTime() > finalDate.getTime()) {
            setAlertMessage('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
            setFinalDate(selected);
        } else {
            setAlertMessage(null);
        }
    };

    // Final Date Select Handlers
    const handleFinalDateSelect = (
        date: Date | undefined,
        initialDate: Date | undefined,
        setInitialDate: (date: Date | undefined) => void,
        setFinalDate: (date: Date | undefined) => void,
        setAlertMessage: (msg: string | null) => void,
        setFinalDateKey: (key: number) => void,
    ) => {
        if (!initialDate || !date) {
            setFinalDate(date);
            return;
        }

        if (!initialDate) {
            setInitialDate(date);
            setFinalDate(date);
            setAlertMessage(null);
            return;
        }

        if (date.getTime() === initialDate.getTime()) {
            setFinalDate(date);
        } else if (date.getTime() < initialDate.getTime()) {
            setAlertMessage('Tanggal akhir tidak boleh lebih kecil dari tanggal awal');
            setFinalDate(initialDate);
            setFinalDateKey(Date.now());
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    };

    // Transaction Table Definition
    const transactionTable = useReactTable<Transaction>({
        data: userTransactions,
        columns: transactionColumns,
        onSortingChange: setTransactionSorting,
        onColumnFiltersChange: setTransactionFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setTransactionVisibility,
        onRowSelectionChange: setTransactionSelection,
        state: {
            sorting: transactionSorting,
            columnFilters: transactionFilters,
            columnVisibility: transactionVisibility,
            rowSelection: transactionSelection,
        },
    });

    // Column Filter Update
    const updateColumnFilter = (setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>, columnId: string, value: unknown) => {
        setFilters((prevFilters) => {
            const otherFilters = prevFilters.filter((f) => f.id !== columnId);
            if (value === undefined || value === null || value === '') {
                return otherFilters;
            }
            return [...otherFilters, { id: columnId, value }];
        });
    };

    // Transaction Date Column Filter Effect
    useEffect(() => {
        if (transactionInitialDate) {
            updateColumnFilter(setTransactionFilters, 'created_at', {
                start: transactionInitialDate,
                end: transactionFinalDate ?? transactionInitialDate,
            });
        } else {
            updateColumnFilter(setTransactionFilters, 'created_at', undefined);
        }
    }, [transactionInitialDate, transactionFinalDate]);

    // Reusable Column Filter Effect
    const useColumnFilterEffect = (
        selectedOption: SimpleOption | null,
        setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
        columnId: string,
    ) => {
        useEffect(() => {
            if (selectedOption?.name) {
                updateColumnFilter(setFilters, columnId, selectedOption.name);
            } else {
                updateColumnFilter(setFilters, columnId, undefined);
            }
        }, [selectedOption, columnId, setFilters]);
    };

    // Transaction Status Column Filter Effect
    useColumnFilterEffect(transactionSelectedStatus, setTransactionFilters, 'status');

    // Row Pagination Effect
    const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
        useEffect(() => {
            table.setPageSize(rows);
        }, [rows, table]);
    };

    // Transaction Table Row Pagination Effect
    usePageSizeEffect(transactionTable, transactionRows);

    // Alert Message
    useEffect(() => {
        if (alertMessage) {
            toast.error(alertMessage, {
                position: 'top-center',
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

    // Filter Dialog State
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

    console.log(userTransactions);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Transaksi" />

            <div className="min-h-screen bg-white dark:bg-black">
                <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="transaction col-span-full space-y-2">
                            <div className="mb-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Riwayat Transaksi</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kelola dan pantau riwayat transaksi pembayaran Anda</p>
                            </div>
                            <div className="transaction-table-filters small-font-size mb-4 hidden justify-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:mb-6 lg:flex lg:flex-wrap dark:border-zinc-800 dark:bg-zinc-900/50">
                                <div className="status-type">
                                    <DropdownSelect
                                        label="Status"
                                        options={transactionStatusOptions}
                                        selectedOption={transactionSelectedStatus}
                                        setSelectedOption={setTransactionSelectedStatus}
                                        placeholder="Filter Status"
                                        icon={<Check size={18} />}
                                    />
                                </div>
                                <div className="date-range-picker">
                                    <label className="text-foreground font-medium">Tanggal</label>
                                    <div className="flex gap-3">
                                        <div className="initial-date">
                                            <DatePicker
                                                value={transactionInitialDate}
                                                placeholder="Pilih Tanggal Awal"
                                                onDateSelect={(date) =>
                                                    handleInitialDateSelect(
                                                        date,
                                                        setTransactionInitialDate,
                                                        setTransactionFinalDate,
                                                        transactionFinalDate,
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-center">-</div>
                                        <div className="final-date">
                                            <DatePicker
                                                key={transactionFinalDateKey}
                                                value={transactionFinalDate}
                                                placeholder="Pilih Tanggal Akhir"
                                                onDateSelect={(date) =>
                                                    handleFinalDateSelect(
                                                        date,
                                                        transactionInitialDate,
                                                        setTransactionInitialDate,
                                                        setTransactionFinalDate,
                                                        setAlertMessage,
                                                        setTransactionFinalDateKey,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    {(transactionInitialDate || transactionFinalDate) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTransactionInitialDate(undefined);
                                                setTransactionFinalDate(undefined);
                                            }}
                                            className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                                        >
                                            <X size={14} />
                                            Kosongkan pilihan
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Filter untuk Layar Kecil */}
                            <div className="mb-2 flex justify-end lg:mb-4 lg:hidden">
                                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="small-font-size border-blue-600 bg-blue-600 font-medium text-white hover:bg-blue-700 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                                        >
                                            Filter
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="animate-slide-up w-fit border-gray-200 bg-white p-4 md:p-6 lg:p-8 dark:border-gray-800 dark:bg-gray-900">
                                        <DialogHeader>
                                            <DialogTitle>Filter</DialogTitle>
                                        </DialogHeader>
                                        <div className="small-font-size flex flex-col gap-4">
                                            <div className="status-type">
                                                <DropdownSelect
                                                    label="Status"
                                                    options={transactionStatusOptions}
                                                    selectedOption={transactionSelectedStatus}
                                                    setSelectedOption={setTransactionSelectedStatus}
                                                    placeholder="Filter Status"
                                                    icon={<Check size={16} />}
                                                />
                                            </div>
                                            <div className="date-range-picker">
                                                <label className="text-foreground font-medium">Tanggal</label>
                                                <div className="flex justify-between gap-2">
                                                    <div className="initial-date flex flex-col">
                                                        <DatePicker
                                                            value={transactionInitialDate}
                                                            placeholder="Pilih Tanggal Awal"
                                                            onDateSelect={(date) =>
                                                                handleInitialDateSelect(
                                                                    date,
                                                                    setTransactionInitialDate,
                                                                    setTransactionFinalDate,
                                                                    transactionFinalDate,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="final-date flex flex-col">
                                                        <DatePicker
                                                            key={transactionFinalDateKey}
                                                            value={transactionFinalDate}
                                                            placeholder="Pilih Tanggal Akhir"
                                                            onDateSelect={(date) =>
                                                                handleFinalDateSelect(
                                                                    date,
                                                                    transactionInitialDate,
                                                                    setTransactionInitialDate,
                                                                    setTransactionFinalDate,
                                                                    setAlertMessage,
                                                                    setTransactionFinalDateKey,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                {(transactionInitialDate || transactionFinalDate) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setTransactionInitialDate(undefined);
                                                            setTransactionFinalDate(undefined);
                                                        }}
                                                        className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                                                    >
                                                        <X size={14} />
                                                        Kosongkan pilihan
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="transaction-table-main rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="transaction-table-option mb-4 flex justify-between border-b border-zinc-200 p-4 lg:mb-6 dark:border-zinc-800">
                                    <div className="flex w-full flex-wrap justify-end gap-2">
                                        <div className="code-Search">
                                            <Input
                                                placeholder="Cari Kode Transaksi..."
                                                value={(transactionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                                onChange={(e) => transactionTable.getColumn('code')?.setFilterValue(e.target.value)}
                                                className="small-font-size w-full rounded-md border border-zinc-300 bg-white py-2 text-zinc-900 placeholder-zinc-500 shadow-sm focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:ring-blue-400"
                                            />
                                        </div>
                                        <div className="table-column-filter mb-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="small-font-size ml-auto bg-transparent font-normal">
                                                        Kolom <ChevronDown />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {transactionTable
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={column.id}
                                                                    className="small-font-size"
                                                                    checked={column.getIsVisible()}
                                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                >
                                                                    {transactionColumnLabels[column.id] ?? column.id}
                                                                </DropdownMenuCheckboxItem>
                                                            );
                                                        })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="pagination-rows-selector mb-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="small-font-size ml-auto bg-transparent font-normal">
                                                        Tampilkan {transactionRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {[10, 25, 50, 100].map((size) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={size}
                                                            checked={transactionRows === size}
                                                            onCheckedChange={() => setTransactionRows(size)}
                                                            className="small-font-size"
                                                        >
                                                            {size} baris
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                                <div className="transaction-table-body">
                                    <div className="mx-4 mb-4 rounded-md border border-zinc-200 dark:border-zinc-800">
                                        <Table className="small-font-size bg-white dark:bg-zinc-900">
                                            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                                                {transactionTable.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => {
                                                            return (
                                                                <TableHead key={header.id}>
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                                </TableHead>
                                                            );
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {transactionTable.getRowModel().rows?.length ? (
                                                    transactionTable.getRowModel().rows.map((row, index) => (
                                                        <TableRow
                                                            key={row.id}
                                                            className={
                                                                index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-gray-50 dark:bg-zinc-800/30'
                                                            }
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={transactionColumns.length} className="h-24 text-center">
                                                            No results.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-between space-x-2 border-t border-gray-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                                        <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Menampilkan{' '}
                                            {transactionTable.getState().pagination.pageIndex * transactionTable.getState().pagination.pageSize + 1} -{' '}
                                            {Math.min(
                                                (transactionTable.getState().pagination.pageIndex + 1) *
                                                    transactionTable.getState().pagination.pageSize,
                                                transactionTable.getFilteredRowModel().rows.length,
                                            )}{' '}
                                            dari {transactionTable.getFilteredRowModel().rows.length} data
                                        </div>
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => transactionTable.previousPage()}
                                                disabled={!transactionTable.getCanPreviousPage()}
                                                className="small-font-size"
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => transactionTable.nextPage()}
                                                disabled={!transactionTable.getCanNextPage()}
                                                className="small-font-size"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </AppLayout>
    );
}
