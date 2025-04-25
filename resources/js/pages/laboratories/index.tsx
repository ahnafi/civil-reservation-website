import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Laboratory } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Laboratorium',
        href: '/laboratories',
    },
];

export default function Laboratories({ laboratories }: { laboratories: Laboratory }) {
    const formatRupiah = (value: number, currency = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    console.info(laboratories);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengujian" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {laboratories.map((laboratory: Laboratory) => (
                        <Card className="gap-0 p-2" key={laboratory.id}>
                            <CardHeader className="px-0">
                                <Link href={'/laboratory/' + laboratory.slug}>
                                    <img
                                        src={'/storage/' + laboratory.image}
                                        alt={laboratory.name}
                                        className="h-48 w-full rounded-md object-cover md:h-54 lg:h-60"
                                    />
                                </Link>
                                <CardTitle>
                                    <Link href={'/laboratory/' + laboratory.slug}>
                                        <h3 className="truncate-2-lines">{laboratory.name}</h3>
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-0">
                                <CardDescription className="mb-4 space-y-2">
                                    <p className="truncate-2-lines">{laboratory.description}</p>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-light-base bg-amber-base flex items-center gap-1 rounded-md px-2 py-1" title="Ruangan">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                                fill="currentColor"
                                            >
                                                <path d="M342.6 9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L28.1 342.6C10.1 360.6 0 385 0 410.5L0 416c0 53 43 96 96 96l5.5 0c25.5 0 49.9-10.1 67.9-28.1L448 205.3l9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-32-32-96-96-32-32zM205.3 256L352 109.3 402.7 160l-96 96-101.5 0z" />
                                            </svg>
                                            <span className="small-font-size">{laboratory.room}</span>
                                        </div>
                                        <div className="text-light-base bg-purple-base flex items-center gap-1 rounded-md px-2 py-1" title="Kode">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 384 512"
                                                className="h-4 w-4 md:h-5 md:w-5"
                                                fill="currentColor"
                                            >
                                                <path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" />
                                            </svg>
                                            <span className="small-font-size">{laboratory.code}</span>
                                        </div>
                                    </div>
                                </CardDescription>
                                <Link
                                    href={'/laboratory/' + laboratory.slug}
                                    className="bg-blue-base text-light-base flex w-fit items-center gap-1 rounded-md px-3 py-2"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        className="h-4 w-4 md:h-5 md:w-5"
                                        fill="currentColor"
                                    >
                                        <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-128c0-17.7-14.3-32-32-32L352 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z" />
                                    </svg>
                                    <span className="small-font-size">Lihat Detail</span>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
