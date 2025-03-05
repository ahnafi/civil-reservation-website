import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem} from "@/types";
import { Head } from "@inertiajs/react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import {Separator} from "@/components/ui/separator";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Pengujian",
        href: "/tests",
    },
    {
        title: "Uji Bor Tangan", // Didapat dari Laravel
        href: "/tests/example",
    },
];

const dummyData: {
    title: string;
    description: string;
    image: string;
    unit: string;
    laboratory: string;
    minimumOrder: number;
    price: number;
    link: string;
    notes: string;
} = {
    title: "Uji Bor Tangan",
    description: "Uji bor tangan adalah uji yang dilakukan untuk mengetahui kekuatan tahanan bor tangan terhadap tertentu. Jika bor tangan tidak kuat, maka akan mudah patah.",
    image: "/img/tests/laboratory-1.jpg",
    unit: "Sampel",
    laboratory: "LMT",
    minimumOrder: 1,
    price: 500000,
    link: "tests/example",
    notes: "Minimal 5 sampel (belum termasuk biaya survei, transport, dan akomodasi lainnya.",
};

export default function Example() {
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

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4">
                    <div className="row-span-2 space-y-2">
                        <img src={dummyData.image} alt={dummyData.title} className="w-full max-h-96 object-cover rounded-lg" />
                        <Carousel>
                            <CarouselContent>
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4"><img src={dummyData.image} alt={dummyData.title} className="rounded-md"/></CarouselItem>
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4"><img src={dummyData.image} alt={dummyData.title} className="rounded-md"/></CarouselItem>
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4"><img src={dummyData.image} alt={dummyData.title} className="rounded-md"/></CarouselItem>
                                <CarouselItem className="basis-1/2 md:basis-1/3 lg:basis-1/4"><img src={dummyData.image} alt={dummyData.title} className="rounded-md"/></CarouselItem>
                            </CarouselContent>
                        </Carousel>
                    </div>

                    <div className="space-y-4">
                        <h1 className="font-black">{dummyData.title}</h1>
                        <Separator />
                        <div className="">
                            <p className="small-font-size font-semibold text-neutral-400">Deskripsi</p>
                            <p className="">{dummyData.description}</p>
                        </div>

                        <div className="">
                            <p className="small-font-size font-semibold text-neutral-400">Catatan <span className="text-red-base">*</span></p>
                            <p className="">{dummyData.notes}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="small-font-size font-semibold text-neutral-400">Satuan</p>
                                <p className="font-medium">{dummyData.unit}</p>
                            </div>

                            <div>
                                <p className="small-font-size font-semibold text-neutral-400">Laboratorium</p>
                                <p className="font-medium">{dummyData.laboratory}</p>
                            </div>

                            <div>
                                <p className="small-font-size font-semibold text-neutral-400">Minimum Pemesanan</p>
                                <p className="font-medium">{dummyData.minimumOrder}</p>
                            </div>

                            <div>
                                <p className="small-font-size font-semibold text-neutral-400">Harga</p>
                                <p className="font-medium">Rp {dummyData.price.toLocaleString()}/{dummyData.unit}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-black">Mulai Dari <span className="text-blue-base">{formatRupiah(dummyData.price)}</span></h2>
                            <p>Pembayaran fleksibel tersedia dengan E-money atau M-banking.</p>
                            <Button className="bg-blue-base hover:bg-blue-700 text-light-base transition-colors duration-300 ease-out hover:decoration-current! dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-light-base dark:hover:decoration-current! cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 576 512"
                                     className="h-8 w-8 md:h-12 md:w-12"
                                     fill="currentColor"
                                >
                                    <path
                                        d="M0 24C0 10.7 10.7 0 24 0L69.5 0c22 0 41.5 12.8 50.6 32l411 0c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3l-288.5 0 5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5L488 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-288.3 0c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5L24 48C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                                </svg>
                                <span className="normal-font-size font-semibold">Pesan Sekarang</span>
                            </Button>
                            <Separator />
                        </div>
                        <ul className="list-disc list-inside">
                            <li className="normal-font-size">Hasil uji akan dikirimkan melalui email.</li>
                            <li className="normal-font-size">Hasil uji akan dikirimkan dalam waktu 3-5 hari kerja.</li>
                            <li className="normal-font-size">Hasil uji dapat diunduh dalam bentuk PDF.</li>
                        </ul>
                    </div>
                </div>
        </AppLayout>
    );
}
