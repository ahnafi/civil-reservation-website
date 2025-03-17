import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Package, PaginatedPackage, Test } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Paket',
        href: '/packages',
    },
];

export default function Packages({ paginated }: { paginated: PaginatedPackage }) {
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
                <div className="grid auto-rows-min grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    {paginated.data.map((data: Package) => (
                        <Card className="gap-0 space-y-2 p-2" key={data.id}>
                            <CardHeader className="flex flex-row items-center gap-2 px-0">
                                <span className="bg-amber-base text-light-base flex aspect-square h-16 w-16 items-center justify-center rounded-full p-4 md:h-20 md:w-20">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="currentColor">
                                        <path d="M175 389.4c-9.8 16-15 34.3-15 53.1c-10 3.5-20.8 5.5-32 5.5c-53 0-96-43-96-96L32 64C14.3 64 0 49.7 0 32S14.3 0 32 0L96 0l64 0 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 245.9-49 79.6zM96 64l0 96 64 0 0-96L96 64zM352 0L480 0l32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 150.9L629.7 406.2c6.7 10.9 10.3 23.5 10.3 36.4c0 38.3-31.1 69.4-69.4 69.4l-309.2 0c-38.3 0-69.4-31.1-69.4-69.4c0-12.8 3.6-25.4 10.3-36.4L320 214.9 320 64c-17.7 0-32-14.3-32-32s14.3-32 32-32l32 0zm32 64l0 160c0 5.9-1.6 11.7-4.7 16.8L330.5 320l171 0-48.8-79.2c-3.1-5-4.7-10.8-4.7-16.8l0-160-64 0z" />
                                    </svg>
                                </span>
                                <div className="flex flex-col gap-1">
                                    <CardTitle>
                                        <Link href={'/packages/' + data.slug}>
                                            <h2 className="big-font-size">{data.name}</h2>
                                        </Link>
                                    </CardTitle>
                                    <small className="small-font-size font-normal">{data.description}</small>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 px-0">
                                <h3 className="font-semibold">{formatRupiah(data.price)}</h3>
                                <ul className="flex flex-col gap-1">
                                    {data.tests?.map((test: Test) => (
                                        <li key={test.id} className="flex items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 448 512"
                                                fill="currentColor"
                                                className="text-light-base bg-blue-base inline-block h-4 w-4 rounded-full p-1 md:h-5 md:w-5"
                                            >
                                                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                            </svg>
                                            <div className="flex w-full justify-between">
                                                <p>{test.name}</p>
                                                <p className="font-medium">{formatRupiah(test.price)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={'/packages/' + data.slug}
                                    className="text-blue-base border-blue-base hover:bg-blue-base hover:text-light-base flex items-center justify-center gap-1 rounded-md border-2 px-3 py-2 transition duration-300"
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
                                <small>
                                    <span className="text-red-base">*</span> Rekomendasi: Untuk kebutuhan dasar sebelum produksi atau riset awal.
                                </small>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
