import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Test } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Detail({ test }: { test: Test }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengujian',
            href: '/tests',
        },
        {
            title: test.name,
            href: '/tests/' + test.slug,
        },
    ];

    const [mainImage, setMainImage] = useState(test.images[0]);

    const formatRupiah = (value: number, currency = 'IDR') => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    console.log(test);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={test.name} />

            <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="row-span-2 space-y-2">
                    <img
                        src={'/storage/' + mainImage}
                        alt={test.name}
                        className="max-h-96 w-full rounded-lg object-cover transition-all duration-300"
                    />
                    <Carousel>
                        <CarouselContent>
                            {test.images.map((image: string, index: number) => (
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4" key={index}>
                                    <img src={'/storage/' + image} alt={test.name} className="rounded-md" onClick={() => setMainImage(image)} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="space-y-4">
                    <h1 className="font-black">{test.name}</h1>
                    <Separator />
                    <div className="">
                        <p className="text-neutral-400">Deskripsi</p>
                        <p className="">{test.description}</p>
                    </div>

                    {/*<div className="">*/}
                    {/*    <p className="text-neutral-400">*/}
                    {/*        Catatan <span className="text-red-base">*</span>*/}
                    {/*    </p>*/}
                    {/*    <p className="">{test.name}</p>*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-neutral-400">Satuan</p>
                            <Link href="#" className="font-medium hover:underline">
                                {test.category.name}
                            </Link>
                        </div>

                        <div>
                            <p className="text-neutral-400">Laboratorium</p>
                            <Link href="#" className="font-medium hover:underline">
                                {test.laboratory.name}
                            </Link>
                        </div>

                        <div>
                            <p className="text-neutral-400">Minimum Pemesanan</p>
                            <Link href="#" className="font-medium hover:underline">
                                {test.minimum_unit}
                            </Link>
                        </div>

                        <div>
                            <p className="text-neutral-400">Harga</p>
                            <Link href="#" className="font-medium hover:underline">
                                Rp {test.price.toLocaleString()}/{test.minimum_unit}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-black">
                            Mulai Dari <span className="text-blue-base">{formatRupiah(test.price)}</span>
                        </h2>
                        <p>Pembayaran fleksibel tersedia dengan E-money atau M-banking.</p>
                        <Button className="bg-blue-base text-light-base dark:text-light-base flex cursor-pointer items-center justify-center px-24 py-6 transition-colors duration-300 ease-out hover:bg-blue-700 hover:decoration-current! dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:decoration-current!">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-8 w-8 md:h-12 md:w-12" fill="currentColor">
                                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                            <span className="big-font-size font-semibold">Pesan Sekarang</span>
                        </Button>
                        <Separator />
                    </div>
                    <ul className="list-inside list-disc">
                        <li className="normal-font-size">Hasil uji akan dikirimkan melalui email.</li>
                        <li className="normal-font-size">Hasil uji akan dikirimkan dalam waktu 3-5 hari kerja.</li>
                        <li className="normal-font-size">Hasil uji dapat diunduh dalam bentuk PDF.</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
