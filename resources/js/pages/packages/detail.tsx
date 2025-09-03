'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PackageCart, Package as TestPackage } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, CheckCircle2, Clock, MapPin, Package, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

const howItWorks: {
    id: number;
    title: string;
    description: string;
}[] = [
    {
        id: 1,
        title: 'Pemesanan',
        description: 'Pesan paket pengujian melalui sistem dan lakukan pembayaran untuk mengamankan slot pengujian.',
    },
    {
        id: 2,
        title: 'Penyerahan Sampel',
        description: 'Antar sampel pengujian ke laboratorium atau gunakan layanan pengambilan sampel kami.',
    },
    {
        id: 3,
        title: 'Pengujian',
        description: 'Tim laboratorium kami akan melakukan semua pengujian yang termasuk dalam paket menggunakan peralatan laboratorium',
    },
    {
        id: 4,
        title: 'Analisis dan Pelaporan',
        description: 'Semua hasil akan dianalisis oleh tim ahli kami dan laporan komprehensif akan disiapkan.',
    },
    {
        id: 5,
        title: 'Hasil',
        description: 'Pengguna akan menerima pemberiathuan hasil pengujian melalui email dan dapat mengunduhnya dari akun mereka di sistem.',
    },
];

export default function PackageDetail({ data }: { data: TestPackage }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Paket Pengujian',
            href: '/packages',
        },
        {
            title: data.name,
            href: '/packages/' + data.slug,
        },
    ];

    const [mainImage, setMainImage] = useState(data.images[0]);
    const [packageCart, setPackageCart] = useState<PackageCart[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const savedPackage = localStorage.getItem('packages');
        if (savedPackage) {
            const parsedPackage = JSON.parse(savedPackage);
            setPackageCart(parsedPackage);
        }
    }, []);

    const handleAddTestToCart = (selectedPackage: TestPackage) => {
        setIsAdding(true);
        const existingTest: PackageCart | undefined = packageCart.find((item) => item.package_id === selectedPackage.id);
        if (existingTest) {
            toast.error('Paket sudah ada dikeranjang!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setIsAdding(false);
        } else {
            const newTestCart: PackageCart = {
                package_id: selectedPackage.id,
                slug: selectedPackage.slug,
                package: selectedPackage,
                quantity: 1,
            };
            setPackageCart([...packageCart, newTestCart]);
            toast.success('Paket berhasil ditambahkan ke keranjang!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            localStorage.setItem('packages', JSON.stringify([...packageCart, newTestCart]));
            setIsAdding(false);
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data.name} />

            <div className="min-h-screen bg-zinc-50 py-6 dark:bg-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                        {/* Package Header Section */}
                        <div className="lg:col-span-12">
                            <div className="flex flex-col gap-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 dark:border-blue-800 dark:from-blue-950/30 dark:to-cyan-950/30">
                                <div className="flex flex-col items-start justify-between gap-4 sm:items-center md:flex-row">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                            <Package className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-zinc-900 md:text-3xl dark:text-white">{data.name}</h1>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className="border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                                                >
                                                    <Building2 className="mr-1 h-3 w-3" /> {data.laboratory.code}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className="border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                                                >
                                                    <MapPin className="mr-1 h-3 w-3" /> {data.laboratory.room}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatRupiah(data.price)}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Package Image and Info */}
                        <div className="lg:col-span-4">
                            <div className="space-y-6">
                                <Card className="overflow-hidden border-0 bg-white shadow-lg dark:bg-zinc-900">
                                    <CardContent className="p-0">
                                        <div className="relative aspect-video w-full overflow-hidden">
                                            <img
                                                src={'/storage/' + mainImage}
                                                alt={data.name}
                                                className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                                            />
                                        </div>

                                        <div className="p-4">
                                            <Carousel className="w-full">
                                                <CarouselContent className="-ml-2 md:-ml-4">
                                                    {data.images.map((image: string, index: number) => (
                                                        <CarouselItem className="basis-1/3 pl-2 md:pl-4" key={index}>
                                                            <div
                                                                className={`cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200 hover:border-blue-400 ${
                                                                    mainImage === image
                                                                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                                                        : 'border-zinc-200 dark:border-zinc-600'
                                                                }`}
                                                                onClick={() => setMainImage(image)}
                                                            >
                                                                <img
                                                                    src={'/storage/' + image}
                                                                    alt={`${data.name} ${index + 1}`}
                                                                    className="aspect-square h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                                                                />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="left-1 border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600" />
                                                <CarouselNext className="right-1 border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600" />
                                            </Carousel>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-0 bg-white p-6 shadow-lg dark:bg-zinc-900">
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-xl text-zinc-900 dark:text-white">Ringkasan Paket</CardTitle>
                                    </CardHeader>
                                    <CardContent className="mt-4 space-y-4 p-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-300">Jumlah Pengujian</span>
                                            <span className="font-medium text-zinc-900 dark:text-white">{data.tests?.length} Pengujian</span>
                                        </div>
                                        <Separator className="bg-zinc-200 dark:bg-zinc-700" />
                                        <div className="flex items-center justify-between"></div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-zinc-600 dark:text-zinc-300">Harga Paket</span>
                                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatRupiah(data.price)}</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="mt-6 p-0">
                                        <Button
                                            onClick={() => handleAddTestToCart(data)}
                                            disabled={isAdding}
                                            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-semibold text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                            size="lg"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                            {isAdding ? 'Menambahkan...' : 'Pesan Paket Ini'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>

                        {/* Package Details and Tests */}
                        <div className="lg:col-span-8">
                            <div className="space-y-6">
                                <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 bg-zinc-100 dark:bg-zinc-900">
                                        <TabsTrigger
                                            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-900 md:text-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
                                            value="details"
                                        >
                                            Deskripsi
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-900 md:text-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
                                            value="tests"
                                        >
                                            Pengujian Termasuk
                                        </TabsTrigger>
                                        <TabsTrigger
                                            className="text-xs data-[state=active]:bg-white data-[state=active]:text-zinc-900 md:text-sm dark:data-[state=active]:bg-zinc-700 dark:data-[state=active]:text-white"
                                            value="how-it-works"
                                        >
                                            Cara Kerja
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="mt-6">
                                        <Card className="border-0 bg-white p-6 shadow-lg dark:bg-zinc-900">
                                            <CardHeader className="p-0">
                                                <CardTitle className="mb-2 text-xl text-zinc-900 dark:text-white">Tentang Paket Ini</CardTitle>
                                                <CardDescription className="text-sm text-zinc-600 sm:text-base dark:text-zinc-300">
                                                    {data.description}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6 p-0">
                                                <div>
                                                    <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-white">Manfaat Paket</h3>
                                                    <ul className="space-y-3">
                                                        <li className="flex items-start gap-3">
                                                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                            <span className="text-zinc-600 dark:text-zinc-300">Laporan lengkap hasil pengujian</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                            <span className="text-zinc-600 dark:text-zinc-300">Pelayanan maksimal dan tercepat</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                            <span className="text-zinc-600 dark:text-zinc-300">
                                                                Ditangani oleh teknisi laboratorium dan lapangan berpengalaman
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="tests" className="mt-6">
                                        <Card className="border-0 bg-white p-6 shadow-lg dark:bg-zinc-900">
                                            <CardHeader className="p-0">
                                                <CardTitle className="text-xl text-zinc-900 dark:text-white">Pengujian dalam Paket</CardTitle>
                                                <CardDescription className="text-zinc-600 dark:text-zinc-300">
                                                    Paket ini mencakup {data.tests?.length} pengujian
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-6 p-0">
                                                <div className="space-y-4">
                                                    {data.tests?.map((test, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50"
                                                        >
                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <img
                                                                        src={'/storage/' + test.images[0]}
                                                                        alt={test.name}
                                                                        className="h-16 w-16 rounded-md object-cover"
                                                                    />
                                                                    <div>
                                                                        <h4 className="font-semibold text-zinc-900 dark:text-white">{test.name}</h4>
                                                                        <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>{test.daily_slot} slot/hari</span>
                                                                            <span className="text-xs">•</span>
                                                                            <span>Min. {test.minimum_unit} unit</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="text-right">
                                                                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                                                                            Harga Individual
                                                                        </div>
                                                                        <div className="font-semibold text-zinc-900 dark:text-white">
                                                                            {formatRupiah(test.price)}
                                                                        </div>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        asChild
                                                                        className="border-zinc-300 bg-transparent hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-700"
                                                                    >
                                                                        <Link href={`/test/${test.slug}`}>Detail</Link>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="how-it-works" className="mt-6">
                                        <Card className="border-0 bg-white p-6 shadow-lg dark:bg-zinc-900">
                                            <CardHeader className="p-0">
                                                <CardTitle className="text-xl text-zinc-900 dark:text-white">Cara Kerja</CardTitle>
                                                <CardDescription className="text-zinc-600 dark:text-zinc-300">
                                                    Proses pemesanan dan pelaksanaan pengujian
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-6 p-0">
                                                <div className="space-y-6">
                                                    {howItWorks.map((step) => (
                                                        <div key={step.id} className="flex gap-4">
                                                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white dark:bg-blue-500">
                                                                {step.id}
                                                            </div>
                                                            <div>
                                                                <p className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
                                                                    {step.title}
                                                                </p>
                                                                <p className="leading-relaxed text-zinc-600 dark:text-zinc-300">{step.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Toast Container */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        className="mt-16"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
