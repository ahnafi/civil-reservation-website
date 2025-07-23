'use client';

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import DropdownSelect from '@/components/ui/DropdownSelect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BaseSubmission, BreadcrumbItem, ExternalSubmission, InternalSubmission, LaboratorySimple, SimpleOption, User } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
import { Check, ChevronDown, FlaskConical, HardHat, X } from 'lucide-react';
import type * as React from 'react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
    externalSubmissionColumnLabels,
    externalSubmissionColumns,
    internalSubmissionColumnLabels,
    internalSubmissionColumns,
    submissionStatusOptions,
} from './tableConfig';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Riwayat Pengajuan',
        href: '/history/submissions',
    },
];

function isInternalSubmission(submission: BaseSubmission): submission is InternalSubmission {
    return submission.submission_type === 'internal';
}

function isExternalSubmission(submission: BaseSubmission): submission is ExternalSubmission {
    return submission.submission_type === 'external';
}

const submissionStatusMap: Record<string, string> = {
    submitted: "Diajukan",
    approved: "Disetujui",
    rejected: "Ditolak",
}

export default function Submissions({
    userSubmissions,
    tests,
    packages,
    laboratories,
}: {
    userSubmissions: BaseSubmission[];
    tests: SimpleOption[];
    packages: SimpleOption[];
    laboratories: LaboratorySimple[];
}) {
    // User Role
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const userRole = user.role;

    const internalSubmissions = userSubmissions.filter(isInternalSubmission)
    const externalSubmissions = userSubmissions.filter(isExternalSubmission)

    // Calculate status counts
    const getStatusCounts = () => {
        const counts = {
            submitted: 0,
            approved: 0,
            rejected: 0,
        }

        userSubmissions.forEach((submission) => {
            if (submission.status in counts) {
                counts[submission.status as keyof typeof counts]++
            }
        })

        return counts
    }

    const statusCounts = getStatusCounts()

    // submission types
    const [submissionType, setSubmissionType] = useState<'internal' | 'external'>('internal');

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

    // Replace the single submissionTable with separate instances
    const internalSubmissionTable = useReactTable<InternalSubmission>({
        data: internalSubmissions,
        columns: internalSubmissionColumns,
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

    const externalSubmissionTable = useReactTable<ExternalSubmission>({
        data: externalSubmissions,
        columns: externalSubmissionColumns,
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

    // Create a helper to get the current table
    const currentTable = submissionType === 'internal' && userRole === 'internal' ? internalSubmissionTable : externalSubmissionTable;

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

    // Remove the generic usePageSizeEffect function and replace with separate effects

    // Internal Submission Table Row Pagination Effect
    useEffect(() => {
        internalSubmissionTable.setPageSize(submissionRows);
    }, [submissionRows, internalSubmissionTable]);

    // External Submission Table Row Pagination Effect
    useEffect(() => {
        externalSubmissionTable.setPageSize(submissionRows);
    }, [submissionRows, externalSubmissionTable]);

    // Remove these lines:
    // const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
    //   useEffect(() => {
    //     table.setPageSize(rows)
    //   }, [rows, table])
    // }

    // usePageSizeEffect(currentTable, submissionRows)

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
            <Head title="Riwayat Pengajuan" />

            <div className="min-h-screen bg-white dark:bg-black">
                <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="submission col-span-full space-y-2">
                            <div className="mb-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Riwayat Pengajuan</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Kelola dan pantau riwayat pengajuan pengujian Anda</p>
                            </div>

                            {/* Status Count Card Summary */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Submitted Count Card */}
                                <Card className="border-l-4 border-l-yellow-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                                            {submissionStatusMap.submitted}
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {statusCounts.submitted}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengajuan yang sedang diproses</p>
                                    </CardContent>
                                </Card>

                                {/* Approved Count Card */}
                                <Card className="border-l-4 border-l-green-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                                            {submissionStatusMap.approved}
                                        </CardTitle>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.approved}</div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengajuan yang telah disetujui</p>
                                    </CardContent>
                                </Card>

                                {/* Rejected Count Card */}
                                <Card className="border-l-4 border-l-red-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                                            {submissionStatusMap.rejected}
                                        </CardTitle>
                                        <XCircle className="h-4 w-4 text-red-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.rejected}</div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengajuan yang ditolak</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="submission-table-filters small-font-size mb-4 hidden justify-end gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:mb-6 lg:flex lg:flex-wrap dark:border-zinc-800 dark:bg-zinc-900/50">
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
                                                    handleInitialDateSelect(
                                                        date,
                                                        setSubmissionInitialDate,
                                                        setSubmissionFinalDate,
                                                        submissionFinalDate,
                                                    )
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

                            <div className="submission-table-main rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="submission-table-option mb-4 flex justify-between border-b border-zinc-200 p-4 lg:mb-6 dark:border-zinc-800">
                                    <div className="flex w-full flex-wrap justify-end gap-2">
                                        <div className="code-search flex flex-col">
                                            <Input
                                                placeholder="Cari Kode Pengajuan..."
                                                value={(currentTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                                onChange={(e) => currentTable.getColumn('code')?.setFilterValue(e.target.value)}
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
                                                    {currentTable
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            const columnLabels =
                                                                submissionType === 'internal' && userRole === 'internal'
                                                                    ? internalSubmissionColumnLabels
                                                                    : externalSubmissionColumnLabels;
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={column.id}
                                                                    checked={column.getIsVisible()}
                                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                    className="small-font-size"
                                                                >
                                                                    {columnLabels[column.id] ?? column.id}
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
                                    <div className="mx-4 mb-4 rounded-md border border-zinc-200 dark:border-zinc-900">
                                        <Table className="small-font-size bg-white dark:bg-zinc-900">
                                            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                                                {currentTable.getHeaderGroups().map((headerGroup) => (
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
                                                {submissionType === 'internal' && userRole === 'internal'
                                                    ? internalSubmissionTable.getRowModel().rows.map((row, index) => (
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
                                                    : externalSubmissionTable.getRowModel().rows.map((row, index) => (
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
                                                      ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 border-t border-gray-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-800/30">
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => currentTable.previousPage()}
                                                disabled={!currentTable.getCanPreviousPage()}
                                                className="small-font-size"
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => currentTable.nextPage()}
                                                disabled={!currentTable.getCanNextPage()}
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
