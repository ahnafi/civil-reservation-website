('use-client');

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DropdownSelect from '@/components/ui/DropdownSelect';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, LaboratorySimple, SimpleOption, type SubmissionSchedule, Testing, Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import type { Table as TanStackTable } from '@tanstack/react-table';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { transactionColumnLabels, transactionColumns, transactionStatusOptions } from './tableConfig';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat',
        href: '/history',
    },
    {
        title: 'Daftar Transaksi',
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

    console.log(userTransactions)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="transaction col-span-full space-y-2">
                        <h1 className="title font-semibold">Daftar Transaksi</h1>
                        <div className="transaction-table-filters small-font-size mb-2 hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
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
                                    <Button variant="outline" className="bg-blue-base text-light-base small-font-size font-bold">
                                        Filter
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="animate-slide-up w-fit p-4 md:p-6 lg:p-8">
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

                        <div className="transaction-table-main">
                            <div className="transaction-table-option mb-2 flex justify-between lg:mb-4">
                                <div className="flex w-full flex-wrap justify-end gap-2">
                                    <div className="code-Search">
                                        <Input
                                            placeholder="Cari Kode Transaksi..."
                                            value={(transactionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                            onChange={(e) => transactionTable.getColumn('code')?.setFilterValue(e.target.value)}
                                            className="border-muted bg-background text-foreground focus:ring-primary small-font-size small-font-size w-full rounded-md border py-2 shadow-sm focus:ring-1 focus:outline-none"
                                        />
                                    </div>
                                    <div className="table-column-filter mb-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="small-font-size ml-auto font-normal">
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
                                                <Button variant="outline" className="small-font-size ml-auto font-normal">
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
                                <div className="rounded-md border">
                                    <Table className="small-font-size">
                                        <TableHeader>
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
                                                transactionTable.getRowModel().rows.map((row) => (
                                                    <TableRow key={row.id}>
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
                                <div className="flex items-center justify-end space-x-2 py-4">
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

            <ToastContainer />
        </AppLayout>
    );
}
