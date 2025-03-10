import { ScheduleTable } from '@/components/dashboard/schedule-table';

('use-client');

import { Card } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

export default function MainDashboard() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ];

    const formatRupiah = (value: number, currency = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

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
                            <p className="text-3xl font-semibold">{formatRupiah(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{formatRupiah(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{formatRupiah(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                        <Card className="gap-2 p-4">
                            <div className="flex justify-between">
                                <p className="font-medium">Total Pengeluaran</p>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="h-6 w-6">
                                    <path d="M0 64C0 46.3 14.3 32 32 32l80 0c79.5 0 144 64.5 144 144c0 58.8-35.2 109.3-85.7 131.7l51.4 128.4c6.6 16.4-1.4 35-17.8 41.6s-35-1.4-41.6-17.8L106.3 320 64 320l0 128c0 17.7-14.3 32-32 32s-32-14.3-32-32L0 288 0 64zM64 256l48 0c44.2 0 80-35.8 80-80s-35.8-80-80-80L64 96l0 160zm256-96l80 0c61.9 0 112 50.1 112 112s-50.1 112-112 112l-48 0 0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128 0-160c0-17.7 14.3-32 32-32zm80 160c26.5 0 48-21.5 48-48s-21.5-48-48-48l-48 0 0 96 48 0z" />
                                </svg>
                            </div>
                            <p className="text-3xl font-semibold">{formatRupiah(50000)}</p>
                            <small className="text-muted-foreground">+20.1% from last month</small>
                        </Card>
                    </div>
                    <div className="col-span-2 space-y-2">
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
                    <div className="col-span-2 space-y-2">
                        <h2 className="font-semibold">Jadwal Reservasi Anda</h2>
                        <ScheduleTable />
                    </div>
                    <div className="col-span-full space-y-2">
                        <h2 className="font-semibold">Jadwal Peminjaman Laboratorium</h2>
                        <ScheduleTable />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
