"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/layouts/app-layout"
import { router } from "@inertiajs/react"
import type { BreadcrumbItem, PackageCart, TestCart } from "@/types"
import { Head, Link } from "@inertiajs/react"
import {
    AlertCircle,
    Beaker,
    Building2,
    CheckCircle2,
    ClipboardList,
    CreditCard, HardHat,
    Minus,
    PackageIcon,
    Plus,
    ShoppingCart,
    Trash2
} from 'lucide-react';
import { useEffect, useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Pesanan",
        href: "/orders",
    },
    {
        title: "Keranjang",
        href: "/orders/cart",
    },
]

export default function Cart() {
    const [testsCart, setTestsCart] = useState<TestCart[]>([])
    const [packagesCart, setPackagesCart] = useState<PackageCart[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const handleContinueToForm = () => {
        const testIds = testsCart.map((test) => test.test_id)
        const packageIds = packagesCart.map((pkg) => pkg.package_id)

        router.get("/orders/form", {
            testIds,
            packageIds,
        })
    }

    useEffect(() => {
        try {
            const savedTests = localStorage.getItem("tests") || "[]"
            const savedPackages = localStorage.getItem("packages") || "[]"

            setTestsCart(JSON.parse(savedTests))
            setPackagesCart(JSON.parse(savedPackages))
        } catch (err) {
            setError("Error loading cart data")
            console.error(err)
            console.error("Error loading cart data:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const updateTestQuantity = (testId: number, newQuantity: number) => {
        const updatedTests = testsCart.map((item: TestCart) => {
            if (item.test_id === testId) {
                const minUnit = item.test.minimum_unit || 1
                const quantity = Math.max(minUnit, newQuantity)
                return { ...item, unit: quantity }
            }
            return item
        })

        setTestsCart(updatedTests)
        localStorage.setItem("tests", JSON.stringify(updatedTests))
    }

    const updatePackageQuantity = (packageId: number, newQuantity: number) => {
        const updatedPackages = packagesCart.map((item) => {
            if (item.package_id === packageId) {
                return { ...item, quantity: Math.max(1, newQuantity) }
            }
            return item
        })

        setPackagesCart(updatedPackages)
        localStorage.setItem("packages", JSON.stringify(updatedPackages))
    }

    const removeTest = (testId: number) => {
        const updatedTests = testsCart.filter((item: TestCart) => item.test_id !== testId)
        setTestsCart(updatedTests)
        localStorage.setItem("tests", JSON.stringify(updatedTests))
    }

    const removePackage = (packageId: number) => {
        const updatedPackages = packagesCart.filter((item: PackageCart) => item.package_id !== packageId)
        setPackagesCart(updatedPackages)
        localStorage.setItem("packages", JSON.stringify(updatedPackages))
    }

    const calculateSubtotal = () => {
        let subtotal = 0

        testsCart.forEach((item: TestCart) => {
            subtotal += item.test.price * item.unit
        })

        packagesCart.forEach((item: PackageCart) => {
            subtotal += item.package.price * (item.quantity || 1)
        })

        return subtotal
    }

    const subtotal = calculateSubtotal()

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Keranjang" />
                <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
                    <div className="border-blue-600 h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
                </div>
            </AppLayout>
        )
    }

    const isEmpty = testsCart.length === 0 && packagesCart.length === 0

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keranjang" />

            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8">
                    {isEmpty ? (
                        <EmptyCart />
                    ) : (
                        <div className="mx-auto max-w-7xl">
                            {/* Progress Steps */}
                            <div className="mb-12">
                                <div className="relative">
                                    <div className="absolute top-6 left-0 h-0.5 w-full bg-zinc-200 dark:bg-zinc-700"></div>
                                    <div className="relative mx-auto flex max-w-2xl justify-between">
                                        <div className="group flex flex-col items-center">
                                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                            <span className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">Keranjang</span>
                                            <Badge className="mt-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0">
                                                Sedang Aktif
                                            </Badge>
                                        </div>
                                        <div className="group flex flex-col items-center">
                                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500">
                                                <ClipboardList className="h-6 w-6" />
                                            </div>
                                            <span className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        Formulir Pesanan
                      </span>
                                            <Badge
                                                variant="outline"
                                                className="mt-1 text-xs border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                            >
                                                Menunggu
                                            </Badge>
                                        </div>
                                        <div className="group flex flex-col items-center">
                                            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <span className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Checkout</span>
                                            <Badge
                                                variant="outline"
                                                className="mt-1 text-xs border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                            >
                                                Menunggu
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                {/* Cart Items */}
                                <div className="space-y-6 lg:col-span-2">
                                    <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-lg border-0">
                                        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-white">Item Keranjang</h2>

                                        {/* Tests Section */}
                                        {testsCart.length > 0 && (
                                            <div className="mb-8">
                                                <div className="mb-4 flex items-center gap-2">
                                                    <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                                        <HardHat className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <h3 className="font-semibold text-zinc-900 dark:text-white">Pengujian Individual</h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                    >
                                                        {testsCart.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-4">
                                                    {testsCart.map((testItem: TestCart, index) => (
                                                        <div
                                                            key={`test-${index}`}
                                                            className="rounded-lg border-0 bg-zinc-50 dark:bg-zinc-800 p-4 shadow-sm transition-shadow hover:shadow-md"
                                                        >
                                                            <div className="flex gap-4">
                                                                <div className="h-20 w-20 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
                                                                    <img
                                                                        src={`/storage/${testItem.test.images[0]}`}
                                                                        alt={testItem.test.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between">
                                                                        <div>
                                                                            <h4 className="font-semibold text-zinc-900 dark:text-white">
                                                                                {testItem.test.name}
                                                                            </h4>
                                                                            <div className="mt-1 flex flex-wrap gap-1">
                                                                                {testItem.test.laboratory && (
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="text-xs border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                                                                    >
                                                                                        <Building2 className="mr-1 h-3 w-3" />
                                                                                        {testItem.test.laboratory.name}
                                                                                    </Badge>
                                                                                )}
                                                                                {testItem.test.category && (
                                                                                    <Badge
                                                                                        variant="outline"
                                                                                        className="text-xs border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                                                                    >
                                                                                        {testItem.test.category.name}
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="font-semibold text-zinc-900 dark:text-white">
                                                                                {formatRupiah(testItem.test.price * testItem.unit)}
                                                                            </div>
                                                                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                {formatRupiah(testItem.test.price)} / unit
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
                                                                                onClick={() => updateTestQuantity(testItem.test_id, testItem.unit - 1)}
                                                                                disabled={testItem.unit <= testItem.test.minimum_unit}
                                                                            >
                                                                                <Minus className="h-3 w-3" />
                                                                            </Button>
                                                                            <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-white">
                                        {testItem.unit}
                                      </span>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
                                                                                onClick={() => updateTestQuantity(testItem.test_id, testItem.unit + 1)}
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </Button>
                                                                            <span className="ml-2 text-xs text-zinc-500 dark:text-zinc-400">
                                        Min: {testItem.test.minimum_unit}
                                      </span>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                                                                            onClick={() => removeTest(testItem.test_id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Packages Section */}
                                        {packagesCart.length > 0 && (
                                            <div>
                                                <div className="mb-4 flex items-center gap-2">
                                                    <div className="bg-green-100 dark:bg-green-900 p-1.5 rounded-full">
                                                        <PackageIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <h3 className="font-semibold text-zinc-900 dark:text-white">Paket Pengujian</h3>
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    >
                                                        {packagesCart.length}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-4">
                                                    {packagesCart.map((packageItem: PackageCart, index) => (
                                                        <div
                                                            key={`package-${index}`}
                                                            className="rounded-lg border-0 bg-zinc-50 dark:bg-zinc-800 p-4 shadow-sm transition-shadow hover:shadow-md"
                                                        >
                                                            <div className="flex gap-4">
                                                                <div className="h-20 w-20 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-700">
                                                                    <img
                                                                        src={`/storage/${
                                                                            packageItem.package.images ? packageItem.package.images[0] : "default.jpg"
                                                                        }`}
                                                                        alt={packageItem.package.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-start justify-between">
                                                                        <div>
                                                                            <h4 className="font-semibold text-zinc-900 dark:text-white">
                                                                                {packageItem.package.name}
                                                                            </h4>
                                                                            {packageItem.package.laboratory && (
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="mt-1 text-xs border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400"
                                                                                >
                                                                                    <Building2 className="mr-1 h-3 w-3" />
                                                                                    {packageItem.package.laboratory.name}
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <div className="font-semibold text-zinc-900 dark:text-white">
                                                                                {formatRupiah(packageItem.package.price * (packageItem.quantity || 1))}
                                                                            </div>
                                                                            {packageItem.quantity > 1 && (
                                                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                    {formatRupiah(packageItem.package.price)} / paket
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    {packageItem.package.tests && packageItem.package.tests.length > 0 && (
                                                                        <div className="mt-2 rounded-md bg-zinc-100 dark:bg-zinc-700 p-2">
                                                                            <div className="text-base font-medium text-zinc-700 dark:text-zinc-200">
                                                                                Termasuk:
                                                                            </div>
                                                                            <ScrollArea className="mt-1 h-16">
                                                                                <div className="space-y-1">
                                                                                    {packageItem.package.tests.map((test, testIndex) => (
                                                                                        <div key={testIndex} className="text-sm text-zinc-600 dark:text-zinc-200">
                                                                                            • {test.name}
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </ScrollArea>
                                                                        </div>
                                                                    )}

                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
                                                                                onClick={() =>
                                                                                    updatePackageQuantity(packageItem.package_id, (packageItem.quantity || 1) - 1)
                                                                                }
                                                                                disabled={(packageItem.quantity || 1) <= 1}
                                                                            >
                                                                                <Minus className="h-3 w-3" />
                                                                            </Button>
                                                                            <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-white">
                                        {packageItem.quantity || 1}
                                      </span>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 w-8 p-0 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 bg-transparent"
                                                                                onClick={() =>
                                                                                    updatePackageQuantity(packageItem.package_id, (packageItem.quantity || 1) + 1)
                                                                                }
                                                                            >
                                                                                <Plus className="h-3 w-3" />
                                                                            </Button>
                                                                        </div>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
                                                                            onClick={() => removePackage(packageItem.package_id)}
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary Sidebar */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-6">
                                        <Card className="overflow-hidden shadow-lg border-0 bg-white dark:bg-zinc-900">
                                            <CardHeader className="bg-zinc-50 dark:bg-zinc-900 p-4">
                                                <CardTitle className="text-lg text-zinc-900 dark:text-white">Ringkasan Pesanan</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    {/* Individual Tests Breakdown */}
                                                    {testsCart.length > 0 && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full">
                                                                    <Beaker className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                                </div>
                                                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                                                                    Pengujian Individual
                                                                </h4>
                                                            </div>
                                                            <div className="space-y-2 pl-6">
                                                                {testsCart.map((testItem: TestCart, index) => (
                                                                    <div key={`summary-test-${index}`} className="flex justify-between text-sm">
                                                                        <div className="flex-1 pr-2">
                                                                            <div className="text-zinc-700 dark:text-zinc-300 truncate">
                                                                                {testItem.test.name}
                                                                            </div>
                                                                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                {formatRupiah(testItem.test.price)} × {testItem.unit} unit
                                                                            </div>
                                                                        </div>
                                                                        <div className="font-medium text-zinc-900 dark:text-white">
                                                                            {formatRupiah(testItem.test.price * testItem.unit)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Packages Breakdown */}
                                                    {packagesCart.length > 0 && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                                                                    <PackageIcon className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Paket Pengujian</h4>
                                                            </div>
                                                            <div className="space-y-2 pl-6">
                                                                {packagesCart.map((packageItem: PackageCart, index) => (
                                                                    <div key={`summary-package-${index}`} className="flex justify-between text-sm">
                                                                        <div className="flex-1 pr-2">
                                                                            <div className="text-zinc-700 dark:text-zinc-300 truncate">
                                                                                {packageItem.package.name}
                                                                            </div>
                                                                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                                {formatRupiah(packageItem.package.price)} × {packageItem.quantity || 1} paket
                                                                            </div>
                                                                        </div>
                                                                        <div className="font-medium text-zinc-900 dark:text-white">
                                                                            {formatRupiah(packageItem.package.price * (packageItem.quantity || 1))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                        <Separator className="bg-zinc-200 dark:bg-zinc-700" />
                                                    {/* Summary Totals */}

                                                    <div className="flex justify-between">
                                                        <span className="text-lg font-semibold text-zinc-900 dark:text-white">Total</span>
                                                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                      {formatRupiah(subtotal)}
                                                    </span>
                                                    </div>

                                                    <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
                                                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                                                            Harga belum termasuk biaya akomodasi jika diperlukan transportasi ke tempat pengujian,
                                                            untuk harga biaya akomodasi akan diinformasikan lebih lanjut oleh administrator setelah
                                                            pengajuan diterima.
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="p-6 pt-0">
                                                <Button
                                                    onClick={handleContinueToForm}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 py-3 text-base font-semibold text-white"
                                                >
                                                    <span>
                                                        <ClipboardList className="w-8 h-8"/>
                                                    </span>
                                                    Lanjutkan ke Formulir Pesanan
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}

function EmptyCart() {
    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <ShoppingCart className="h-16 w-16 text-blue-500 dark:text-blue-400" />
                </div>
                <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">Keranjang Kosong</h2>
                <p className="mb-8 max-w-lg text-lg text-zinc-600 dark:text-zinc-300">
                    Anda belum menambahkan item apapun ke keranjang. Mulai jelajahi layanan pengujian yang tersedia.
                </p>
                <Link href="/tests">
                    <Button
                        size="lg"
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Jelajahi Pengujian
                    </Button>
                </Link>
            </div>
        </div>
    )
}
