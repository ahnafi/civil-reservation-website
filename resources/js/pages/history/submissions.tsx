('use-client');

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DropdownSelect from '@/components/ui/DropdownSelect';
import { Input } from '@/components/ui/input';
import SearchableSelect from '@/components/ui/SearchableSelect';
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
import { Check, ChevronDown, FlaskConical, HardHat, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { submissionColumnLabels, submissionColumns, submissionStatusOptions } from './tableConfig';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Pengajuan',
        href: '/history/submissions',
    },
];

export default function MainDashboard({
    userSubmissions,
    tests,
    packages,
    laboratories,
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
    const [submissionRows, setSubmissionRows] = useState<number>(10);

    // Submission Table Filter State
    const [submissionSelectedLab, setSubmissionSelectedLab] = useState<LaboratorySimple | null>(null);
    const [submissionSelectedTest, setSubmissionSelectedTest] = useState<SimpleOption | null>(null);
    const [submissionSelectedStatus, setSubmissionSelectedStatus] = useState<SimpleOption | null>(null);

    const [submissionInitialDate, setSubmissionInitialDate] = useState<Date | undefined>();
    const [submissionFinalDate, setSubmissionFinalDate] = useState<Date | undefined>();
    const [submissionFinalDateKey, setSubmissionFinalDateKey] = useState<number>(Date.now());

    // Alert State
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Merged Test and Package Options
    const mergedTestPackage: SimpleOption[] = [...packages, ...tests];

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

    // Submission Date Column Filter Effect
    useEffect(() => {
        if (submissionInitialDate) {
            updateColumnFilter(setSubmissionFilters, 'test_submission_date', {
                start: submissionInitialDate,
                end: submissionFinalDate ?? submissionInitialDate,
            });
        } else {
            updateColumnFilter(setSubmissionFilters, 'test_submission_date', undefined);
        }
    }, [submissionInitialDate, submissionFinalDate]);

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

    // Submission Lab Column Filter Effect
    useEffect(() => {
        if (submissionSelectedLab?.name) {
            updateColumnFilter(setSubmissionFilters, 'lab_code', submissionSelectedLab.code);
        } else {
            updateColumnFilter(setSubmissionFilters, 'lab_code', undefined);
        }
    }, [submissionSelectedLab]);

    // Submission Test Column Filter Effect
    useColumnFilterEffect(submissionSelectedTest, setSubmissionFilters, 'test_name');

    // Submission Status Column Filter Effect
    useColumnFilterEffect(submissionSelectedStatus, setSubmissionFilters, 'status');

    // Row Pagination Effect
    const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
        useEffect(() => {
            table.setPageSize(rows);
        }, [rows, table]);
    };

    // Submission Table Row Pagination Effect
    usePageSizeEffect(submissionTable, submissionRows);

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
            <Head title="Daftar Pengajuan" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="submission col-span-full space-y-2">
                        <h1 className="title font-semibold">Daftar Pengajuan</h1>
                        <div className="submission-table-filters small-font-size mb-2 flex hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
                            {/* Daftar filter untuk layar besar */}
                            <div className="test-type">
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={mergedTestPackage}
                                    selectedOption={submissionSelectedTest}
                                    setSelectedOption={setSubmissionSelectedTest}
                                    placeholder="Filter Jenis Pengujian..."
                                    searchIcon={<HardHat size={16} />}
                                />
                            </div>
                            <div className="lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={submissionSelectedLab}
                                    setSelectedOption={setSubmissionSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={16} />}
                                />
                            </div>
                            <div className="status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={submissionStatusOptions}
                                    selectedOption={submissionSelectedStatus}
                                    setSelectedOption={setSubmissionSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={16} />}
                                />
                            </div>
                            <div className="date-range-picker">
                                <label className="text-foreground font-medium">Tanggal</label>
                                <div className="flex gap-3">
                                    <div className="initial-date">
                                        <DatePicker
                                            value={submissionInitialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={(date) =>
                                                handleInitialDateSelect(date, setSubmissionInitialDate, setSubmissionFinalDate, submissionFinalDate)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center">-</div>
                                    <div className="final-date">
                                        <DatePicker
                                            key={submissionFinalDateKey}
                                            value={submissionInitialDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={(date) =>
                                                handleFinalDateSelect(
                                                    date,
                                                    submissionInitialDate,
                                                    setSubmissionInitialDate,
                                                    setSubmissionFinalDate,
                                                    setAlertMessage,
                                                    setSubmissionFinalDateKey,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {(submissionInitialDate || submissionFinalDate) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSubmissionInitialDate(undefined);
                                            setSubmissionFinalDate(undefined);
                                            setSubmissionFilters((prev) => prev.filter((f) => f.id !== 'test_submission_date'));
                                        }}
                                        className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                                    >
                                        <X size={14} />
                                        Kosongkan pilihan
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Tombol Filter untuk layar kecil */}
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
                                        <div className="test-type">
                                            <SearchableSelect
                                                label="Jenis Pengujian"
                                                options={mergedTestPackage}
                                                selectedOption={submissionSelectedTest}
                                                setSelectedOption={setSubmissionSelectedTest}
                                                placeholder="Filter Jenis Pengujian..."
                                                searchIcon={<HardHat size={16} />}
                                            />
                                        </div>
                                        <div className="lab-type">
                                            <DropdownSelect
                                                label="Laboratorium"
                                                options={laboratories}
                                                selectedOption={submissionSelectedLab}
                                                setSelectedOption={setSubmissionSelectedLab}
                                                placeholder="Filter Laboratorium"
                                                icon={<FlaskConical size={16} />}
                                            />
                                        </div>
                                        <div className="status-type">
                                            <DropdownSelect
                                                label="Status"
                                                options={submissionStatusOptions}
                                                selectedOption={submissionSelectedStatus}
                                                setSelectedOption={setSubmissionSelectedStatus}
                                                placeholder="Filter Status"
                                                icon={<Check size={16} />}
                                            />
                                        </div>
                                        <div className="date-range-picker">
                                            <label className="text-foreground font-medium">Tanggal</label>
                                            <div className="flex justify-between gap-2">
                                                <div className="initial-date flex flex-col">
                                                    <DatePicker
                                                        value={submissionInitialDate}
                                                        placeholder="Pilih Tanggal Awal"
                                                        onDateSelect={(date) =>
                                                            handleInitialDateSelect(
                                                                date,
                                                                setSubmissionInitialDate,
                                                                setSubmissionFinalDate,
                                                                submissionFinalDate,
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <div className="final-date flex flex-col">
                                                    <DatePicker
                                                        key={submissionFinalDateKey}
                                                        value={submissionInitialDate}
                                                        placeholder="Pilih Tanggal Akhir"
                                                        onDateSelect={(date) =>
                                                            handleFinalDateSelect(
                                                                date,
                                                                submissionInitialDate,
                                                                setSubmissionInitialDate,
                                                                setSubmissionFinalDate,
                                                                setAlertMessage,
                                                                setSubmissionFinalDateKey,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            {(submissionInitialDate || submissionFinalDate) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSubmissionInitialDate(undefined);
                                                        setSubmissionFinalDate(undefined);
                                                        setSubmissionFilters((prev) => prev.filter((f) => f.id !== 'test_submission_date'));
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
                        <div className="submission-table-main">
                            <div className="submission-table-option mb-2 flex justify-between lg:mb-4">
                                <div className="flex w-full justify-end gap-2 flex-wrap">
                                    <div className="code-search flex flex-col">
                                        <Input
                                            placeholder="Cari Kode Pengajuan..."
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
                                                {submissionTable
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
                                                                {submissionColumnLabels[column.id] ?? column.id}
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
                                                    Tampilkan {submissionRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={submissionRows === size}
                                                        onCheckedChange={() => setSubmissionRows(size)}
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
                            <div className="submission-table-body">
                                <div className="rounded-md border">
                                    <Table className="small-font-size">
                                        <TableHeader>
                                            {submissionTable.getHeaderGroups().map((headerGroup) => (
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
                                            {submissionTable.getRowModel().rows?.length ? (
                                                submissionTable.getRowModel().rows.map((row) => (
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
                                                    <TableCell colSpan={submissionColumns.length} className="h-24 text-center">
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
                                            onClick={() => submissionTable.previousPage()}
                                            disabled={!submissionTable.getCanPreviousPage()}
                                            className="small-font-size"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => submissionTable.nextPage()}
                                            disabled={!submissionTable.getCanNextPage()}
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
