"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, Package, PackageCart, PaginatedPackage, Test } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Paket",
        href: "/packages",
    },
]

export default function Packages({ paginated }: { paginated: PaginatedPackage }) {
    const [packageCart, setPackageCart] = useState<PackageCart[]>([])
    const [isAdding, setIsAdding] = useState(false)

    useEffect(() => {
        const savedPackage = localStorage.getItem("packages")
        if (savedPackage) {
            const parsedPackage = JSON.parse(savedPackage)
            setPackageCart(parsedPackage)
        }
    }, [])

    const handleAddTestToCart = (selectedPackage: Package) => {
        setIsAdding(true)
        const existingTest: PackageCart | undefined = packageCart.find((item) => item.package_id === selectedPackage.id)
        if (existingTest) {
            toast.error("Paket sudah ada di keranjang!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setIsAdding(false)
        } else {
            const newTestCart: PackageCart = {
                package_id: selectedPackage.id,
                slug: selectedPackage.slug,
                package: selectedPackage,
                quantity: 1,
            }
            setPackageCart([...packageCart, newTestCart])
            toast.success("Paket berhasil ditambahkan ke keranjang!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            localStorage.setItem("packages", JSON.stringify([...packageCart, newTestCart]))
            setIsAdding(false)
        }
    }

    const formatRupiah = (value: number, currency = "IDR") => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengujian" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-zinc-50 dark:bg-black">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">Katalog Paket Pengujian</h1>
                    <p className="text-zinc-600 dark:text-zinc-300">Pilih paket yang sesuai dengan kebutuhan Anda</p>
                </div>

                <div className="grid auto-rows-min grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                    {paginated.data.map((data: Package) => (
                        <div key={data.id} className="relative">
                            <Link href={"/package/" + data.slug} className="block">
                                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white dark:bg-zinc-900 h-full">
                                    <CardHeader className="flex flex-col items-center p-6 bg-white dark:bg-zinc-900">
                                        {/* Package image */}
                                        <div className="w-full mb-4 block">
                                            {data.images && data.images[0] ? (
                                                <img
                                                    src={"/storage/" + data.images[0]}
                                                    alt={data.name}
                                                    className="h-48 w-full md:h-56 rounded-lg object-cover border-2 border-zinc-200 dark:border-zinc-700"
                                                />
                                            ) : (
                                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white flex h-48 w-full md:h-56 items-center justify-center rounded-lg font-bold text-4xl md:text-5xl">
                                                    {data.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <div className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                            <CardTitle>
                                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white text-center">{data.name}</h2>
                                            </CardTitle>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mt-2 text-center">
                                                {data.description}
                                            </p>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 p-6 pt-0 bg-white dark:bg-zinc-900">
                                        {/* Price */}
                                        <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
                                            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                                                {formatRupiah(data.price)}
                                            </h3>
                                        </div>

                                        {/* Tests list */}
                                        {data.tests && data.tests.length > 0 && (
                                            <div>
                                                <h4 className="font-semibold text-zinc-900 dark:text-white mb-3 text-sm">Tes yang Termasuk:</h4>
                                                <ul className="space-y-2 max-h-40 overflow-y-auto">
                                                    {data.tests.map((test: Test) => (
                                                        <li
                                                            key={test.id}
                                                            className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg"
                                                        >
                                                            <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <div className="flex w-full justify-between items-center">
                                                                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{test.name}</p>
                                                                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                                    {formatRupiah(test.price)}
                                                                </p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Add to cart button - positioned to prevent link click */}
                                        <div className="relative z-10">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleAddTestToCart(data)
                                                }}
                                                disabled={isAdding}
                                                className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <ShoppingCart className="h-5 w-5" />
                                                {isAdding ? "Menambahkan..." : "Tambah ke Keranjang"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
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
        </AppLayout>
    )
}
