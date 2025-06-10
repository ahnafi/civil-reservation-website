import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Test, TestCart } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Clock, Layers, MapPin, Ruler, Tag } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    const [testCart, setTestCart] = useState<TestCart[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const savedTest = localStorage.getItem('tests');
        if (savedTest) {
            const parsedTest = JSON.parse(savedTest);
            setTestCart(parsedTest);
        }
    }, []);

    const handleAddTestToCart = (test: Test) => {
        setIsAdding(true);
        const existingTest: TestCart | undefined = testCart.find((item) => item.test_id === test.id);
        if (existingTest) {
            alert('Test already exists in the cart');
            setIsAdding(false);
        } else {
            const newTestCart: TestCart = {
                test_id: test.id,
                slug: test.slug,
                unit: test.minimum_unit,
                test: test,
            };
            setTestCart([...testCart, newTestCart]);
            alert('Test added to cart');
            localStorage.setItem('tests', JSON.stringify([...testCart, newTestCart]));
            setIsAdding(false);
        }
    };

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={test.name} />

            <div className="container mx-auto py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Image Gallery Section */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden py-0">
                            <CardContent className="p-0">
                                <div className="relative aspect-square w-full overflow-hidden">
                                    <img
                                        src={'/storage/test_image/' + mainImage}
                                        alt={test.name}
                                        className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                                    />
                                    {test.is_active && <Badge className="dark:text-light-base absolute top-3 right-3 bg-green-500">Tersedia</Badge>}
                                </div>

                                <div className="p-4">
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {test.images.map((image: string, index: number) => (
                                                <CarouselItem className="basis-1/3 md:basis-1/4" key={index}>
                                                    <div
                                                        className={`cursor-pointer overflow-hidden rounded-md border-2 ${
                                                            mainImage === image ? 'border-primary' : 'border-transparent'
                                                        }`}
                                                        onClick={() => setMainImage(image)}
                                                    >
                                                        <img
                                                            src={'/storage/test_image/' + image}
                                                            alt={`${test.name} ${index + 1}`}
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
                    </div>

                    {/* Test Details Section */}
                    <div className="lg:col-span-2">
                        <Card className="p-4 md:p-8">
                            <CardHeader className="p-0">
                                <div className="flex justify-between">
                                    <div>
                                        <CardTitle className="mb-2 font-bold">
                                            <h2>{test.name}</h2>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            <span>{test.category.name}</span>
                                        </CardDescription>
                                    </div>
                                    <Badge className="bg-green-base dark:text-light-base font-semibol h-fit">
                                        <p>{formatRupiah(test.price)}</p>
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4 p-0">
                                <div>
                                    <h4 className="font-semibold">Deskripsi</h4>
                                    <p className="text-muted-foreground">{test.description}</p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <Layers className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Laboratorium</p>
                                            <Link href={`/laboratory/${test.laboratory.slug}`} className="font-medium hover:underline">
                                                {test.laboratory.name}
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <MapPin className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Lokasi</p>
                                            <p className="font-medium">{test.laboratory.room}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <Ruler className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Minimum Pemesanan</p>
                                            <p className="font-medium">{test.minimum_unit} Unit</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                            <Clock className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-sm">Slot Harian</p>
                                            <p className="font-medium">{test.daily_slot} Slot</p>
                                        </div>
                                    </div>
                                </div>

                                {test.packages && test.packages.length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="mb-2 font-semibold">Tersedia dalam Paket</h4>
                                            <div className="space-y-4">
                                                {test.packages.map((pkg) => (
                                                    <Card key={pkg.id} className="bg-secondary/30 py-0">
                                                        <CardContent className="p-2">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-16 w-16 overflow-hidden rounded-md">
                                                                    <img
                                                                        src={`/storage/test_image/${pkg.images[0]}`}
                                                                        alt={pkg.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="small-font-size flex-1">
                                                                    <Link href={`/package/${pkg.slug}`} className="font-medium hover:underline">
                                                                        {pkg.name}
                                                                    </Link>
                                                                    <p className="text-muted-foreground">{formatRupiah(pkg.price)}</p>
                                                                </div>
                                                                <Button variant="secondary" size="sm" asChild>
                                                                    <Link href={`/package/${pkg.slug}`} className="small-font-size">
                                                                        Detail
                                                                    </Link>
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col gap-4 p-0 sm:flex-row">
                                <Button
                                    variant="outline"
                                    disabled={isAdding}
                                    onClick={() => handleAddTestToCart(test)}
                                    className="bg-blue-base text-light-base normal-font-size h-full w-full rounded-md px-4 py-2 text-center font-semibold hover:bg-blue-600/90 md:py-4"
                                >
                                    Pesan Sekarang
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

                {/* Lab Description Section */}
                <div className="mt-8">
                    <Card className="p-4">
                        <CardHeader className="p-0">
                            <CardTitle className="text-xl">
                                <h4>Tentang {test.laboratory.name}</h4>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col gap-6 md:flex-row">
                                <div className="w-full md:w-1/4">
                                    <div className="overflow-hidden rounded-lg">
                                        <img
                                            src={`/storage/${test.laboratory.image}`}
                                            alt={test.laboratory.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Badge variant="outline">{test.laboratory.code}</Badge>
                                        <Badge variant="outline">{test.laboratory.room}</Badge>
                                    </div>
                                    <p className="text-muted-foreground">{test.laboratory.description}</p>
                                    <div className="mt-4">
                                        <Button variant="link" asChild className="p-0">
                                            <Link href={`/laboratories/${test.laboratory.slug}`}>Lihat Detail Laboratorium</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
