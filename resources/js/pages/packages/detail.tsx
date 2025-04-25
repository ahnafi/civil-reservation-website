import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Package as TestPackage } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';
import { useState } from 'react';

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
        description: 'Antar sampel air ke laboratorium atau gunakan layanan pengambilan sampel kami.',
    },
    {
        id: 3,
        title: 'Pengujian',
        description: 'Tim laboratorium kami akan melakukan semua pengujian yang termasuk dalam paket menggunakan peralatan kalibrasi terbaru.',
    },
    {
        id: 4,
        title: 'Analisis dan Pelaporan',
        description: 'Semua hasil akan dianalisis oleh tim ahli kami dan laporan komprehensif akan disiapkan.',
    },
    {
        id: 5,
        title: 'Hasil dan Konsultasi',
        description: 'Terima laporan hasil dan dapatkan konsultasi dengan ahli kami untuk interpretasi dan rekomendasi.',
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

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate savings from individual test prices
    const totalIndividualPrice = data.tests.reduce((total, test) => total + test.price, 0);
    const savings = totalIndividualPrice - data.price;
    const savingsPercentage = Math.round((savings / totalIndividualPrice) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={data.name} />

            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Package Header Section */}
                    <div className="lg:col-span-12">
                        <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:from-blue-950/30 dark:to-cyan-950/30">
                            <div className="flex flex-col items-start justify-between gap-4 md:flex-row sm:items-center">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{data.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                                <Building2 className="mr-1 h-3 w-3" /> {data.laboratory.code}
                                            </Badge>
                                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                                <MapPin className="mr-1 h-3 w-3" /> {data.laboratory.room}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <h3 className="text-primary font-bold">{formatRupiah(data.price)}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Image and Info */}
                    <div className="lg:col-span-4">
                        <div className="space-y-6">
                            <Card className="overflow-hidden p-0">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <img
                                            src={'/storage/package_image/' + mainImage}
                                            alt={data.name}
                                            className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <Carousel className="w-full">
                                            <CarouselContent>
                                                {data.images.map((image: string, index: number) => (
                                                    <CarouselItem className="basis-1/3" key={index}>
                                                        <div
                                                            className={`cursor-pointer overflow-hidden rounded-md border-2 ${
                                                                mainImage === image ? 'border-primary' : 'border-transparent'
                                                            }`}
                                                            onClick={() => setMainImage(image)}
                                                        >
                                                            <img
                                                                src={'/storage/package_image/' + image}
                                                                alt={`${data.name} ${index + 1}`}
                                                                className="aspect-square h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-1" />
                                            <CarouselNext className="right-1" />
                                        </Carousel>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="p-4">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-lg">Ringkasan Paket</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 p-0">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Jumlah Pengujian</span>
                                        <span className="font-medium">{data.tests.length} Pengujian</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harga Individual</span>
                                        <span className="font-medium line-through">{formatRupiah(totalIndividualPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harga Paket</span>
                                        <span className="text-primary font-medium">{formatRupiah(data.price)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Penghematan</span>
                                        <span className="font-medium text-green-600">{formatRupiah(savings)}</span>
                                    </div>
                                    <div>
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span>Anda hemat</span>
                                            <span>{savingsPercentage}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-0">
                                    <Button className="w-full" size="lg">
                                        Pesan Paket Ini
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    {/* Package Details and Tests */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <Tabs defaultValue="details" className="small-font-size w-full">
                                <TabsList className="small-font-size grid w-full grid-cols-3">
                                    <TabsTrigger className="text-xs md:text-sm" value="details">Deskripsi</TabsTrigger>
                                    <TabsTrigger className="text-xs md:text-sm" value="tests">Pengujian Termasuk</TabsTrigger>
                                    <TabsTrigger className="text-xs md:text-sm" value="how-it-works">Cara Kerja</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="mt-4">
                                    <Card className="p-4">
                                        <CardHeader className="p-0">
                                            <CardTitle className="large-font-size mb-1">Tentang Paket Ini</CardTitle>
                                            <CardDescription className="text-sm sm:text-base">
                                                Detail lengkap tentang paket pengujian kualitas air
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="small-font-size space-y-4 p-0">
                                            <div>
                                                <h3 className="large-font-size mb-1 font-semibold">Deskripsi</h3>
                                                <p className="text-muted-foreground">{data.description}</p>
                                            </div>
                                            <div>
                                                <h3 className="large-font-size mb-1 font-semibold">Manfaat Paket</h3>
                                                <ul className="space-y-2">
                                                    <li className="small-font-size flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Analisis komprehensif untuk memastikan kualitas air memenuhi standar</span>
                                                    </li>
                                                    <li className="small-font-size flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Lebih hemat dibandingkan pembelian terpisah</span>
                                                    </li>
                                                    <li className="small-font-size flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Laporan lengkap hasil pengujian dengan interpretasi</span>
                                                    </li>
                                                    <li className="small-font-size flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Ditangani oleh teknisi laboratorium berpengalaman</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="tests" className="mt-4">
                                    <Card className="p-4">
                                        <CardHeader className="p-0">
                                            <CardTitle className="large-font-size">Pengujian dalam Paket</CardTitle>
                                            <CardDescription className="small-font-size">
                                                Paket ini mencakup {data.tests.length} pengujian
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="space-y-6">
                                                {data.tests.map((test, index) => (
                                                    <div key={test.id} className="rounded-lg border p-2">
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-md">
                                                                    <BarChart3 className="text-primary h-8 w-8" />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-semibold">{test.name}</h4>
                                                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                                                        <Clock className="h-3 w-3" />
                                                                        <span>{test.daily_slot} slot/hari</span>
                                                                        <span className="text-xs">•</span>
                                                                        <span>Min. {test.minimum_unit} unit</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-right">
                                                                    <div className="text-muted-foreground text-sm">Harga Individual</div>
                                                                    <div className="font-medium">{formatRupiah(test.price)}</div>
                                                                </div>
                                                                <Button variant="outline" size="sm" asChild>
                                                                    <Link href={`/tests/${test.slug}`}>Detail</Link>
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="how-it-works" className="mt-4">
                                    <Card className="p-4">
                                        <CardHeader className="p-0">
                                            <CardTitle className="large-font-size">Cara Kerja</CardTitle>
                                            <CardDescription className="small-font-size">Proses pemesanan dan pelaksanaan pengujian</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="space-y-4">
                                                {howItWorks.map((step) => (
                                                    <div className="flex gap-4">
                                                        <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                            {step.id}
                                                        </div>
                                                        <div>
                                                            <p className="text-base md:text-lg font-medium">{step.title}</p>
                                                            <p className="text-muted-foreground small-font-size">{step.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <Card className="p-4">
                                <CardHeader className="p-0">
                                    <CardTitle className="large-font-size">Pertanyaan Umum</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-medium">Berapa lama waktu yang dibutuhkan untuk mendapatkan hasil?</h4>
                                            <p className="text-muted-foreground small-font-size">
                                                Waktu pengujian biasanya membutuhkan 3-5 hari kerja tergantung pada kompleksitas pengujian dan jumlah
                                                sampel.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium">Apakah saya perlu menyiapkan sampel dengan cara tertentu?</h4>
                                            <p className="text-muted-foreground small-font-size">
                                                Ya, sampel air harus dikumpulkan menggunakan wadah steril yang kami sediakan atau mengikuti petunjuk
                                                pengambilan sampel.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium">Apakah ada layanan pengambilan sampel?</h4>
                                            <p className="text-muted-foreground small-font-size">
                                                Ya, kami menyediakan layanan pengambilan sampel dengan biaya tambahan tergantung lokasi.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h4 className="font-medium">Apakah laporan hasil bisa digunakan untuk keperluan legal?</h4>
                                            <p className="text-muted-foreground small-font-size">
                                                Ya, semua hasil pengujian disertifikasi dan dapat digunakan untuk keperluan regulasi dan legal.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
