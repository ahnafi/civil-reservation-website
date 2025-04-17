('use-client');

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
    submissionColumnLabels,
    submissionColumns,
    submissionStatusOptions,
    testingColumnLabels,
    testingColumns,
    testingStatusOptions,
    transactionColumnLabels,
    transactionColumns,
    transactionStatusOptions,
} from './tableConfig';

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#2563eb',
    },
    mobile: {
        label: 'Mobile',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export default function MainDashboard({
    userSubmissions,
    userTransactions,
    userTestings,
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
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    // To Hide the Chart
    const [showChart, setShowChart] = useState(false);

    // Submission Table State
    const [submissionSorting, setSubmissionSorting] = useState<SortingState>([]);
    const [submissionFilters, setSubmissionFilters] = useState<ColumnFiltersState>([]);
    const [submissionVisibility, setSubmissionVisibility] = useState<VisibilityState>({});
    const [submissionSelection, setSubmissionSelection] = useState({});
    const [submissionRows, setSubmissionRows] = useState<number>(10);

    // Transaction Table State
    const [transactionSorting, setTransactionSorting] = useState<SortingState>([]);
    const [transactionFilters, setTransactionFilters] = useState<ColumnFiltersState>([]);
    const [transactionVisibility, setTransactionVisibility] = useState<VisibilityState>({});
    const [transactionSelection, setTransactionSelection] = useState({});
    const [transactionRows, setTransactionRows] = useState<number>(10);

    // Testing Table State
    const [testingSorting, setTestingSorting] = useState<SortingState>([]);
    const [testingFilters, setTestingFilters] = useState<ColumnFiltersState>([]);
    const [testingVisibility, setTestingVisibility] = useState<VisibilityState>({});
    const [testingSelection, setTestingSelection] = useState({});
    const [testingRows, setTestingRows] = useState<number>(10);

    // Submission Table Filter State
    const [submissionSelectedLab, setSubmissionSelectedLab] = useState<LaboratorySimple | null>(null);
    const [submissionSelectedTest, setSubmissionSelectedTest] = useState<SimpleOption | null>(null);
    const [submissionSelectedStatus, setSubmissionSelectedStatus] = useState<SimpleOption | null>(null);

    const [submissionInitialDate, setSubmissionInitialDate] = useState<Date | undefined>();
    const [submissionFinalDate, setSubmissionFinalDate] = useState<Date | undefined>();
    const [submissionFinalDateKey, setSubmissionFinalDateKey] = useState<number>(Date.now());

    // Transaction Table Filter State
    const [transactionSelectedStatus, setTransactionSelectedStatus] = useState<SimpleOption | null>(null);

    const [transactionInitialDate, setTransactionInitialDate] = useState<Date | undefined>();
    const [transactionFinalDate, setTransactionFinalDate] = useState<Date | undefined>();
    const [transactionFinalDateKey, setTransactionFinalDateKey] = useState<number>(Date.now());

    // Testing Table Filter State
    const [testingSelectedStatus, setTestingSelectedStatus] = useState<SimpleOption | null>(null);

    const [testingInitialDate, setTestingInitialDate] = useState<Date | undefined>();
    const [testingFinalDate, setTestingFinalDate] = useState<Date | undefined>();
    const [testingFinalDateKey, setTestingFinalDateKey] = useState<number>(Date.now());

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
    const updateColumnFilter = (setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>, columnId: string, value: any) => {
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

    // Transaction Status Column Filter Effect
    useColumnFilterEffect(transactionSelectedStatus, setTransactionFilters, 'status');

    // Testing Status Column Filter Effect
    useColumnFilterEffect(testingSelectedStatus, setTestingFilters, 'status');

    // Row Pagination Effect
    const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
        useEffect(() => {
            table.setPageSize(rows);
        }, [rows, table]);
    };

    // Submission Table Row Pagination Effect
    usePageSizeEffect(submissionTable, submissionRows);

    // Transaction Table Row Pagination Effect
    usePageSizeEffect(transactionTable, transactionRows);

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{50000}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{50000}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{50000}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{50000}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                    </div>

                    {showChart && (
                        <div className="col-span-full space-y-2">
                            <h2 className="font-semibold">Grafik Bulanan Laboratorium</h2>
                            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={chartData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                    />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    )}

                    <div className="submission col-span-full space-y-2">
                        <h2 className="title font-semibold">Daftar Pengajuan Pengujian</h2>
                        <div className="submission-table-cards-summary flex justify-evenly">
                            <div className="total-submission-card"></div>
                            <div className="submitted-submission-card"></div>
                            <div className="approved-submission-card"></div>
                            <div className="rejected-submission-card"></div>
                        </div>
                        <div className="submission-table-filters mx-10 mt-6 flex justify-between space-x-5">
                            <div className="test-type">
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={mergedTestPackage}
                                    selectedOption={submissionSelectedTest}
                                    setSelectedOption={setSubmissionSelectedTest}
                                    placeholder="Filter Jenis Pengujian..."
                                    searchIcon={<HardHat size={18} />}
                                />
                            </div>

                            <div className="Lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={submissionSelectedLab}
                                    setSelectedOption={setSubmissionSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={18} />}
                                />
                            </div>

                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={submissionStatusOptions}
                                    selectedOption={submissionSelectedStatus}
                                    setSelectedOption={setSubmissionSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
                                        <DatePicker
                                            value={submissionInitialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={(date) =>
                                                handleInitialDateSelect(date, setSubmissionInitialDate, setSubmissionFinalDate, submissionFinalDate)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center pt-5 text-sm">-</div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
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
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSubmissionInitialDate(undefined);
                                                setSubmissionFinalDate(undefined);
                                                setSubmissionFilters((prev) => prev.filter((f) => f.id !== 'test_submission_date'));
                                            }}
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                                        >
                                            <X size={12} />
                                            Hapus Filter Tanggal
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="submission-table-main mt-6">
                            <div className="submission-table-option flex justify-between">
                                <div className="Code-Search">
                                    <Input
                                        placeholder="Cari Kode Pengajuan..."
                                        value={(submissionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                        onChange={(e) => submissionTable.getColumn('code')?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <div className="table-column-filter mb-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="ml-auto">
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
                                                                className="capitalize"
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                                                <Button variant="outline" className="ml-auto">
                                                    Tampilkan {submissionRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={submissionRows === size}
                                                        onCheckedChange={() => setSubmissionRows(size)}
                                                        className="text-sm"
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
                                    <Table>
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
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => submissionTable.nextPage()}
                                            disabled={!submissionTable.getCanNextPage()}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="transaction col-span-full space-y-2">
                        <h2 className="title font-semibold">Daftar Transaksi</h2>
                        <div className="transaction-table-cards-summary flex justify-evenly">
                            <div className="total-transaction-card"></div>
                            <div className="pending-transaction-card"></div>
                            <div className="success-transaction-card"></div>
                            <div className="failed-transaction-card"></div>
                        </div>
                        <div className="transaction-table-filters mx-10 mt-6 flex justify-between space-x-5">
                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={transactionStatusOptions}
                                    selectedOption={transactionSelectedStatus}
                                    setSelectedOption={setTransactionSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
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
                                    <div className="flex items-center justify-center pt-5 text-sm">-</div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
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
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setTransactionInitialDate(undefined);
                                                setTransactionFinalDate(undefined);
                                            }}
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                                        >
                                            <X size={12} />
                                            Hapus Filter Tanggal
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="transaction-table-main mt-6">
                            <div className="transaction-table-option flex justify-between">
                                <div className="Code-Search">
                                    <Input
                                        placeholder="Cari Kode Transaksi..."
                                        value={(transactionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                        onChange={(e) => transactionTable.getColumn('code')?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <div className="table-column-filter mb-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="ml-auto">
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
                                                                className="capitalize"
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
                                                <Button variant="outline" className="ml-auto">
                                                    Tampilkan {transactionRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={transactionRows === size}
                                                        onCheckedChange={() => setTransactionRows(size)}
                                                        className="text-sm"
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
                                    <Table>
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
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => transactionTable.nextPage()}
                                            disabled={!transactionTable.getCanNextPage()}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="testing col-span-full space-y-2">
                        <h2 className="title font-semibold">Daftar Pengujian</h2>
                        <div className="testing-table-cards-summary flex justify-evenly">
                            <div className="total-testing-card"></div>
                            <div className="testing-testing-card"></div>
                            <div className="completed-testing-card"></div>
                        </div>
                        <div className="testing-table-filters mx-10 mt-6 flex justify-between space-x-5">
                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={testingStatusOptions}
                                    selectedOption={testingSelectedStatus}
                                    setSelectedOption={setTestingSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
                                        <DatePicker
                                            value={testingInitialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={(date) =>
                                                handleInitialDateSelect(date, setTestingInitialDate, setTestingFinalDate, testingFinalDate)
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-center pt-5 text-sm">-</div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
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
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setTestingInitialDate(undefined);
                                                setTestingFinalDate(undefined);
                                            }}
                                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                                        >
                                            <X size={12} />
                                            Hapus Filter Tanggal
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="testing-table-main mt-6">
                            <div className="testing-table-option flex justify-between">
                                <div className="Code-Search">
                                    <Input
                                        placeholder="Cari Kode Pengajuan..."
                                        value={(submissionTable.getColumn('code')?.getFilterValue() as string) ?? ''}
                                        onChange={(e) => submissionTable.getColumn('code')?.setFilterValue(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <div className="table-column-filter mb-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" className="ml-auto">
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
                                                                className="capitalize"
                                                                checked={column.getIsVisible()}
                                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                                                <Button variant="outline" className="ml-auto">
                                                    Tampilkan {testingRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={testingRows === size}
                                                        onCheckedChange={() => setTestingRows(size)}
                                                        className="text-sm"
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
                                    <Table>
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
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testingTable.nextPage()}
                                            disabled={!testingTable.getCanNextPage()}
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
