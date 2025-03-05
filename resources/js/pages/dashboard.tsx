import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import TextLink from "@/components/text-link";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const dummyData: {
    title: string;
    description: string;
    image: string;
    satuan: string;
    laboratorium: string;
    minimumPemesanan: number;
    harga: number;
    link: string;
}[] = [
    {
        title: 'Uji Bor Tangan',
        description: 'Uji bor tangan adalah uji yang dilakukan untuk mengetahui kekuatan tahanan bor tangan terhadap tertentu.',
        image: '/img/tests/laboratory-1.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 1,
        harga: 500000,
        link: 'tests/example',
    },
    {
        title: 'Uji Tekan Beton',
        description: 'Uji tekan beton untuk mengetahui kekuatan tekan beton.',
        image: '/img/tests/laboratory-2.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 2,
        harga: 750000,
        link: 'tests/example',
    },
    {
        title: 'Uji Tarik Baja',
        description: 'Uji tarik baja untuk mengetahui kekuatan tarik baja.',
        image: '/img/tests/laboratory-3.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 3,
        harga: 1000000,
        link: 'tests/example',
    },
    {
        title: 'Uji Lentur Kayu',
        description: 'Uji lentur kayu untuk mengetahui kekuatan lentur kayu.',
        image: '/img/tests/laboratory-4.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 1,
        harga: 600000,
        link: 'tests/example',
    },
    {
        title: 'Uji Geser Tanah',
        description: 'Uji geser tanah untuk mengetahui kekuatan geser tanah.',
        image: '/img/tests/laboratory-5.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 2,
        harga: 800000,
        link: 'tests/example',
    },
    {
        title: 'Uji Kuat Tekan Bata',
        description: 'Uji kuat tekan bata untuk mengetahui kekuatan tekan bata.',
        image: '/img/tests/laboratory-6.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 1,
        harga: 450000,
        link: 'tests/example',
    },
    {
        title: 'Uji Kuat Tarik Baja',
        description: 'Uji kuat tarik baja untuk mengetahui kekuatan tarik baja.',
        image: '/img/tests/laboratory-7.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 3,
        harga: 950000,
        link: 'tests/example',
    },
    {
        title: 'Uji Kuat Lentur Beton',
        description: 'Uji kuat lentur beton untuk mengetahui kekuatan lentur beton.',
        image: '/img/tests/laboratory-8.jpg',
        satuan: 'Sampel',
        laboratorium: 'LMT',
        minimumPemesanan: 2,
        harga: 700000,
        link: 'tests/example',
    }
];

export default function Dashboard() {
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
            <Head title="Dashboard"/>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Pengujian</h2>
                        <TextLink href="/tests" className="text-blue-base">
                            Lihat Semua Pengujian →
                        </TextLink>
                    </div>
                    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {dummyData.map((data, index) => (
                            <Card className="gap-0 p-2" key={index}>
                                <CardHeader className="px-0">
                                    <Link href={data.link}>
                                        <img src="/img/tests/laboratory-1.jpg" alt="Laboratory 1 Image"
                                             className="rounded-md"/>
                                    </Link>
                                    <CardTitle>
                                        <Link href={data.link}>
                                            <h3>{data.title}</h3>
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-0">
                                    <CardDescription className="mb-4 space-y-2">
                                        <p className="truncate-2-lines">{data.description}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Satuan">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z"/>
                                                </svg>
                                                <span className="small-font-size">{data.satuan}</span>
                                            </div>
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
                                                    <path
                                                        d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"/>
                                                </svg>
                                                <span className="small-font-size">{data.laboratorium}</span>
                                            </div>
                                            <div
                                                className="text-light-base bg-teal-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Minimum Pemesanan"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 200l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                                </svg>
                                                <span className="small-font-size">{data.minimumPemesanan}</span>
                                            </div>
                                        </div>
                                    </CardDescription>
                                    <div className="flex flex-wrap items-center justify-between">
                                        <h4 className="font-semibold">{formatRupiah(data.harga)}</h4>
                                        <Link
                                            href={data.link}
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
                </div>
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Pengujian</h2>
                        <TextLink href="/tests" className="text-blue-base">
                            Lihat Semua Pengujian →
                        </TextLink>
                    </div>
                    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {dummyData.map((data, index) => (
                            <Card className="gap-0 p-2" key={index}>
                                <CardHeader className="px-0">
                                    <Link href={data.link}>
                                        <img src="/img/tests/laboratory-1.jpg" alt="Laboratory 1 Image"
                                             className="rounded-md"/>
                                    </Link>
                                    <CardTitle>
                                        <Link href={data.link}>
                                            <h3>{data.title}</h3>
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-0">
                                    <CardDescription className="mb-4 space-y-2">
                                        <p className="truncate-2-lines">{data.description}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Satuan">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z"/>
                                                </svg>
                                                <span className="small-font-size">{data.satuan}</span>
                                            </div>
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
                                                    <path
                                                        d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"/>
                                                </svg>
                                                <span className="small-font-size">{data.laboratorium}</span>
                                            </div>
                                            <div
                                                className="text-light-base bg-teal-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Minimum Pemesanan"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 200l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                                </svg>
                                                <span className="small-font-size">{data.minimumPemesanan}</span>
                                            </div>
                                        </div>
                                    </CardDescription>
                                    <div className="flex flex-wrap items-center justify-between">
                                        <h4 className="font-semibold">{formatRupiah(data.harga)}</h4>
                                        <Link
                                            href={data.link}
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
                </div>
            </div>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-semibold">Pengujian</h2>
                        <TextLink href="/tests" className="text-blue-base">
                            Lihat Semua Pengujian →
                        </TextLink>
                    </div>
                    <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {dummyData.map((data, index) => (
                            <Card className="gap-0 p-2" key={index}>
                                <CardHeader className="px-0">
                                    <Link href={data.link}>
                                        <img src="/img/tests/laboratory-1.jpg" alt="Laboratory 1 Image"
                                             className="rounded-md"/>
                                    </Link>
                                    <CardTitle>
                                        <Link href={data.link}>
                                            <h3>{data.title}</h3>
                                        </Link>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-0">
                                    <CardDescription className="mb-4 space-y-2">
                                        <p className="truncate-2-lines">{data.description}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Satuan">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z"/>
                                                </svg>
                                                <span className="small-font-size">{data.satuan}</span>
                                            </div>
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
                                                    <path
                                                        d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"/>
                                                </svg>
                                                <span className="small-font-size">{data.laboratorium}</span>
                                            </div>
                                            <div
                                                className="text-light-base bg-teal-base flex items-center gap-1 rounded-md px-2 py-1"
                                                title="Minimum Pemesanan"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 448 512"
                                                    className="h-4 w-4 md:h-5 md:w-5"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 200l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/>
                                                </svg>
                                                <span className="small-font-size">{data.minimumPemesanan}</span>
                                            </div>
                                        </div>
                                    </CardDescription>
                                    <div className="flex flex-wrap items-center justify-between">
                                        <h4 className="font-semibold">{formatRupiah(data.harga)}</h4>
                                        <Link
                                            href={data.link}
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
                </div>
            </div>
        </AppLayout>
    );
}
