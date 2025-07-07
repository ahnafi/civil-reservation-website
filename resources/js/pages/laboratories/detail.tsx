'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Barcode, Calendar, Clock, ExternalLink, FileCheck, MapPin, Package, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function Laboratory() {
    const { laboratory, tests, packages } = usePage().props as PageProps;
    const [showAllTests, setShowAllTests] = useState(false);
    const [showAllPackages, setShowAllPackages] = useState(false);

    const expandTests = () => setShowAllTests(!showAllTests);
    const expandPackages = () => setShowAllPackages(!showAllPackages);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Laboratorium',
            href: '/laboratories',
        },
        {
            title: `Laboratorium ${laboratory?.name}`,
            href: `/laboratory/${laboratory?.slug}`,
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
            <Head title={laboratory?.name} />

            <div className="min-h-screen bg-zinc-50 py-6 dark:bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Laboratory Image Section */}
                        <div className="lg:col-span-2">
                            <Card className="overflow-hidden border-0 bg-white shadow-lg dark:bg-zinc-900">
                                <div className="relative h-80 w-full">
                                    <img
                                        src={`/storage/${laboratory?.images[0]}`}
                                        alt={`${laboratory?.name}`}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="border-0 bg-blue-600 px-3 py-1 text-white shadow-lg">{laboratory?.code}</Badge>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl dark:text-white">{laboratory?.name}</h1>
                                        <Badge
                                            variant="outline"
                                            className="w-fit border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                                        >
                                            Laboratorium
                                        </Badge>
                                    </div>

                                    <Separator className="my-4 bg-zinc-200 dark:bg-zinc-700" />

                                    <div className="mb-6">
                                        <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">Deskripsi</h3>
                                        <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{laboratory?.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Ruang</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">{laboratory?.room}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Kuota Harian</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">
                                                    {laboratory?.daily_slot || 'Tidak dibatasi'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                                                <Barcode className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Kode</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">{laboratory?.code}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {tests && tests.length > 0 && (
                                        <>
                                            <Separator className="my-6 bg-zinc-200 dark:bg-zinc-700" />
                                            <div>
                                                <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Pengujian Tersedia</h3>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    {(showAllTests ? tests : tests.slice(0, 4)).map((test) => (
                                                        <Card
                                                            key={test.id}
                                                            className="border-0 bg-zinc-50 shadow-md transition-shadow duration-200 hover:shadow-lg dark:bg-zinc-800"
                                                        >
                                                            <CardContent className="p-4">
                                                                {/* Wrap only title + description + badges in the Link */}
                                                                <h4 className="mb-2 font-semibold text-zinc-900 dark:text-white">{test.name}</h4>
                                                                <p className="mb-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                                                                    {test.description}
                                                                </p>
                                                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-amber-100 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                                                    >
                                                                        <Wrench className="mr-1 h-3 w-3" />
                                                                        {test.category.name}
                                                                    </Badge>
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-teal-100 text-xs text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                                                                    >
                                                                        <Package className="mr-1 h-3 w-3" />
                                                                        {test.minimum_unit}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                                    <h4 className="font-bold text-blue-600 dark:text-blue-400">
                                                                        {formatRupiah(test.price)}
                                                                    </h4>

                                                                    <Link
                                                                        href={'/test/' + test.slug}
                                                                        className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                                                    >
                                                                        <ExternalLink className="h-3 w-3" />
                                                                        <span>Lihat Detail Pengujian</span>
                                                                    </Link>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>

                                                {tests.length > 4 && (
                                                    <div className="mt-6 text-center">
                                                        <Button
                                                            onClick={expandTests}
                                                            variant="outline"
                                                            className="border-blue-300 bg-transparent text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                        >
                                                            {showAllTests ? 'Tutup Pengujian' : 'Lihat Semua Pengujian'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Information Card */}
                        <div>
                            <Card className="sticky top-8 border-0 bg-white shadow-lg dark:bg-zinc-900">
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Informasi Pengujian</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                    Hasil uji akan dikirimkan dalam waktu 3-5 hari kerja
                                                </p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full bg-green-100 p-2 dark:bg-green-900">
                                                    <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Hasil uji akan dikirimkan melalui email</p>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="text-purple-600 dark:text-purple-400"
                                                    >
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                        <polyline points="14 2 14 8 20 8"></polyline>
                                                        <path d="M9 15h6"></path>
                                                        <path d="M9 11h6"></path>
                                                    </svg>
                                                </div>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300">Hasil uji dapat diunduh dalam bentuk PDF</p>
                                            </div>
                                        </div>
                                    </div>

                                    {packages && packages.length > 0 && (
                                        <>
                                            <Separator className="my-6 bg-zinc-200 dark:bg-zinc-700" />
                                            <div>
                                                <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">Paket Pengujian</h3>
                                                <div className="space-y-3">
                                                    {(showAllPackages ? packages : packages.slice(0, 3)).map((pkg) => (
                                                        <div
                                                            key={pkg.id}
                                                            className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-700 dark:bg-zinc-800"
                                                        >
                                                            <div>
                                                                <h4 className="font-medium text-zinc-900 dark:text-white">{pkg.name}</h4>
                                                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                                    {formatRupiah(pkg.price)}
                                                                </p>
                                                            </div>
                                                            <Link
                                                                href={'/package/' + pkg.slug}
                                                                className="flex items-center justify-center gap-1 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                                Lihat Paket
                                                            </Link>
                                                        </div>
                                                    ))}
                                                    {packages.length > 3 && (
                                                        <div className="mt-4 text-center">
                                                            <Button
                                                                onClick={expandPackages}
                                                                variant="outline"
                                                                className="border-blue-300 bg-transparent text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                                            >
                                                                {showAllPackages ? 'Tutup Paket' : 'Lihat Semua Paket'}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
