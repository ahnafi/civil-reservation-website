import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Barcode, Calendar, Clock, FileCheck, MapPin } from 'lucide-react';
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

            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Laboratory Image Section */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden py-0">
                            <div className="relative h-80 w-full">
                                <img src={`/storage/${laboratory?.images[0]}`} alt={`${laboratory?.name}`} className="h-full w-full object-cover" />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-blue-600 px-3 py-1 text-white">{laboratory?.code}</Badge>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <h1 className="text-2xl font-bold">{laboratory?.name}</h1>
                                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                                        Laboratorium
                                    </Badge>
                                </div>

                                <Separator className="my-4" />

                                <div className="mb-6">
                                    <h3 className="mb-2 text-lg font-medium">Deskripsi</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{laboratory?.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Ruang</p>
                                            <p className="font-medium">{laboratory?.room}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Kuota Harian</p>
                                            <p className="font-medium">{laboratory?.daily_slot || 'Tidak dibatasi'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Barcode className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Kode</p>
                                            <p className="font-medium">{laboratory?.code}</p>
                                        </div>
                                    </div>
                                </div>

                                {tests && tests.length > 0 && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h3 className="mb-4 text-lg font-medium">Pengujian Tersedia</h3>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {(showAllTests ? tests : tests.slice(0, 4)).map((test) => (
                                                    <Card key={test.id} className="border-gray-200 py-0">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-medium">{test.name}</h4>
                                                            <p className="mb-1 text-gray-500 dark:text-gray-400">{test.description}</p>
                                                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                                                <div
                                                                    className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1"
                                                                    title="Satuan"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 512 512"
                                                                        className="h-4 w-4 md:h-5 md:w-5"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z" />
                                                                    </svg>
                                                                    <span className="small-font-size">{test.category.name}</span>
                                                                </div>
                                                                <div
                                                                    className="text-light-base bg-teal-base flex items-center gap-1 rounded-md px-2 py-1"
                                                                    title="Minimum Pemesanan"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 448 512"
                                                                        fill="currentColor"
                                                                        className="h-4 w-4 md:h-5 md:w-5"
                                                                    >
                                                                        <path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                                                                    </svg>
                                                                    <span className="small-font-size">{test.minimum_unit}</span>
                                                                </div>
                                                            </div>
                                                            <div className={'flex flex-wrap items-center justify-between gap-1'}>
                                                                <h4 className="font-semibold">{formatRupiah(test.price)}</h4>
                                                                <Link
                                                                    href={'/test/' + test.slug}
                                                                    className="bg-blue-base text-light-base flex items-center justify-between gap-1 rounded-md px-3 py-2"
                                                                >
                                                                    <svg
                                                                        className="h-4 w-4 md:h-5 md:w-5"
                                                                        aria-hidden="true"
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            stroke="currentColor"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                                                                        ></path>
                                                                    </svg>
                                                                    <span className="small-font-size">Tambah ke Keranjang</span>
                                                                </Link>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                            {tests.length > 4 && (
                                                <div className="mt-4 text-center">
                                                    <Button onClick={expandTests} variant="outline" className="text-blue-600">
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

                    {/* Booking Card */}
                    <div>
                        <Card className="sticky top-8">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <h3 className="font-medium">Informasi Pengujian</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            <p className="text-sm">Hasil uji akan dikirimkan dalam waktu 3-5 hari kerja</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FileCheck className="h-5 w-5 text-blue-600" />
                                            <p className="text-sm">Hasil uji akan dikirimkan melalui email</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="text-blue-600"
                                            >
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <path d="M9 15h6"></path>
                                                <path d="M9 11h6"></path>
                                            </svg>
                                            <p className="text-sm">Hasil uji dapat diunduh dalam bentuk PDF</p>
                                        </div>
                                    </div>
                                </div>

                                {packages && packages.length > 0 && (
                                    <>
                                        <Separator className="my-6" />
                                        <div>
                                            <h3 className="mb-4 font-medium">Paket Pengujian</h3>
                                            <div className="space-y-3">
                                                {packages.slice(0, 3).map((pkg) => (
                                                    <div
                                                        key={pkg.id}
                                                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 p-3"
                                                    >
                                                        <div>
                                                            <h4 className="font-medium">{pkg.name}</h4>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatRupiah(pkg.price)}</p>
                                                        </div>
                                                        <Link
                                                            href={'/package/' + pkg.slug}
                                                            className="small-font-size flex items-center justify-between gap-1 rounded-md border px-2 py-1 hover:bg-gray-100 md:px-3 md:py-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                                        >
                                                            Lihat Paket
                                                        </Link>
                                                    </div>
                                                ))}
                                                {packages.length > 3 && (
                                                    <div className="mt-4 text-center">
                                                        <Button onClick={expandPackages} variant="outline" className="text-blue-600">
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
        </AppLayout>
    );
}
