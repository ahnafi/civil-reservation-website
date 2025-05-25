'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PackageCart, TestCart } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Beaker, Building2, ClipboardList, CreditCard, Minus, PackageIcon, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/orders',
    },
    {
        title: 'Keranjang',
        href: '/orders/cart',
    },
];

export default function Cart() {
    const [testsCart, setTestsCart] = useState<TestCart[]>([]);
    const [packagesCart, setPackagesCart] = useState<PackageCart[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedTests = localStorage.getItem('tests') || '[]';
            const savedPackages = localStorage.getItem('packages') || '[]';

            setTestsCart(JSON.parse(savedTests));
            setPackagesCart(JSON.parse(savedPackages));
        } catch (err) {
            setError('Error loading cart data');
            console.error(err);
            console.error('Error loading cart data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateTestQuantity = (testId: number, newQuantity: number) => {
        const updatedTests = testsCart.map((item: TestCart) => {
            if (item.test_id === testId) {
                const minUnit = item.test.minimum_unit || 1;
                const quantity = Math.max(minUnit, newQuantity);
                return { ...item, unit: quantity };
            }
            return item;
        });

        setTestsCart(updatedTests);
        localStorage.setItem('tests', JSON.stringify(updatedTests));
    };

    const updatePackageQuantity = (packageId: number, newQuantity: number) => {
        const updatedPackages = packagesCart.map((item) => {
            if (item.package_id === packageId) {
                return { ...item, quantity: Math.max(1, newQuantity) };
            }
            return item;
        });

        setPackagesCart(updatedPackages);
        localStorage.setItem('packages', JSON.stringify(updatedPackages));
    };

    const removeTest = (testId: number) => {
        const updatedTests = testsCart.filter((item: TestCart) => item.test_id !== testId);
        setTestsCart(updatedTests);
        localStorage.setItem('tests', JSON.stringify(updatedTests));
    };

    const removePackage = (packageId: number) => {
        const updatedPackages = packagesCart.filter((item: PackageCart) => item.package_id !== packageId);
        setPackagesCart(updatedPackages);
        localStorage.setItem('packages', JSON.stringify(updatedPackages));
    };

    const calculateSubtotal = () => {
        let subtotal = 0;

        testsCart.forEach((item: TestCart) => {
            subtotal += item.test.price * item.unit;
        });

        packagesCart.forEach((item: PackageCart) => {
            subtotal += item.package.price * (item.quantity || 1);
        });

        return subtotal;
    };

    const subtotal = calculateSubtotal();
    const tax = Math.round(subtotal * 0.1);
    const shipping = subtotal > 0 ? 50000 : 0;
    const total = subtotal + tax + shipping;

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Keranjang" />
                <div className="flex h-64 items-center justify-center">
                    <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
                </div>
            </AppLayout>
        );
    }

    const isEmpty = testsCart.length === 0 && packagesCart.length === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Keranjang" />

            <div className="container mx-auto py-6">
                {isEmpty ? (
                    <EmptyCart />
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="space-y-6 lg:col-span-2">
                            <div className="mb-8 p-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-between">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
                                                <ShoppingCart className="h-6 w-6" />
                                            </div>
                                            <span className="mt-2 text-sm font-medium">Keranjang</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                                <ClipboardList className="h-6 w-6" />
                                            </div>
                                            <span className="mt-2 text-sm font-medium text-gray-500">Formulir Pesanan</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                                <CreditCard className="h-6 w-6" />
                                            </div>
                                            <span className="mt-2 text-sm font-medium text-gray-500">Checkout</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tests Section */}
                            {testsCart.length > 0 && (
                                <Card className="overflow-hidden">
                                    <CardHeader className="bg-gray-50 px-6 py-4 dark:bg-gray-900">
                                        <CardTitle className="flex items-center text-lg">
                                            <Beaker className="mr-2 h-5 w-5" />
                                            Pengujian Individual
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {testsCart.map((testItem: TestCart, index) => (
                                            <div
                                                key={`test-${testItem.test_id}`}
                                                className={`p-6 ${index !== testsCart.length - 1 ? 'border-b' : ''}`}
                                            >
                                                <div className="flex flex-col gap-6 md:flex-row">
                                                    <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100 md:w-1/4 dark:bg-gray-800">
                                                        <img
                                                            src={`/storage/test_image/${testItem.test.images[0]}`}
                                                            alt={testItem.test.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col justify-between md:flex-row">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">{testItem.test.name}</h3>
                                                                <div className="mt-2 flex flex-wrap gap-2">
                                                                    {testItem.test.laboratory && (
                                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                                            <Building2 className="h-3 w-3" />
                                                                            {testItem.test.laboratory.name}
                                                                        </Badge>
                                                                    )}
                                                                    {testItem.test.category && (
                                                                        <Badge variant="outline" className="flex items-center gap-1">
                                                                            <Beaker className="h-3 w-3" />
                                                                            {testItem.test.category.name}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    {testItem.test.description}
                                                                </p>
                                                            </div>
                                                            <div className="mt-4 md:mt-0 md:text-right">
                                                                <div className="text-lg font-semibold">
                                                                    {formatRupiah(testItem.test.price * testItem.unit)}
                                                                </div>
                                                                <div className="mt-1 text-sm text-gray-500">
                                                                    {formatRupiah(testItem.test.price)} / {testItem.test.category.name.toLowerCase()}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                                                            <div className="flex items-center">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() => updateTestQuantity(testItem.test_id, testItem.unit - 1)}
                                                                    disabled={testItem.unit <= testItem.test.minimum_unit}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="mx-3 w-8 text-center">{testItem.unit}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() => updateTestQuantity(testItem.test_id, testItem.unit + 1)}
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="ml-3 text-xs text-gray-500">
                                                                    Min. unit: {testItem.test.minimum_unit}
                                                                </span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => removeTest(testItem.test_id)}
                                                            >
                                                                <Trash2 className="mr-1 h-4 w-4" />
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Packages Section */}
                            {packagesCart.length > 0 && (
                                <Card className="overflow-hidden">
                                    <CardHeader className="bg-gray-50 px-6 py-4 dark:bg-gray-900">
                                        <CardTitle className="flex items-center text-lg">
                                            <PackageIcon className="mr-2 h-5 w-5" />
                                            Paket Pengujian
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {packagesCart.map((packageItem: PackageCart, index) => (
                                            <div
                                                key={`package-${packageItem.package_id}`}
                                                className={`p-6 ${index !== packagesCart.length - 1 ? 'border-b' : ''}`}
                                            >
                                                <div className="flex flex-col gap-6 md:flex-row">
                                                    <div className="h-40 w-full overflow-hidden rounded-lg bg-gray-100 md:w-1/4 dark:bg-gray-800">
                                                        <img
                                                            src={`/storage/package_image/${packageItem.package.images ? packageItem.package.images[0] : 'default.jpg'}`}
                                                            alt={packageItem.package.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col justify-between md:flex-row">
                                                            <div>
                                                                <h3 className="text-lg font-semibold">{packageItem.package.name}</h3>
                                                                {packageItem.package.laboratory && (
                                                                    <Badge variant="outline" className="mt-2 flex items-center gap-1">
                                                                        <Building2 className="h-3 w-3" />
                                                                        {packageItem.package.laboratory.name}
                                                                    </Badge>
                                                                )}
                                                                <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    {packageItem.package.description}
                                                                </p>
                                                            </div>
                                                            <div className="mt-4 md:mt-0 md:text-right">
                                                                <div className="text-lg font-semibold">
                                                                    {formatRupiah(packageItem.package.price * (packageItem.quantity || 1))}
                                                                </div>
                                                                {packageItem.quantity > 1 && (
                                                                    <div className="mt-1 text-sm text-gray-500">
                                                                        {formatRupiah(packageItem.package.price)} / paket
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {packageItem.package.tests && packageItem.package.tests.length > 0 && (
                                                            <div className="mt-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                                <h4 className="mb-2 text-sm font-medium">Isi Paket:</h4>
                                                                <ScrollArea className="h-24">
                                                                    <ul className="space-y-1">
                                                                        {packageItem.package.tests.map((test, testIndex) => (
                                                                            <li key={testIndex} className="flex justify-between text-sm">
                                                                                <Link
                                                                                    href={`/tests/${test.slug}`}
                                                                                    className="text-blue-600 hover:underline"
                                                                                >
                                                                                    {test.name}
                                                                                </Link>
                                                                                <span>{formatRupiah(test.price)}</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </ScrollArea>
                                                            </div>
                                                        )}

                                                        <div className="mt-4 flex items-center justify-between border-t pt-4">
                                                            <div className="flex items-center">
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
                                                                    onClick={() =>
                                                                        updatePackageQuantity(packageItem.package_id, (packageItem.quantity || 1) - 1)
                                                                    }
                                                                    disabled={(packageItem.quantity || 1) <= 1}
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </Button>
                                                                <span className="mx-3 w-8 text-center">{packageItem.quantity || 1}</span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-8 w-8 rounded-full"
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
                                                                className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                                onClick={() => removePackage(packageItem.package_id)}
                                                            >
                                                                <Trash2 className="mr-1 h-4 w-4" />
                                                                Hapus
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Order Summary Card */}
                        <Card className="sticky h-fit p-4">
                            <CardHeader className="p-0">
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 p-0">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Pajak (10%)</span>
                                        <span>{formatRupiah(tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Biaya Pengiriman</span>
                                        <span>{formatRupiah(shipping)}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-medium">
                                    <span>Total</span>
                                    <span>{formatRupiah(total)}</span>
                                </div>

                                <Alert className="border-blue-200 bg-blue-50 text-blue-800">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-xs">
                                        Reservasi akan diproses setelah pembayaran selesai. Pastikan data yang dimasukkan sudah benar.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter className="p-0">
                                <Link
                                    href="/orders/form"
                                    disabled={isEmpty}
                                    className="w-full rounded-md bg-blue-600 py-2 text-center text-base font-semibold text-white transition duration-300 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                                >
                                    Lanjutkan ke Formulir
                                </Link>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold">Keranjang Anda Kosong</h2>
            <p className="mb-8 max-w-md text-gray-500">
                Anda belum menambahkan pengujian atau paket apapun ke keranjang. Silakan jelajahi layanan pengujian yang tersedia.
            </p>
            <Link href="/tests">
                <Button size="lg">Jelajahi Pengujian</Button>
            </Link>
        </div>
    );
}
