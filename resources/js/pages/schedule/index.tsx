'use client';

import AppLayout from '@/layouts/app-layout';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
} from '@tanstack/react-table';
import { Check, ChevronDown, FlaskConical, HardHat, X } from 'lucide-react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DatePicker } from '@/components/DatePicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DropdownSelect from '@/components/ui/DropdownSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BreadcrumbItem } from '@/types';
import { type SubmissionSchedule, LaboratorySimple, SimpleOption } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { columns } from './tableConfig';

// Column Labels
export const columnLabels: Record<string, string> = {
    code: 'Kode Pengajuan',
    test_submission_date: 'Tanggal',
    company_name: 'Perusahaan',
    lab_code: 'Lab',
    test_name: 'Jenis Pengujian',
    status: 'Status',
};

// Status Options
export const statusOptions: SimpleOption[] = [
    { id: 1, name: 'Approved' },
    { id: 2, name: 'Rejected' },
    { id: 3, name: 'Submitted' },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Pengujian',
        href: '/schedule',
    },
];

// Main Component
export default function Schedule({
    submissions,
    tests,
    packages,
    laboratories,
}: {
    submissions: SubmissionSchedule[];
    tests: SimpleOption[];
    packages: SimpleOption[];
    laboratories: LaboratorySimple[];
}) {
    // Table State
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [rows, setRows] = useState<number>(10);

    // Filter State
    const [selectedLab, setSelectedLab] = useState<LaboratorySimple | null>(null);
    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<SimpleOption | null>(null);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const [initialDate, setInitialDate] = useState<Date | undefined>(firstDayOfMonth);
    const [finalDate, setFinalDate] = useState<Date | undefined>(lastDayOfMonth);

    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());

    // Alert State
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    // Merged Test and Package Options
    const mergedTestPackage: SimpleOption[] = [...packages, ...tests];

    // Table Definition
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
    });

    // Column Filter Update
    const updateColumnFilter = (id: string, value: unknown) => {
        setColumnFilters((prevFilters) => {
            const otherFilters = prevFilters.filter((f) => f.id !== id);
            if (value === undefined || value === null || value === '') {
                return otherFilters;
            }
            return [...otherFilters, { id, value }];
        });
    };

    // Date Column Filter
    useEffect(() => {
        if (initialDate) {
            updateColumnFilter('test_submission_date', {
                start: initialDate,
                end: finalDate ?? initialDate, // default to initialDate
            });
        } else {
            updateColumnFilter('test_submission_date', undefined);
        }
    }, [initialDate, finalDate]);

    // Lab Column Filter
    useEffect(() => {
        if (selectedLab?.name) {
            updateColumnFilter('lab_code', selectedLab.code);
        } else {
            updateColumnFilter('lab_code', undefined);
        }
    }, [selectedLab]);

    // Test Column Filter
    useEffect(() => {
        if (selectedTest?.name) {
            updateColumnFilter('test_name', selectedTest.name);
        } else {
            updateColumnFilter('test_name', undefined);
        }
    }, [selectedTest]);

    // Status Column Filter
    useEffect(() => {
        if (selectedStatus?.name) {
            updateColumnFilter('status', selectedStatus.name);
        } else {
            updateColumnFilter('status', undefined);
        }
    }, [selectedStatus]);

    // Row Pagination
    useEffect(() => {
        table.setPageSize(rows);
    }, [rows, table]);

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

    // Initial Date Select Handlers
    const handleInitialDateSelect = (date: Date | undefined) => {
        const selected = date ?? new Date();
        setInitialDate(selected);

        if (!finalDate || finalDate.getTime() === selected.getTime()) {
            setFinalDate(selected);
            setAlertMessage(null);
        } else if (selected.getTime() > finalDate.getTime()) {
            setAlertMessage('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
            setFinalDate(selected);
        } else {
            setAlertMessage(null);
        }
    };

    // Final Date Select Handlers
    const handleFinalDateSelect = (date: Date | undefined) => {
        if (!date) {
            setFinalDate(undefined);
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
            setFinalDateKey(Date.now()); // Force re-render if needed
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Pengujian" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="agenda col-span-full space-y-2">
                        <h1 className="title font-semibold">Jadwal Pengujian Laboratorium</h1>
                        <div className="agenda-table-filters small-font-size mb-2 flex hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
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
                            <div className="lab-type">
                                <DropdownSelect
                                    label="Laboratorium"
                                    options={laboratories}
                                    selectedOption={selectedLab}
                                    setSelectedOption={setSelectedLab}
                                    placeholder="Filter Laboratorium"
                                    icon={<FlaskConical size={18} />}
                                />
                            </div>
                            <div className="status-type">
                                <DropdownSelect
                                    label="Status"
                                    options={statusOptions}
                                    selectedOption={selectedStatus}
                                    setSelectedOption={setSelectedStatus}
                                    placeholder="Filter Status"
                                    icon={<Check size={18} />}
                                />
                            </div>
                            <div className="date-range-picker flex flex-col gap-1">
                                <label className="text-foreground font-medium">Tanggal</label>
                                <div className="flex gap-3">
                                    <div className="initial-date">
                                        <DatePicker value={initialDate} placeholder="Pilih Tanggal Awal" onDateSelect={handleInitialDateSelect} />
                                    </div>
                                    <div className="flex items-center justify-center">-</div>
                                    <div className="final-date">
                                        <DatePicker
                                            key={finalDateKey}
                                            value={finalDate}
                                            placeholder="Pilih Tanggal Akhir"
                                            onDateSelect={handleFinalDateSelect}
                                        />
                                    </div>
                                </div>

                                {(initialDate || finalDate) && (
                                    <div className="clear-date-button flex justify-end text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setInitialDate(undefined);
                                                setFinalDate(undefined);
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

                        {/* Tombol Filter untuk layar kecil */}
                        <div className="mb-2 flex justify-end lg:mb-4 lg:hidden">
                            <Dialog>
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
                                                selectedOption={selectedTest}
                                                setSelectedOption={setSelectedTest}
                                                placeholder="Filter Jenis Pengujian..."
                                                searchIcon={<HardHat size={16} />}
                                            />
                                        </div>
                                        <div className="lab-type">
                                            <DropdownSelect
                                                label="Laboratorium"
                                                options={laboratories}
                                                selectedOption={selectedLab}
                                                setSelectedOption={setSelectedLab}
                                                placeholder="Filter Laboratorium"
                                                icon={<FlaskConical size={16} />}
                                            />
                                        </div>
                                        <div className="status-type">
                                            <DropdownSelect
                                                label="Status"
                                                options={statusOptions}
                                                selectedOption={selectedStatus}
                                                setSelectedOption={setSelectedStatus}
                                                placeholder="Filter Status"
                                                icon={<Check size={16} />}
                                            />
                                        </div>
                                        <div className="date-range-picker">
                                            <label className="text-foreground font-medium">Tanggal</label>
                                            <div className="flex justify-between gap-2">
                                                <div className="initial-date flex flex-col">
                                                    <DatePicker
                                                        value={initialDate}
                                                        placeholder="Pilih Tanggal Awal"
                                                        onDateSelect={handleInitialDateSelect}
                                                    />
                                                </div>
                                                <div className="final-date flex flex-col">
                                                    <DatePicker
                                                        key={finalDateKey}
                                                        value={finalDate}
                                                        placeholder="Pilih Tanggal Akhir"
                                                        onDateSelect={handleFinalDateSelect}
                                                    />
                                                </div>
                                            </div>
                                            {(initialDate || finalDate) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setInitialDate(undefined);
                                                        setFinalDate(undefined);
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

                        <div className="agenda-table-main">
                            <div className="agenda-table-option mb-2 flex justify-between lg:mb-4">
                                <div className="flex w-full flex-wrap justify-end gap-2">
                                    <div className="code-search">
                                        <Input
                                            placeholder="Cari Kode Pengajuan..."
                                            value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
                                            onChange={(e) => table.getColumn('code')?.setFilterValue(e.target.value)}
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
                                                {table
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
                                                <Button variant="outline" className="small-font-size ml-auto font-normal">
                                                    Tampilkan {rows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {[10, 25, 50, 100].map((size) => (
                                                    <DropdownMenuCheckboxItem
                                                        key={size}
                                                        checked={rows === size}
                                                        onCheckedChange={() => setRows(size)}
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
                            <div className="agenda-table-body">
                                <div className="rounded-md border">
                                    <Table className="small-font-size">
                                        <TableHeader>
                                            {table.getHeaderGroups().map((headerGroup) => (
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
                                            {table.getRowModel().rows?.length ? (
                                                table.getRowModel().rows.map((row) => (
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
                                                    <TableCell colSpan={columns.length} className="h-24 text-center">
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
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                            className="small-font-size"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
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
