import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/format-rupiah';
import { cn } from '@/lib/utils';
import { calculateCartTotal } from '@/services/form-cart-service';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarIcon, ClipboardList, CreditCard, ShoppingCart } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/orders',
    },
    {
        title: 'Keranjang',
        href: '/orders/cart',
    },
    {
        title: 'Formulir Pesanan',
        href: '/orders/form',
    },
];

type Submission = {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: Date | undefined;
    user_note: string;
};

export default function ReservationForm() {
    const [cartEmpty, setCartEmpty] = useState(false);
    const { subtotal, tax, shipping, total } = calculateCartTotal();
    const { data, setData, post, processing, errors, reset } = useForm<Submission>({
        company_name: '',
        project_name: '',
        project_address: '',
        test_submission_date: undefined,
        user_note: '',
    });

    // Load saved values from localStorage
    useEffect(() => {
        const savedForm = localStorage.getItem('reservation_form');
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                // Use setData to update form values
                setData({
                    ...parsedForm,
                    test_submission_date: parsedForm.test_submission_date ? new Date(parsedForm.test_submission_date) : undefined,
                });
            } catch (e) {
                console.error('Error parsing saved form data:', e);
            }
        }
    }, []);

    useEffect(() => {
        // Check if cart is empty
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        if (tests.length === 0 && packages.length === 0) {
            setCartEmpty(true);
        }
    }, []);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        if (Object.values(data).some((val) => val !== undefined && val !== '')) {
            localStorage.setItem('reservation_form', JSON.stringify(data));
        }
    }, [data]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        // Convert date to ISO string for storage
        const submissionDate = data.test_submission_date ? data.test_submission_date.toISOString() : undefined;
        const formData = {
            ...data,
            test_submission_date: submissionDate,
        };

        // Get cart items from localStorage
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        // Map tests to only include test_id and quantity (renamed from unit)
        const simplifiedTests = tests.map((test: { test_id: number; unit: number }) => ({
            test_id: test.test_id,
            quantity: test.unit,
        }));

        const simplifiedPackages = packages.map((pkg: { package_id: number }) => ({
            package_id: pkg.package_id,
        }));

        const orderData = {
            submission: { ...formData, total },
            tests: simplifiedTests,
            packages: simplifiedPackages,
        };

        // Save complete order data to localStorage
        localStorage.setItem('order_data', JSON.stringify(orderData));

        post(route('orders.store'), {
            data: orderData,
            onSuccess: () => {
                // Clear cart data from localStorage after successful submission
                localStorage.removeItem('tests');
                localStorage.removeItem('packages');
                localStorage.removeItem('reservation_form');
            },
            onError: (error) => {
                console.error('Error submitting order:', error);
            },
        });
    };

    if (cartEmpty) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Formulir Pesanan" />
                <div className="container mx-auto py-6">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <ClipboardList className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold">Keranjang Anda Kosong</h2>
                        <p className="mb-8 max-w-md text-gray-500">
                            Anda perlu menambahkan pengujian atau paket ke keranjang sebelum mengisi formulir pesanan.
                        </p>
                        <Link href="/orders/cart">
                            <Button size="lg">Kembali ke Keranjang</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formulir Pesanan" />

            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-3xl font-bold">Formulir Pesanan</h1>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-between">
                            <div className="flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-500">Keranjang</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium">Formulir Pesanan</span>
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

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="company_name" className="block text-sm font-medium">
                                                Nama Perusahaan
                                            </label>
                                            <Input
                                                id="company_name"
                                                value={data.company_name}
                                                onChange={(e) => setData('company_name', e.target.value)}
                                                placeholder="PT. Konstruksi Indonesia"
                                                disabled={processing}
                                            />
                                            {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="project_name" className="block text-sm font-medium">
                                                Nama Proyek
                                            </label>
                                            <Input
                                                id="project_name"
                                                value={data.project_name}
                                                onChange={(e) => setData('project_name', e.target.value)}
                                                placeholder="Pembangunan Jembatan Suramadu"
                                                disabled={processing}
                                            />
                                            {errors.project_name && <p className="text-sm text-red-500">{errors.project_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="project_address" className="block text-sm font-medium">
                                                Alamat Proyek
                                            </label>
                                            <Textarea
                                                id="project_address"
                                                value={data.project_address}
                                                onChange={(e) => setData('project_address', e.target.value)}
                                                placeholder="Jl. Raya Suramadu, Surabaya, Jawa Timur"
                                                className="resize-none"
                                                disabled={processing}
                                            />
                                            {errors.project_address && <p className="text-sm text-red-500">{errors.project_address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="test_submission_date" className="block text-sm font-medium">
                                                Tanggal Pengujian
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'w-full pl-3 text-left font-normal',
                                                            !data.test_submission_date && 'text-muted-foreground',
                                                        )}
                                                        disabled={processing}
                                                    >
                                                        {data.test_submission_date ? (
                                                            formatDate(data.test_submission_date)
                                                        ) : (
                                                            <span>Pilih tanggal</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={data.test_submission_date}
                                                        onSelect={(date) => setData('test_submission_date', date)}
                                                        disabled={
                                                            (date) =>
                                                                date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                                                                date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Allow booking up to 3 months ahead
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-sm text-gray-500">
                                                Pilih tanggal untuk melakukan pengujian (maksimal 3 bulan ke depan)
                                            </p>
                                            {errors.test_submission_date && <p className="text-sm text-red-500">{errors.test_submission_date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="user_note" className="block text-sm font-medium">
                                                Catatan (Opsional)
                                            </label>
                                            <Textarea
                                                id="user_note"
                                                value={data.user_note}
                                                onChange={(e) => setData('user_note', e.target.value)}
                                                placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                                                className="resize-none"
                                                disabled={processing}
                                            />
                                            <p className="text-sm text-gray-500">Berikan informasi tambahan yang mungkin diperlukan oleh admin</p>
                                            {errors.user_note && <p className="text-sm text-red-500">{errors.user_note}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Link href="/orders/cart">
                                            <Button type="button" variant="outline" disabled={processing}>
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Kembali ke Keranjang
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            Kirim Pengajuan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Card */}
                    <div>
                        <Card className="sticky top-6">
                            <CardHeader className="pb-3">
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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

                                <Alert className="border-gray-200 bg-gray-50">
                                    <AlertDescription className="text-xs">
                                        Silakan lengkapi formulir pesanan untuk melanjutkan ke proses checkout dan pembayaran.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleSubmit} disabled={processing}>
                                    Kirim Pengajuan
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
