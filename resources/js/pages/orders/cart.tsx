import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/orders',
    },
    {
        title: 'Keranjang',
        href: '/orders/cart',
    },
];

const dummyData: {
    title: string;
    price: number;
    order: number;
    link: string;
    testPackages: {
        title: string;
        price: number;
    }[];
    notes?: string;
}[] = [
    {
        title: 'Uji Material Kerikil Lengkap',
        price: 850000,
        order: 1,
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
        notes: 'Untuk kebutuhan dasar sebelum produksi atau riset awal.',
    },
    {
        title: 'Uji Material Kerikil Lengkap',
        price: 850000,
        order: 1,
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
        notes: 'Untuk kebutuhan dasar sebelum produksi atau riset awal.',
    },
    {
        title: 'Uji Material Kerikil Lengkap',
        price: 850000,
        order: 1,
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
        notes: 'Untuk kebutuhan dasar sebelum produksi atau riset awal.',
    },
];

export default function Cart() {
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
            <Head title="Keranjang" />

            <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-1 xl:grid-cols-3">
                <div className="space-y-4 xl:col-span-2">
                    <ol className="small-font-size flex w-full items-center space-x-2 rounded-lg border border-gray-200 bg-white p-3 text-center font-medium text-gray-500 shadow-xs sm:space-x-4 sm:p-4 rtl:space-x-reverse dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        <li className="flex items-center text-blue-600 dark:text-blue-500">
                            <span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-600 dark:border-blue-500">
                                1
                            </span>
                            Keranjang
                            <svg
                                className="ms-2 h-3 w-3 sm:ms-4 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 12 10"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m7 9 4-4-4-4M1 9l4-4-4-4"
                                />
                            </svg>
                        </li>
                        <li className="flex items-center">
                            <span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                                2
                            </span>
                            Formulir Pesanan
                            <svg
                                className="ms-2 h-3 w-3 sm:ms-4 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 12 10"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m7 9 4-4-4-4M1 9l4-4-4-4"
                                />
                            </svg>
                        </li>
                        <li className="flex items-center">
                            <span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                                3
                            </span>
                            Checkout
                        </li>
                    </ol>
                    <Separator />
                    <div className="flex flex-col gap-4">
                        {dummyData.map((data, index) => (
                            <>
                                <div className="flex gap-4" key={index}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 640 512"
                                        className="h-8 w-8 md:h-12 md:w-12"
                                        fill="currentColor"
                                    >
                                        <path d="M175 389.4c-9.8 16-15 34.3-15 53.1c-10 3.5-20.8 5.5-32 5.5c-53 0-96-43-96-96L32 64C14.3 64 0 49.7 0 32S14.3 0 32 0L96 0l64 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 245.9-49 79.6zM96 64l0 96 64 0 0-96L96 64zM352 0L480 0l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 150.9L629.7 406.2c6.7 10.9 10.3 23.5 10.3 36.4c0 38.3-31.1 69.4-69.4 69.4l-309.2 0c-38.3 0-69.4-31.1-69.4-69.4c0-12.8 3.6-25.4 10.3-36.4L320 214.9 320 64c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0zm32 64l0 160c0 5.9-1.6 11.7-4.7 16.8L330.5 320l171 0-48.8-79.2c-3.1-5-4.7-10.8-4.7-16.8l0-160-64 0z" />
                                    </svg>
                                    <div className="flex-1 space-y-1">
                                        <p className="big-font-size font-medium">{data.title}</p>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" placeholder="1" className="max-w-[64px]" min={0} value={data.order} />
                                            <Button variant="destructive" className="cursor-pointer transition duration-300">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    className="lucide lucide-x"
                                                >
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                                Hapus
                                            </Button>
                                        </div>
                                        <div className="">
                                            <p className="small-font-size text-neutral-500">Isi Paket</p>
                                            <ol className="small-font-size list-inside list-decimal">
                                                {data.testPackages.map((test, index) => (
                                                    <li key={index}>
                                                        <Link href="/tests/example" className="hover:underline">
                                                            {test.title} - {formatRupiah(test.price)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                        <small>
                                            <span className="text-red-base">*</span> {data.notes}
                                        </small>
                                    </div>
                                    <p className="font-semibold">{formatRupiah(data.price)}</p>
                                </div>
                                <Separator />
                            </>
                        ))}
                    </div>
                </div>

                <Card className="flex h-fit flex-col gap-4 p-4 xl:col-span-1">
                    <div className="flex justify-between">
                        <small className="font-medium">Subtotal</small>
                        <small className="font-semibold">{formatRupiah(500000)}</small>
                    </div>
                    <div className="flex justify-between">
                        <small className="font-medium">Pajak</small>
                        <small className="font-semibold">{formatRupiah(50000)}</small>
                    </div>
                    <div className="flex justify-between">
                        <small className="font-medium">Biaya Pengiriman</small>
                        <small className="font-semibold">{formatRupiah(50000)}</small>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <p className="font-medium">Total</p>
                        <p className="font-semibold">{formatRupiah(600000)}</p>
                    </div>
                    <Button className="bg-blue-base text-light-base dark:text-light-base flex cursor-pointer items-center justify-center px-24 py-6 transition-colors duration-300 ease-out hover:bg-blue-700 hover:decoration-current! dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:decoration-current!">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-8 w-8 md:h-12 md:w-12" fill="currentColor">
                            <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />{' '}
                        </svg>
                        <span className="big-font-size font-semibold">Pesan Sekarang</span>
                    </Button>
                </Card>
            </div>
        </AppLayout>
    );
}
