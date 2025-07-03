"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, Test, TestCart } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { Clock, Layers, MapPin, Ruler, Tag, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

export default function Detail({ test }: { test: Test }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pengujian",
            href: "/tests",
        },
        {
            title: test.name,
            href: "/tests/" + test.slug,
        },
    ]

    const [mainImage, setMainImage] = useState(test.images[0])
    const [testCart, setTestCart] = useState<TestCart[]>([])
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const savedTest = localStorage.getItem("tests")
        if (savedTest) {
            const parsedTest = JSON.parse(savedTest)
            setTestCart(parsedTest)
        }
    }, [])

    const handleAddTestToCart = (test: Test) => {
        setIsAdding(true)
        const existingTest: TestCart | undefined = testCart.find((item) => item.test_id === test.id)
        if (existingTest) {
            toast.error("Pengujian sudah ada di keranjang!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setIsAdding(false)
        } else {
            const newTestCart: TestCart = {
                test_id: test.id,
                slug: test.slug,
                unit: test.minimum_unit,
                test: test,
            }
            setTestCart([...testCart, newTestCart])
            toast.success("Pengujian berhasil ditambahkan ke keranjang!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            localStorage.setItem("tests", JSON.stringify([...testCart, newTestCart]))
            setIsAdding(false)
        }
    }

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={test.name} />

            <div className="min-h-screen bg-zinc-50 dark:bg-black py-6">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Image Gallery Section */}
                        <div className="lg:col-span-1">
                            <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-zinc-900">
                                <CardContent className="p-0">
                                    <div className="relative aspect-square w-full overflow-hidden">
                                        <img
                                            src={"/storage/" + mainImage}
                                            alt={test.name}
                                            className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
                                        />
                                        {test.is_active && (
                                            <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">Tersedia</Badge>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <Carousel className="w-full">
                                            <CarouselContent className="-ml-2 md:-ml-4">
                                                {test.images.map((image: string, index: number) => (
                                                    <CarouselItem className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4" key={index}>
                                                        <div
                                                            className={`cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-200 hover:border-blue-400 ${
                                                                mainImage === image
                                                                    ? "border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800"
                                                                    : "border-zinc-200 dark:border-zinc-600"
                                                            }`}
                                                            onClick={() => setMainImage(image)}
                                                        >
                                                            <img
                                                                src={"/storage/" + image}
                                                                alt={`${test.name} ${index + 1}`}
                                                                className="aspect-square h-full w-full object-cover hover:scale-105 transition-transform duration-200"
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="left-1 bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-600" />
                                            <CarouselNext className="right-1 bg-white dark:bg-zinc-700 border-zinc-200 dark:border-zinc-600 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-600" />
                                        </Carousel>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Test Details Section */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900 p-4 md:p-8">
                                <CardHeader className="p-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div className="flex-1">
                                            <CardTitle className="mb-2 font-bold text-zinc-900 dark:text-white">
                                                <h2 className="text-2xl md:text-3xl">{test.name}</h2>
                                            </CardTitle>
                                            <CardDescription className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                                                <Tag className="h-4 w-4" />
                                                <span>{test.category.name}</span>
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-green-500 text-white font-semibold text-lg px-4 py-2 border-0">
                                            {formatRupiah(test.price)}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-6 p-0 mt-6">
                                    <div>
                                        <h4 className="font-semibold text-zinc-900 dark:text-white mb-2">Deskripsi</h4>
                                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">{test.description}</p>
                                    </div>

                                    <Separator className="bg-zinc-200 dark:bg-zinc-700" />

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 dark:bg-blue-900 flex h-12 w-12 items-center justify-center rounded-full">
                                                <Layers className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Laboratorium</p>
                                                <Link
                                                    href={`/laboratory/${test.laboratory.slug}`}
                                                    className="font-medium text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                                                >
                                                    {test.laboratory.name}
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 dark:bg-purple-900 flex h-12 w-12 items-center justify-center rounded-full">
                                                <MapPin className="text-purple-600 dark:text-purple-400 h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Lokasi</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">{test.laboratory.room}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-amber-100 dark:bg-amber-900 flex h-12 w-12 items-center justify-center rounded-full">
                                                <Ruler className="text-amber-600 dark:text-amber-400 h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Minimum Pemesanan</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">{test.minimum_unit} Unit</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="bg-teal-100 dark:bg-teal-900 flex h-12 w-12 items-center justify-center rounded-full">
                                                <Clock className="text-teal-600 dark:text-teal-400 h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Slot Harian</p>
                                                <p className="font-medium text-zinc-900 dark:text-white">{test.daily_slot} Slot</p>
                                            </div>
                                        </div>
                                    </div>


                                </CardContent>

                                <CardFooter className="flex flex-col gap-4 p-0 mt-8 sm:flex-row">
                                    <Button
                                        disabled={isAdding}
                                        onClick={() => handleAddTestToCart(test)}
                                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold h-12 w-full rounded-lg px-6 py-3 text-center transition-colors duration-200 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        {isAdding ? "Menambahkan..." : "Pesan Sekarang"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>

                    {/* Lab Description Section */}
                    <div className="mt-8">
                        <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900 p-4 md:p-6">
                            <CardHeader className="p-0">
                                <CardTitle className="text-xl md:text-2xl text-zinc-900 dark:text-white">
                                    <h4>Tentang {test.laboratory.name}</h4>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 mt-6">
                                <div className="flex flex-col gap-6 lg:flex-row">
                                    <div className="w-full lg:w-1/3">
                                        <div className="overflow-hidden rounded-lg aspect-video lg:aspect-square">
                                            <img
                                                src={`/storage/${test.laboratory.images}`}
                                                alt={test.laboratory.name}
                                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300"
                                            >
                                                {test.laboratory.code}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300"
                                            >
                                                {test.laboratory.room}
                                            </Badge>
                                        </div>
                                        <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                                            {test.laboratory.description}
                                        </p>
                                        <div>
                                            <Button
                                                variant="link"
                                                asChild
                                                className="p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                            >
                                                <Link href={`/laboratory/${test.laboratory.slug}`}>Lihat Detail Laboratorium →</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Toast Container */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        className="mt-16"
                    />
                </div>
            </div>
        </AppLayout>
    )
}
