('use-client');

import  * as React from "react"
import {useEffect, useState} from "react";
import {
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {type SubmissionSchedule, Transaction, Testing, SimpleOption, Laboratory_Simple} from "@/types";
import {
    submissionColumns, submissionColumnLabels, submissionStatusOptions,
    transactionColumns,
    testingColumns
} from "./tableConfig";
import {Button} from "@/components/ui/button";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {Check, ChevronDown, FlaskConical, HardHat, X} from "lucide-react";
import DropdownSelect from "@/components/ui/DropdownSelect";
import {DatePicker} from "@/components/DatePicker";
import {Input} from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {toast, ToastContainer} from "react-toastify";

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

export default function MainDashboard({ userSubmissions, userTransactions, userTestings, tests, packages, laboratories}: {
    userSubmissions: SubmissionSchedule[],
    userTransactions: Transaction[],
    userTestings: Testing[],
    tests: SimpleOption[],
    packages: SimpleOption[],
    laboratories: Laboratory_Simple[] })
{

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    // Table State
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [rows, setRows] = useState<number>(10);

    // Filter State
    const [selectedLab, setSelectedLab] = useState<Laboratory_Simple | null>(null);
    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<SimpleOption | null>(null);

    const [showChart, setShowChart] = useState(false);

    const [initialDate, setInitialDate] = useState<Date | undefined>();
    const [finalDate, setFinalDate] = useState<Date | undefined>();

    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());

    // Alert State
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Merged Test and Package Options
    const mergedTestPackage: SimpleOption[] = [...packages, ...tests];

    // Initial Date Select Handlers
    const handleInitialDateSelect = (date: Date | undefined) => {
        const selected = date ?? new Date();
        setInitialDate(selected);

        if (!finalDate || (initialDate && finalDate.getTime() === initialDate.getTime())) {
            setFinalDate(selected);
        }
    };

    // Final Date Select Handlers
    const handleFinalDateSelect = (date: Date | undefined) => {
        if (!initialDate || !date) {
            setFinalDate(date);
            return;
        }

        if (date.getTime() === initialDate.getTime()) {
            setFinalDate(date);
        } else if (date.getTime() < initialDate.getTime()) {
            setAlertMessage("Tanggal akhir tidak boleh lebih kecil dari tanggal awal");
            setFinalDate(initialDate);
            setFinalDateKey(Date.now());
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    };

    // Submission Table Definition
    const submissionTable = useReactTable<SubmissionSchedule>({
        data: userSubmissions,
        columns: submissionColumns,
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

    // Transaction Table Definition
    const transactionTable = useReactTable<Transaction>({
        data: userTransactions,
        columns: transactionColumns,
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

    // Testing Table Definition
    const testingTable = useReactTable<Testing>({
        data: userTestings,
        columns: testingColumns,
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

    // Column Filter Update
    const updateColumnFilter = (id: string, value: any) => {
        setColumnFilters((prevFilters) => {
            const otherFilters = prevFilters.filter((f) => f.id !== id);
            if (value === undefined || value === null || value === "") {
                return otherFilters;
            }
            return [...otherFilters, { id, value }];
        });
    };

    // Lab Column Filter
    useEffect(() => {
        if(selectedLab?.name) {
            updateColumnFilter("lab_code", selectedLab.code);
        } else {
            updateColumnFilter("lab_code", undefined);
        }
    }, [selectedLab]);

    // Test Column Filter
    useEffect(() => {
        if (selectedTest?.name) {
            updateColumnFilter("test_name", selectedTest.name);
        } else {
            updateColumnFilter("test_name", undefined);
        }
    }, [selectedTest]);

    // Status Column Filter
    useEffect(() => {
        if (selectedStatus?.name) {
            updateColumnFilter("status", selectedStatus.name);
        } else {
            updateColumnFilter("status", undefined);
        }
    }, [selectedStatus]);

    // Row Pagination
    useEffect(() => {
        submissionTable.setPageSize(rows);
    }, [rows, submissionTable]);

    // Alert Message
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
                            <p className="text-3xl font-semibold">{(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                    </div>

                    { showChart && (
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
                        )
                    }

                    <div className="submission col-span-full space-y-2">
                        <h2 className="title font-semibold">Daftar Pengajuan Pengujian</h2>
                        <div className="submission-table-cards-summary flex justify-evenly">
                            <div className="total-submission-card">

                            </div>
                            <div className="submitted-submission-card">

                            </div>
                            <div className="approved-submission-card">

                            </div>
                            <div className="rejected-submission-card">

                            </div>
                        </div>
                        <div className="submission-table-filters flex justify-between space-x-5 mx-10 mt-6">
                            <div className="test-type">
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={mergedTestPackage}
                                    selectedOption={selectedTest}
                                    setSelectedOption={setSelectedTest}
                                    placeholder="Filter Jenis Pengujian..."
                                    searchIcon={<HardHat size={18} />}
                                />
                            </div>

                            <div className="Lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={selectedLab}
                                    setSelectedOption={setSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={18} />}
                                />
                            </div>

                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={submissionStatusOptions}
                                    selectedOption={selectedStatus}
                                    setSelectedOption={setSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
                                        <DatePicker
                                            value={initialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={handleInitialDateSelect}
                                        />
                                    </div>
                                    <div className="flex justify-center items-center text-sm pt-5">
                                        -
                                    </div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
                                        <DatePicker
                                            key={finalDateKey}
                                            value={finalDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={handleFinalDateSelect}
                                        />
                                    </div>
                                </div>

                                { (initialDate || finalDate) && (
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={ () => {
                                                setInitialDate(undefined);
                                                setFinalDate(undefined);
                                            }}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
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
                                        value={(submissionTable.getColumn("code")?.getFilterValue() as string) ?? ""}
                                        onChange={(e) =>
                                            submissionTable.getColumn("code")?.setFilterValue(e.target.value)
                                        }
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
                                                                onCheckedChange={(value) =>
                                                                    column.toggleVisibility(!!value)
                                                                }
                                                            >
                                                                {submissionColumnLabels[column.id] ?? column.id}
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
                                            {submissionTable.getRowModel().rows?.length ? (
                                                submissionTable.getRowModel().rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
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
                                                        colSpan={submissionColumns.length}
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
                            <div className="total-transaction-card">

                            </div>
                            <div className="pending-transaction-card">

                            </div>
                            <div className="success-transaction-card">

                            </div>
                            <div className="failed-transaction-card">

                            </div>
                        </div>
                        <div className="transaction-table-filters flex justify-between space-x-5 mx-10 mt-6">
                            <div className="test-type">
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={mergedTestPackage}
                                    selectedOption={selectedTest}
                                    setSelectedOption={setSelectedTest}
                                    placeholder="Filter Jenis Pengujian..."
                                    searchIcon={<HardHat size={18} />}
                                />
                            </div>

                            <div className="Lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={selectedLab}
                                    setSelectedOption={setSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={18} />}
                                />
                            </div>

                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={submissionStatusOptions}
                                    selectedOption={selectedStatus}
                                    setSelectedOption={setSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
                                        <DatePicker
                                            value={initialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={handleInitialDateSelect}
                                        />
                                    </div>
                                    <div className="flex justify-center items-center text-sm pt-5">
                                        -
                                    </div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
                                        <DatePicker
                                            key={finalDateKey}
                                            value={finalDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={handleFinalDateSelect}
                                        />
                                    </div>
                                </div>

                                { (initialDate || finalDate) && (
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={ () => {
                                                setInitialDate(undefined);
                                                setFinalDate(undefined);
                                            }}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
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
                                    placeholder="Cari Kode Pengajuan..."
                                    value={(submissionTable.getColumn("code")?.getFilterValue() as string) ?? ""}
                                    onChange={(e) =>
                                        submissionTable.getColumn("code")?.setFilterValue(e.target.value)
                                    }
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
                                                            onCheckedChange={(value) =>
                                                                column.toggleVisibility(!!value)
                                                            }
                                                        >
                                                            {submissionColumnLabels[column.id] ?? column.id}
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
                        </div>
                            <div className="transaction-table-body">
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
                                        {submissionTable.getRowModel().rows?.length ? (
                                            submissionTable.getRowModel().rows.map((row) => (
                                                <TableRow
                                                    key={row.id}
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
                                                    colSpan={submissionColumns.length}
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

                    <div className="testing col-span-full space-y-2">
                        <h2 className="title font-semibold">Daftar Pengujian</h2>
                        <div className="testing-table-cards-summary flex justify-evenly">
                            <div className="total-testing-card">

                            </div>
                            <div className="testing-testing-card">

                            </div>
                            <div className="completed-testing-card">

                            </div>
                        </div>
                        <div className="testing-table-filters flex justify-between space-x-5 mx-10 mt-6">
                            <div className="test-type">
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={mergedTestPackage}
                                    selectedOption={selectedTest}
                                    setSelectedOption={setSelectedTest}
                                    placeholder="Filter Jenis Pengujian..."
                                    searchIcon={<HardHat size={18} />}
                                />
                            </div>

                            <div className="Lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={selectedLab}
                                    setSelectedOption={setSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={18} />}
                                />
                            </div>

                            <div className="Status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={submissionStatusOptions}
                                    selectedOption={selectedStatus}
                                    setSelectedOption={setSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>

                            <div className="date-range-picker flex flex-col gap-1">
                                <div className="flex gap-3">
                                    <div className="initial-date flex flex-col text-sm">
                                        <span>Tanggal Awal:</span>
                                        <DatePicker
                                            value={initialDate}
                                            placeholder="Pilih Tanggal Awal"
                                            onDateSelect={handleInitialDateSelect}
                                        />
                                    </div>
                                    <div className="flex justify-center items-center text-sm pt-5">
                                        -
                                    </div>
                                    <div className="final-date flex flex-col text-sm">
                                        <span>Tanggal Akhir:</span>
                                        <DatePicker
                                            key={finalDateKey}
                                            value={finalDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={handleFinalDateSelect}
                                        />
                                    </div>
                                </div>

                                { (initialDate || finalDate) && (
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={ () => {
                                                setInitialDate(undefined);
                                                setFinalDate(undefined);
                                            }}
                                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
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
                                        value={(submissionTable.getColumn("code")?.getFilterValue() as string) ?? ""}
                                        onChange={(e) =>
                                            submissionTable.getColumn("code")?.setFilterValue(e.target.value)
                                        }
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
                                                                onCheckedChange={(value) =>
                                                                    column.toggleVisibility(!!value)
                                                                }
                                                            >
                                                                {submissionColumnLabels[column.id] ?? column.id}
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
                            </div>
                            <div className="testing-table-body">
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
                                            {submissionTable.getRowModel().rows?.length ? (
                                                submissionTable.getRowModel().rows.map((row) => (
                                                    <TableRow
                                                        key={row.id}
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
                                                        colSpan={submissionColumns.length}
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
                </div>
            </div>

            <ToastContainer />
        </AppLayout>
    );
}
