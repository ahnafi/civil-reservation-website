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
import { submissionColumns, testingColumnLabels, testingColumns, testingStatusOptions } from './tableConfig';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Pengujian',
        href: '/history/tests',
    },
];

export default function Test({
    userSubmissions,
    userTestings,
}: {
    userSubmissions: SubmissionSchedule[];
    userTransactions: Transaction[];
    userTestings: Testing[];
    tests: SimpleOption[];
    packages: SimpleOption[];
    laboratories: LaboratorySimple[];
}) {
    // Submission Table State
    const [submissionSorting, setSubmissionSorting] = useState<SortingState>([]);
    const [submissionFilters, setSubmissionFilters] = useState<ColumnFiltersState>([]);
    const [submissionVisibility, setSubmissionVisibility] = useState<VisibilityState>({});
    const [submissionSelection, setSubmissionSelection] = useState({});

    // Testing Table State
    const [testingSorting, setTestingSorting] = useState<SortingState>([]);
    const [testingFilters, setTestingFilters] = useState<ColumnFiltersState>([]);
    const [testingVisibility, setTestingVisibility] = useState<VisibilityState>({});
    const [testingSelection, setTestingSelection] = useState({});
    const [testingRows, setTestingRows] = useState<number>(10);

    // Testing Table Filter State
    const [testingSelectedStatus, setTestingSelectedStatus] = useState<SimpleOption | null>(null);

    const [testingInitialDate, setTestingInitialDate] = useState<Date | undefined>();
    const [testingFinalDate, setTestingFinalDate] = useState<Date | undefined>();
    const [testingFinalDateKey, setTestingFinalDateKey] = useState<number>(Date.now());

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

    const submissionTable = useReactTable<SubmissionSchedule>({
        data: userSubmissions,
        columns: submissionColumns,
        onSortingChange: setSubmissionSorting,
        onColumnFiltersChange: setSubmissionFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setSubmissionVisibility,
        onRowSelectionChange: setSubmissionSelection,
        state: {
            sorting: submissionSorting,
            columnFilters: submissionFilters,
            columnVisibility: submissionVisibility,
            rowSelection: submissionSelection,
        },
    });

    // Testing Table Definition
    const testingTable = useReactTable<Testing>({
        data: userTestings,
        columns: testingColumns,
        onSortingChange: setTestingSorting,
        onColumnFiltersChange: setTestingFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setTestingVisibility,
        onRowSelectionChange: setTestingSelection,
        state: {
            sorting: testingSorting,
            columnFilters: testingFilters,
            columnVisibility: testingVisibility,
            rowSelection: testingSelection,
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

    // Testing Date Column Filter Effect
    useEffect(() => {
        if (testingInitialDate) {
            updateColumnFilter(setTestingFilters, 'test_date', {
                start: testingInitialDate,
                end: testingFinalDate ?? testingInitialDate,
            });
        } else {
            updateColumnFilter(setTestingFilters, 'test_date', undefined);
        }
    }, [testingInitialDate, testingFinalDate]);

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

    // Testing Status Column Filter Effect
    useColumnFilterEffect(testingSelectedStatus, setTestingFilters, 'status');

    // Row Pagination Effect
    const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
        useEffect(() => {
            table.setPageSize(rows);
        }, [rows, table]);
    };

    // Testing Table Row Pagination Effect
    usePageSizeEffect(testingTable, testingRows);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pengujian" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="testing col-span-full space-y-2">
                        <h1 className="title font-semibold">Daftar Pengujian</h1>
                        <div className="testing-table-filters small-font-size mb-2 hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
                            <div className="status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={testingStatusOptions}
                                    selectedOption={testingSelectedStatus}
                                    setSelectedOption={setTestingSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>
                            <div className="date-range-picker">
                                <label className="text-foreground font-medium">Tanggal</label>
                                <div className="flex gap-3">
                                    <div className="initial-date">
                                        <DatePicker
                                            value={testingInitialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={(date) =>
                                                handleInitialDateSelect(date, setTestingInitialDate, setTestingFinalDate, testingFinalDate)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center">-</div>
                                    <div className="final-date">
                                        <DatePicker
                                            key={testingFinalDateKey}
                                            value={testingFinalDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={(date) =>
                                                handleFinalDateSelect(
                                                    date,
                                                    testingInitialDate,
                                                    setTestingInitialDate,
                                                    setTestingFinalDate,
                                                    setAlertMessage,
                                                    setTestingFinalDateKey,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {(testingInitialDate || testingFinalDate) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTestingInitialDate(undefined);
                                            setTestingFinalDate(undefined);
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
                                                options={testingStatusOptions}
                                                selectedOption={testingSelectedStatus}
                                                setSelectedOption={setTestingSelectedStatus}
                                                placeholder="Filter Status"
                                                icon={<Check size={16} />}
                                            />
                                        </div>
                                        <div className="date-range-picker">
                                            <label className="text-foreground font-medium">Tanggal</label>
                                            <div className="flex justify-between gap-2">
                                                <div className="initial-date flex flex-col">
                                                    <DatePicker
                                                        value={testingInitialDate}
                                                        placeholder="Pilih Tanggal Awal"
                                                        onDateSelect={(date) =>
                                                            handleInitialDateSelect(
                                                                date,
                                                                setTestingInitialDate,
                                                                setTestingFinalDate,
                                                                testingFinalDate,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="final-date flex flex-col">
                                                    <DatePicker
                                                        key={testingFinalDateKey}
                                                        value={testingFinalDate}
                                                        placeholder="Pilih Tanggal Akhir"
                                                        onDateSelect={(date) =>
                                                            handleFinalDateSelect(
                                                                date,
                                                                testingInitialDate,
                                                                setTestingInitialDate,
                                                                setTestingFinalDate,
                                                                setAlertMessage,
                                                                setTestingFinalDateKey,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            {(testingInitialDate || testingFinalDate) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setTestingInitialDate(undefined);
                                                        setTestingFinalDate(undefined);
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

                        <div className="testing-table-main">
                            <div className="testing-table-option mb-2 flex justify-between lg:mb-4">
                                <div className="flex w-full flex-wrap justify-end gap-2">
                                    <div className="code-search">
                                        <Input
                                            placeholder="Cari Kode Pengujian..."
                                            value={(submissionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                            onChange={(e) => submissionTable.getColumn('code')?.setFilterValue(e.target.value)}
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
                                                {testingTable
                                                    .getAllColumns()
                                                    .filter((column) => column.getCanHide())
                                                    .map((column) => {
                                                        return (
                                                            <DropdownMenuCheckboxItem
                                                                key={column.id}
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                className="small-font-size"
                                                            >
                                                                {testingColumnLabels[column.id] ?? column.id}
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
                                                    Tampilkan {testingRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={testingRows === size}
                                                        onCheckedChange={() => setTestingRows(size)}
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
                            <div className="testing-table-body">
                                <div className="rounded-md border">
                                    <Table className="small-font-size">
                                        <TableHeader>
                                            {testingTable.getHeaderGroups().map((headerGroup) => (
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
                                            {testingTable.getRowModel().rows?.length ? (
                                                testingTable.getRowModel().rows.map((row) => (
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
                                                    <TableCell colSpan={testingColumns.length} className="h-24 text-center">
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
                                            onClick={() => testingTable.previousPage()}
                                            disabled={!testingTable.getCanPreviousPage()}
                                            className="small-font-size"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testingTable.nextPage()}
                                            disabled={!testingTable.getCanNextPage()}
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
