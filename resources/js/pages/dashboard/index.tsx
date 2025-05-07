('use-client');

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { GeneralSchedule, LaboratorySimple, SimpleOption, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
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
    laboratories,
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

    console.info(laboratories);

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
                    <div className="col-span-full space-y-2">
                        <h3 className="font-semibold">Laboratorium yang Tersedia</h3>
                        <div className="col-span-full grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {laboratories.map((data, index) => (
                                <Card className="gap-0 p-2" key={index}>
                                    <CardHeader className="px-0">
                                        <Link href={`/laboratory/${data.slug}`}>
                                            <img
                                                src={`/storage/${data.image}`}
                                                alt={`${data.name} Foto`}
                                                className="h-28 w-full rounded-md object-cover md:h-48"
                                            />
                                        </Link>
                                        <CardTitle>
                                            <Link href={`/laboratory/${data.slug}`}>
                                                <h4>{data.name}</h4>
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-0">
                                        <CardDescription className="space-y-2">
                                            <p className="truncate-2-lines">{data.description}</p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div
                                                    className="text-light-base bg-purple-base flex items-center gap-1 rounded-md px-2 py-1"
                                                    title="Laboratorium"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 384 512"
                                                        className="h-4 w-4 md:h-5 md:w-5"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" />
                                                    </svg>
                                                    <span className="small-font-size">{data.code}</span>
                                                </div>
                                                <div
                                                    className="text-light-base bg-lime-base flex items-center gap-1 rounded-md px-2 py-1"
                                                    title="Laboratorium"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 320 512"
                                                        fill="currentColor"
                                                        className="h-4 w-4 md:h-5 md:w-5"
                                                    >
                                                        <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-223.1L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6l29.7 0c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9 232 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-16 0z" />
                                                    </svg>
                                                    <span className="small-font-size">5</span>
                                                </div>
                                            </div>
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </AppLayout>
    );
}
