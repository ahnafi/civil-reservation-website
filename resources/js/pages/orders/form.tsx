'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarIcon, ClipboardList, CreditCard, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { calculateCartTotal } from '@/services/form-cart-service';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-utils';

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

// Form schema with validation
const formSchema = z.object({
    company_name: z.string().min(2, { message: 'Nama perusahaan harus diisi' }),
    project_name: z.string().min(2, { message: 'Nama proyek harus diisi' }),
    project_address: z.string().min(5, { message: 'Alamat proyek harus diisi' }),
    test_submission_date: z.date({
        required_error: 'Tanggal pengujian harus dipilih',
    }),
    note: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReservationForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [cartEmpty, setCartEmpty] = useState(false);
    const { subtotal, tax, shipping, total } = calculateCartTotal();

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Initialize form with default values or values from localStorage
    // In your useForm hook, modify it to ensure fields are never undefined
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company_name: '',
            project_name: '',
            project_address: '',
            test_submission_date: undefined,
            note: '',
        },
    });

    // Then load saved values in a useEffect
    useEffect(() => {
        const savedForm = localStorage.getItem('reservation_form');
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                // Use setValue to update form values after initialization
                form.reset({
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

        setIsLoading(false);
    }, []);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (Object.values(value).some((val) => val !== undefined && val !== '')) {
                localStorage.setItem('reservation_form', JSON.stringify(value));
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    function onSubmit(values: FormValues) {
        // Save the final form data to localStorage
        localStorage.setItem('reservation_form', JSON.stringify(values));

        // Redirect to checkout page
        window.location.href = '/orders/checkout';
    }

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Formulir Pesanan" />
                <div className="flex h-64 items-center justify-center">
                    <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
                </div>
            </AppLayout>
        );
    }

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
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="company_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama Perusahaan</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="PT. Konstruksi Indonesia" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="project_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama Proyek</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Pembangunan Jembatan Suramadu" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="project_address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Alamat Proyek</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Jl. Raya Suramadu, Surabaya, Jawa Timur"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="test_submission_date"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Tanggal Pengujian</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={'outline'}
                                                                    className={cn(
                                                                        'w-full pl-3 text-left font-normal',
                                                                        !field.value && 'text-muted-foreground',
                                                                    )}
                                                                >
                                                                    {field.value ? formatDate(field.value) : <span>Pilih tanggal</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={
                                                                    (date) =>
                                                                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                                                                        date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Allow booking up to 3 months ahead
                                                                }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormDescription>
                                                        Pilih tanggal untuk melakukan pengujian (maksimal 3 bulan ke depan)
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="note"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Catatan (Opsional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Berikan informasi tambahan yang mungkin diperlukan oleh admin</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="flex justify-between pt-4">
                                            <Link href="/orders/cart">
                                                <Button type="button" variant="outline">
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Kembali ke Keranjang
                                                </Button>
                                            </Link>
                                            <Button type="submit">
                                                Lanjutkan ke Checkout
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
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
                                <Button className="w-full" onClick={form.handleSubmit(onSubmit)}>
                                    Lanjutkan ke Checkout
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
