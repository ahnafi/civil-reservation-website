import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Package as TestPackage } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BarChart3, Building2, CheckCircle2, Clock, Droplets, MapPin, Package } from 'lucide-react';
import { useState } from 'react';

export default function PackageDetail({ testPackage }: { testPackage: TestPackage }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Paket Pengujian',
            href: '/packages',
        },
        {
            title: testPackage.name,
            href: '/packages/' + testPackage.slug,
        },
    ];

    const [mainImage, setMainImage] = useState(testPackage.images[0]);

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Calculate savings from individual test prices
    const totalIndividualPrice = testPackage.tests.reduce((total, test) => total + test.price, 0);
    const savings = totalIndividualPrice - testPackage.price;
    const savingsPercentage = Math.round((savings / totalIndividualPrice) * 100);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={testPackage.name} />

            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Package Header Section */}
                    <div className="lg:col-span-12">
                        <div className="flex flex-col gap-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 p-6 dark:from-blue-950/30 dark:to-cyan-950/30">
                            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold">{testPackage.name}</h1>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                                <Building2 className="mr-1 h-3 w-3" /> {testPackage.laboratory.code}
                                            </Badge>
                                            <Badge variant="outline" className="border-blue-200 dark:border-blue-800">
                                                <MapPin className="mr-1 h-3 w-3" /> {testPackage.laboratory.room}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="text-muted-foreground text-sm">
                                        <span className="line-through">{formatRupiah(totalIndividualPrice)}</span>
                                    </div>
                                    <div className="text-primary text-2xl font-bold">{formatRupiah(testPackage.price)}</div>
                                    <Badge className="bg-green-500">Hemat {savingsPercentage}%</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Package Image and Info */}
                    <div className="lg:col-span-4">
                        <div className="space-y-6">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="relative aspect-video w-full overflow-hidden">
                                        <img
                                            src={'/storage/test_image/' + mainImage}
                                            alt={testPackage.name}
                                            className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                                        />
                                    </div>

                                    <div className="p-4">
                                        <Carousel className="w-full">
                                            <CarouselContent>
                                                {testPackage.images.map((image: string, index: number) => (
                                                    <CarouselItem className="basis-1/3" key={index}>
                                                        <div
                                                            className={`cursor-pointer overflow-hidden rounded-md border-2 ${
                                                                mainImage === image ? 'border-primary' : 'border-transparent'
                                                            }`}
                                                            onClick={() => setMainImage(image)}
                                                        >
                                                            <img
                                                                src={'/storage/test_image/' + image}
                                                                alt={`${testPackage.name} ${index + 1}`}
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

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Ringkasan Paket</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Jumlah Pengujian</span>
                                        <span className="font-medium">{testPackage.tests.length} Pengujian</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harga Individual</span>
                                        <span className="font-medium line-through">{formatRupiah(totalIndividualPrice)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Harga Paket</span>
                                        <span className="text-primary font-medium">{formatRupiah(testPackage.price)}</span>
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
                                        <Progress value={savingsPercentage} className="h-2" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" size="lg">
                                        Pesan Paket Ini
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Droplets className="h-5 w-5 text-blue-500" />
                                        Tentang Lab {testPackage.laboratory.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="overflow-hidden rounded-md">
                                        <img
                                            src={`/storage/${testPackage.laboratory.image}`}
                                            alt={testPackage.laboratory.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <p className="text-muted-foreground text-sm">{testPackage.laboratory.description}</p>
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href={`/laboratories/${testPackage.laboratory.slug}`}>Lihat Detail Laboratorium</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Package Details and Tests */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            <Tabs defaultValue="details" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="details">Deskripsi</TabsTrigger>
                                    <TabsTrigger value="tests">Pengujian Termasuk</TabsTrigger>
                                    <TabsTrigger value="how-it-works">Cara Kerja</TabsTrigger>
                                </TabsList>

                                <TabsContent value="details" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tentang Paket Ini</CardTitle>
                                            <CardDescription>Detail lengkap tentang paket pengujian kualitas air</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <h3 className="mb-2 text-lg font-semibold">Deskripsi</h3>
                                                <p className="text-muted-foreground">{testPackage.description}</p>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h3 className="mb-2 text-lg font-semibold">Manfaat Paket</h3>
                                                <ul className="space-y-2">
                                                    <li className="flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Analisis komprehensif untuk memastikan kualitas air memenuhi standar</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Lebih hemat dibandingkan pembelian terpisah</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Laporan lengkap hasil pengujian dengan interpretasi</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                        <span>Ditangani oleh teknisi laboratorium berpengalaman</span>
                                                    </li>
                                                </ul>
                                            </div>

                                            <Separator />

                                            <div>
                                                <h3 className="mb-2 text-lg font-semibold">Siapa yang Membutuhkan</h3>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                    <Card className="bg-secondary/30">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-medium">Peneliti</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Mendukung penelitian ilmiah tentang kualitas air
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-secondary/30">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-medium">Industri</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Memastikan kepatuhan terhadap regulasi lingkungan
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-secondary/30">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-medium">Pengelola Air</h4>
                                                            <p className="text-muted-foreground text-sm">
                                                                Mengontrol kualitas air untuk konsumsi umum
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-secondary/30">
                                                        <CardContent className="p-4">
                                                            <h4 className="font-medium">Mahasiswa</h4>
                                                            <p className="text-muted-foreground text-sm">Mendukung penelitian dan tugas akhir</p>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="tests" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pengujian dalam Paket</CardTitle>
                                            <CardDescription>Paket ini mencakup {testPackage.tests.length} pengujian</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-6">
                                                {testPackage.tests.map((test, index) => (
                                                    <div key={test.id} className="rounded-lg border p-4">
                                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                            <div className="flex items-center gap-4">
                                                                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-md">
                                                                    <BarChart3 className="text-primary h-8 w-8" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold">{test.name}</h3>
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

                                                        {index < testPackage.tests.length - 1 && <Separator className="my-4" />}

                                                        <div className="mt-4">
                                                            <p className="text-muted-foreground text-sm">{test.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="how-it-works" className="mt-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Cara Kerja</CardTitle>
                                            <CardDescription>Proses pemesanan dan pelaksanaan pengujian</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-8">
                                                <div className="flex gap-4">
                                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                        1
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium">Pemesanan</h3>
                                                        <p className="text-muted-foreground">
                                                            Pesan paket pengujian melalui sistem dan lakukan pembayaran untuk mengamankan slot
                                                            pengujian.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                        2
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium">Penyerahan Sampel</h3>
                                                        <p className="text-muted-foreground">
                                                            Antar sampel air ke laboratorium atau gunakan layanan pengambilan sampel kami.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                        3
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium">Pengujian</h3>
                                                        <p className="text-muted-foreground">
                                                            Tim laboratorium kami akan melakukan semua pengujian yang termasuk dalam paket menggunakan
                                                            peralatan kalibrasi terbaru.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                        4
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium">Analisis dan Pelaporan</h3>
                                                        <p className="text-muted-foreground">
                                                            Semua hasil akan dianalisis oleh tim ahli kami dan laporan komprehensif akan disiapkan.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4">
                                                    <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                                        5
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium">Hasil dan Konsultasi</h3>
                                                        <p className="text-muted-foreground">
                                                            Terima laporan hasil dan dapatkan konsultasi dengan ahli kami untuk interpretasi dan
                                                            rekomendasi.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Pertanyaan Umum</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium">Berapa lama waktu yang dibutuhkan untuk mendapatkan hasil?</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Waktu pengujian biasanya membutuhkan 3-5 hari kerja tergantung pada kompleksitas pengujian dan jumlah
                                                sampel.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium">Apakah saya perlu menyiapkan sampel dengan cara tertentu?</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Ya, sampel air harus dikumpulkan menggunakan wadah steril yang kami sediakan atau mengikuti petunjuk
                                                pengambilan sampel.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium">Apakah ada layanan pengambilan sampel?</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Ya, kami menyediakan layanan pengambilan sampel dengan biaya tambahan tergantung lokasi.
                                            </p>
                                        </div>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium">Apakah laporan hasil bisa digunakan untuk keperluan legal?</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Ya, semua hasil pengujian disertifikasi dan dapat digunakan untuk keperluan regulasi dan legal.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="lg:col-span-12">
                        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
                            <CardContent className="flex flex-col items-center justify-between gap-4 p-6 text-center sm:flex-row sm:text-left">
                                <div>
                                    <h3 className="text-xl font-bold">Butuh pengujian kualitas air yang komprehensif?</h3>
                                    <p className="text-muted-foreground">Dapatkan paket lengkap dengan harga terbaik dan layanan profesional.</p>
                                </div>
                                <div className="flex gap-4">
                                    <Button size="lg" className="px-8">
                                        Pesan Sekarang
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        Konsultasi
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
