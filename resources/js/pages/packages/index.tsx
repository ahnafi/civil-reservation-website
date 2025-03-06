import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Paket',
        href: '/packages',
    },
];

const dummyData: {
    title: string;
    description: string;
    image: string;
    price: number;
    link: string;
    testPackages: {
        title: string;
        price: number;
    }[];
}[] = [
    {
        title: 'Uji Material Kerikil Lengkap',
        description: 'Uji material kerikil lengkap untuk mengetahui kualitas kerikil.',
        image: '/img/tests/laboratory-1.jpg',
        price: 850000,
        link: 'packages/example',
        testPackages: [
            {
                title: 'Uji Kadar Air',
                price: 100000,
            },
            {
                title: 'Uji Berat Jenis',
                price: 150000,
            },
            {
                title: 'Uji Kadar Lumpur',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
        ],
    },
    {
        title: 'Uji Material Pasir Lengkap',
        description: 'Uji material pasir lengkap untuk mengetahui kualitas pasir.',
        image: '/img/tests/laboratory-2.jpg',
        price: 750000,
        link: 'packages/example',
        testPackages: [
            {
                title: 'Uji Kadar Air',
                price: 100000,
            },
            {
                title: 'Uji Berat Jenis',
                price: 150000,
            },
            {
                title: 'Uji Kadar Lumpur',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
        ],
    },
    {
        title: 'Uji Material Tanah Lengkap',
        description: 'Uji material tanah lengkap untuk mengetahui kualitas tanah.',
        image: '/img/tests/laboratory-3.jpg',
        price: 950000,
        link: 'packages/example',
        testPackages: [
            {
                title: 'Uji Kadar Air',
                price: 100000,
            },
            {
                title: 'Uji Berat Jenis',
                price: 150000,
            },
            {
                title: 'Uji Kadar Lumpur',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
        ],
    },
    {
        title: 'Uji Material Batu Lengkap',
        description: 'Uji material batu lengkap untuk mengetahui kualitas batu.',
        image: '/img/tests/laboratory-4.jpg',
        price: 800000,
        link: 'packages/example',
        testPackages: [
            {
                title: 'Uji Kadar Air',
                price: 100000,
            },
            {
                title: 'Uji Berat Jenis',
                price: 150000,
            },
            {
                title: 'Uji Kadar Lumpur',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
            {
                title: 'Uji Kadar Tanah Liat',
                price: 200000,
            },
        ],
    },
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
            <Head title="Pengujian" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid">
                    {dummyData.map((data, index) => (
                        <Card className="space-y-2 gap-0 p-2" key={index}>
                            <CardHeader className="px-0 flex flex-row gap-2 items-center">
                                <span className="bg-amber-base text-light-base aspect-square h-16 w-16 rounded-full p-4 md:h-20 md:w-20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 512"
                                        fill="currentColor"
                                    >
                                        <path d="M175 389.4c-9.8 16-15 34.3-15 53.1c-10 3.5-20.8 5.5-32 5.5c-53 0-96-43-96-96L32 64C14.3 64 0 49.7 0 32S14.3 0 32 0L96 0l64 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 245.9-49 79.6zM96 64l0 96 64 0 0-96L96 64zM352 0L480 0l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 150.9L629.7 406.2c6.7 10.9 10.3 23.5 10.3 36.4c0 38.3-31.1 69.4-69.4 69.4l-309.2 0c-38.3 0-69.4-31.1-69.4-69.4c0-12.8 3.6-25.4 10.3-36.4L320 214.9 320 64c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0zm32 64l0 160c0 5.9-1.6 11.7-4.7 16.8L330.5 320l171 0-48.8-79.2c-3.1-5-4.7-10.8-4.7-16.8l0-160-64 0z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col gap-1">
                                    <CardTitle>
                                        <Link href={data.link}>
                                            <h2 className="big-font-size">{data.title}</h2>
                                        </Link>
                                    </CardTitle>
                                    <small className="small-font-size font-normal">{data.description}</small>
                                </div>
                            </CardHeader>
                            <CardContent className="px-0 space-y-2">
                                    <h3 className="font-semibold">{formatRupiah(data.price)}</h3>
                                    <ul className="flex flex-col gap-1">
                                    {data.testPackages.map((test, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                 viewBox="0 0 448 512"
                                                 fill="currentColor"
                                                 className="h-4 w-4 md:h-5 md:w-5 inline-block text-light-base bg-blue-base rounded-full p-1">
                                                <path
                                                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                                            </svg>
                                            <div className="flex justify-between w-full">
                                                <p>{test.title}</p>
                                                <p className="font-medium">{formatRupiah(test.price)}</p>
                                            </div>
                                        </li>
                                    ))}
                                    </ul>
                                    <Link
                                        href={data.link}
                                        className="text-blue-base border-2 border-blue-base hover:bg-blue-base hover:text-light-base flex items-center justify-center gap-1 rounded-md px-3 py-2 transition duration-300"
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
                                        <p>Tambah ke Keranjang</p>
                                    </Link>
                                <small><span className="text-red-base">*</span> Rekomendasi: Untuk kebutuhan dasar sebelum produksi atau riset awal.</small>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
