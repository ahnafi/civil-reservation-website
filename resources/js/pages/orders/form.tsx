import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import OrderForm from '@/forms/order-form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/orders',
    },
    {
        title: 'Keranjang',
        href: '/orders/cart',
    },
    {
        title: 'Formulir',
        href: '/orders/cart/form',
    },
];

export default function FormOrder() {
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
            <Head title="Formulir" />

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
                        <li className="flex items-center text-blue-600 dark:text-blue-500">
                            <span className="me-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-600 dark:border-blue-500">
                                2
                            </span>
                            Formulir
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
                    <OrderForm />
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
