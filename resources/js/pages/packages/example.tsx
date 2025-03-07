import {useState} from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem} from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import {Separator} from "@/components/ui/separator";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Paket",
        href: "/packages",
    },
    {
        title: "Uji Material Kerikil Lengkap", // Didapat dari Laravel
        href: "/tests/example",
    },
];

const dummyData: {
    title: string;
    description: string;
    image: string[];
    price: number;
    link: string;
    testPackages: {
        title: string;
        price: number;
    }[];
    notes?: string;
} =
{
    title: 'Uji Material Kerikil Lengkap',
    description: 'Uji material kerikil lengkap untuk mengetahui kualitas kerikil.',
    image: ["/img/tests/laboratory-1.jpg", "/img/tests/laboratory-1.jpg", "/img/tests/laboratory-1.jpg", "/img/tests/laboratory-1.jpg"],
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
    notes: 'Untuk kebutuhan dasar sebelum produksi atau riset awal.',
};

export default function Package() {
    const [mainImage, setMainImage] = useState(dummyData.image[0]);

    const formatRupiah = (value:number, currency = "IDR") => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={dummyData.title} />

            <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 xl:grid-cols-3">
                <div className="row-span-2 space-y-2">
                    <img src={mainImage} alt={dummyData.title} className="max-h-96 w-full rounded-lg object-cover" />
                    <Carousel>
                        <CarouselContent>
                            {dummyData.image.map((image, index) => (
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4" key={index}>
                                    <img src={image} alt={dummyData.title} className="rounded-md" onClick={() => setMainImage(image)}/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>

                <div className="space-y-4">
                    <h1 className="font-black">{dummyData.title}</h1>
                    <Separator />
                    <div>
                        <p className="font-semibold text-neutral-400">Deskripsi</p>
                        <p>{dummyData.description}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-neutral-400">
                            Catatan <span className="text-red-base">*</span>
                        </p>
                        <p>{dummyData.notes}</p>
                    </div>

                    <div>
                        <p className="font-semibold text-neutral-400">Pengujian yang Didapat</p>
                        <ul className="list-inside list-disc">
                            {dummyData.testPackages.map((testPackage, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        fill="currentColor"
                                        className="text-light-base bg-blue-base inline-block h-4 w-4 rounded-full p-1 md:h-5 md:w-5"
                                    >
                                        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                                    </svg>
                                    <div className="flex w-full justify-between">
                                        <Link href="/tests/example" className="hover:underline">{testPackage.title}</Link>
                                        <p className="font-medium">{formatRupiah(testPackage.price)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-black">
                            Mulai Dari <span className="text-blue-base">{formatRupiah(dummyData.price)}</span>
                        </h2>
                        <p>Pembayaran fleksibel tersedia dengan E-money atau M-banking.</p>
                        <Button className="bg-blue-base text-light-base dark:text-light-base cursor-pointer transition-colors duration-300 ease-out hover:bg-blue-700 hover:decoration-current! dark:bg-blue-500 dark:hover:bg-blue-600 dark:hover:decoration-current!">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="h-8 w-8 md:h-12 md:w-12" fill="currentColor">
                                <path d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                            </svg>
                            <span className="normal-font-size font-semibold">Pesan Sekarang</span>
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
