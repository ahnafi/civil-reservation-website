('use-client');

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { GeneralSchedule, LaboratorySimple, SimpleOption, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { AppWindow, Calendar, DollarSign, Tag } from 'lucide-react';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { columns } from './tableConfig';

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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function MainDashboard({
    schedule,
}: {
    schedule: GeneralSchedule[];
    tests: SimpleOption[];
    packages: SimpleOption[];
    laboratories: LaboratorySimple[];
}) {
    // Table State
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Table Definition
    const table = useReactTable<GeneralSchedule>({
        data: schedule,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    function formatToRupiah(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            // style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="col-span-full grid grid-cols-1 grid-cols-2 gap-4 lg:grid-cols-4">
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <DollarSign />
                            </div>
                            <p className="big-font-size font-semibold">{formatToRupiah(50000)}</p>
                            <small className="text-muted-foreground extra-small-font-size">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Reservasi Bulan Ini</p>
                                <AppWindow />
                            </div>
                            <p className="big-font-size font-semibold">4</p>
                            <small className="text-muted-foreground extra-small-font-size">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Reservasi Mendatang</p>
                                <Calendar />
                            </div>
                            <p className="big-font-size font-semibold">1</p>
                            <small className="text-muted-foreground extra-small-font-size">Rabu, 21 Maret 2025 pukul 09:00 - Lab Hidrologi</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Reservasi Aktif Hari Ini</p>
                                <Tag />
                            </div>
                            <p className="big-font-size font-semibold">2</p>
                            <small className="text-muted-foreground extra-small-font-size">+20.1% from last month</small>
                        </Card>
                    </div>
                    <div className="col-span-full space-y-2 lg:col-span-2">
                        <h3 className="font-semibold">Grafik Bulanan Laboratorium</h3>
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
                    <div className="col-span-full space-y-2 lg:col-span-2">
                        <h3 className="font-semibold">Jadwal Reservasi Laboratorium Bulan Ini</h3>
                        <Table className="small-font-size">
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

            <ToastContainer />
        </AppLayout>
    );
}
