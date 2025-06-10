'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Building, Check, ClipboardList, CreditCard, ShoppingCart, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { calculateCartTotal } from '@/services/form-cart-service';
import type { BreadcrumbItem } from '@/types';

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
    {
        title: 'Checkout',
        href: '/orders/checkout',
    },
];

// Available payment methods
const PAYMENT_METHODS = [
    { id: 'BANK_JATENG', name: 'BANK JATENG', accountNumber: '1234-5678-9012-3456', accountName: 'PT. Lab Teknik Sipil' },
    {
        id: 'BANK_MANDIRI',
        name: 'BANK MANDIRI',
        accountNumber: '2345-6789-0123-4567',
        accountName: 'PT. Lab Teknik Sipil',
    },
    { id: 'BANK_BNI', name: 'BANK BNI', accountNumber: '3456-7890-1234-5678', accountName: 'PT. Lab Teknik Sipil' },
    { id: 'BANK_BRI', name: 'BANK BRI', accountNumber: '4567-8901-2345-6789', accountName: 'PT. Lab Teknik Sipil' },
    { id: 'BANK_BSI', name: 'BANK BSI', accountNumber: '5678-9012-3456-7890', accountName: 'PT. Lab Teknik Sipil' },
    { id: 'BANK_BTN', name: 'BANK BTN', accountNumber: '6789-0123-4567-8901', accountName: 'PT. Lab Teknik Sipil' },
];

// Form schema with validation
const formSchema = z.object({
    paymentMethod: z.string({
        required_error: 'Silakan pilih metode pembayaran',
    }),
    paymentProof: z
        .instanceof(FileList, {
            message: 'Silakan unggah bukti pembayaran',
        })
        .refine((files) => files.length > 0, {
            message: 'Bukti pembayaran harus diunggah',
        })
        .refine((files) => files[0].size <= 5 * 1024 * 1024, {
            message: 'Ukuran file maksimal 5MB',
        })
        .refine((files) => ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(files[0].type), {
            message: 'Format file harus JPG, PNG, atau PDF',
        }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Checkout() {
    const [isLoading, setIsLoading] = useState(true);
    const [cartEmpty, setCartEmpty] = useState(false);
    const [formIncomplete, setFormIncomplete] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { subtotal, tax, shipping, total } = calculateCartTotal();

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            paymentMethod: '',
        },
    });

    useEffect(() => {
        // Check if cart is empty
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        if (tests.length === 0 && packages.length === 0) {
            setCartEmpty(true);
        }

        // Check if form is incomplete
        const reservationForm = localStorage.getItem('reservation_form');
        if (!reservationForm) {
            setFormIncomplete(true);
        }

        setIsLoading(false);
    }, []);

    // Simulate file upload progress
    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    function onSubmit(values: FormValues) {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            // Save checkout data to localStorage
            const checkoutData = {
                paymentMethod: values.paymentMethod,
                paymentProofFileName: values.paymentProof[0].name,
                checkoutDate: new Date().toISOString(),
            };

            localStorage.setItem('checkout_data', JSON.stringify(checkoutData));

            // Clear cart after successful checkout
            // localStorage.removeItem("tests")
            // localStorage.removeItem("packages")
            // localStorage.removeItem("reservation_form")

            setIsSubmitting(false);
            setIsSuccess(true);
        }, 2000);
    }

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Checkout" />
                <div className="flex h-64 items-center justify-center">
                    <div className="border-primary h-12 w-12 animate-spin rounded-full border-t-2 border-b-2"></div>
                </div>
            </AppLayout>
        );
    }

    if (cartEmpty) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Checkout" />
                <div className="container mx-auto py-6">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <ShoppingCart className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold">Keranjang Anda Kosong</h2>
                        <p className="mb-8 max-w-md text-gray-500">
                            Anda perlu menambahkan pengujian atau paket ke keranjang sebelum melakukan checkout.
                        </p>
                        <Link href="/orders/cart">
                            <Button size="lg">Kembali ke Keranjang</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (formIncomplete) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Checkout" />
                <div className="container mx-auto py-6">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <ClipboardList className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold">Formulir Pesanan Belum Lengkap</h2>
                        <p className="mb-8 max-w-md text-gray-500">Anda perlu melengkapi formulir pesanan sebelum melakukan checkout.</p>
                        <Link href="/orders/form">
                            <Button size="lg">Isi Formulir Pesanan</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Checkout Berhasil" />
                <div className="container mx-auto py-6">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                            <Check className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold">Checkout Berhasil!</h2>
                        <p className="mb-8 max-w-md text-gray-500">
                            Terima kasih atas pesanan Anda. Kami akan memproses pesanan Anda segera setelah verifikasi pembayaran.
                        </p>
                        <div className="mb-8 w-full max-w-md rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-2 font-semibold">Detail Pesanan:</h3>
                            <p className="mb-1 text-sm text-gray-600">ID Pesanan: ORD-{Math.floor(Math.random() * 1000000)}</p>
                            <p className="mb-1 text-sm text-gray-600">Total Pembayaran: {formatRupiah(total)}</p>
                            <p className="text-sm text-gray-600">Status: Menunggu Verifikasi</p>
                        </div>
                        <Link href="/orders">
                            <Button size="lg">Lihat Pesanan Saya</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Checkout" />

            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

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
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-500">Formulir Pesanan</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium">Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Tata Cara Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Silakan lakukan pembayaran sesuai dengan total yang tertera dan unggah bukti pembayaran untuk memproses
                                        pesanan Anda.
                                    </AlertDescription>
                                </Alert>

                                <ol className="ml-2 list-inside list-decimal space-y-2">
                                    <li>Pilih metode pembayaran yang tersedia</li>
                                    <li>Transfer total pembayaran ke rekening yang ditampilkan</li>
                                    <li>Simpan bukti pembayaran (screenshot/foto)</li>
                                    <li>Unggah bukti pembayaran pada form yang disediakan</li>
                                    <li>Klik tombol "Selesaikan Checkout" untuk menyelesaikan proses</li>
                                </ol>
                            </CardContent>
                        </Card>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Metode Pembayaran</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="paymentMethod"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Pilih Bank</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                                        >
                                                            {PAYMENT_METHODS.map((method) => (
                                                                <div key={method.id} className="relative">
                                                                    <RadioGroupItem value={method.id} id={method.id} className="peer sr-only" />
                                                                    <Label
                                                                        htmlFor={method.id}
                                                                        className="peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 flex cursor-pointer flex-col rounded-md border p-4 hover:bg-gray-50"
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Building className="h-5 w-5" />
                                                                            <span className="font-medium">{method.name}</span>
                                                                        </div>
                                                                        <div className="mt-2 text-sm text-gray-500">
                                                                            <p>No. Rekening: {method.accountNumber}</p>
                                                                            <p>Atas Nama: {method.accountName}</p>
                                                                        </div>
                                                                    </Label>
                                                                </div>
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Bukti Pembayaran</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <FormField
                                            control={form.control}
                                            name="paymentProof"
                                            render={({ field: { onChange, value, ...rest } }) => (
                                                <FormItem>
                                                    <FormLabel>Unggah Bukti Pembayaran</FormLabel>
                                                    <FormControl>
                                                        <div className="grid w-full items-center gap-4">
                                                            <div className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 hover:bg-gray-50">
                                                                <Input
                                                                    type="file"
                                                                    accept=".jpg,.jpeg,.png,.pdf"
                                                                    className="hidden"
                                                                    id="payment-proof"
                                                                    onChange={(e) => {
                                                                        onChange(e.target.files);
                                                                        if (e.target.files && e.target.files.length > 0) {
                                                                            simulateUpload();
                                                                        }
                                                                    }}
                                                                    {...rest}
                                                                />
                                                                <Label htmlFor="payment-proof" className="cursor-pointer text-center">
                                                                    <Upload className="mb-2 h-10 w-10 text-gray-400" />
                                                                    <p className="font-medium">Klik untuk mengunggah atau seret file ke sini</p>
                                                                    <p className="mt-1 text-sm text-gray-500">JPG, PNG, atau PDF (Maks. 5MB)</p>
                                                                </Label>
                                                            </div>

                                                            {isUploading && (
                                                                <div className="space-y-2">
                                                                    <Progress value={uploadProgress} className="h-2" />
                                                                    <p className="text-center text-sm text-gray-500">
                                                                        Mengunggah... {uploadProgress}%
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {form.watch('paymentProof') && form.watch('paymentProof').length > 0 && !isUploading && (
                                                                <div className="flex items-center justify-between rounded-md bg-green-50 p-3">
                                                                    <div className="flex items-center">
                                                                        <Check className="mr-2 h-5 w-5 text-green-500" />
                                                                        <span className="text-sm">
                                                                            {form.watch('paymentProof')[0].name} (
                                                                            {(form.watch('paymentProof')[0].size / 1024 / 1024).toFixed(2)} MB)
                                                                        </span>
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            form.setValue('paymentProof', undefined, { shouldValidate: true });
                                                                            const input = document.getElementById(
                                                                                'payment-proof',
                                                                            ) as HTMLInputElement;
                                                                            if (input) input.value = '';
                                                                        }}
                                                                    >
                                                                        Hapus
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Unggah screenshot atau foto bukti pembayaran Anda</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                </Card>

                                <div className="flex justify-between pt-4">
                                    <Link href="/orders/form">
                                        <Button type="button" variant="outline">
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Kembali ke Formulir
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Selesaikan Checkout
                                                <Check className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
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
                                        Pastikan Anda melakukan pembayaran sesuai dengan total yang tertera dan mengunggah bukti pembayaran.
                                    </AlertDescription>
                                </Alert>

                                {/* Reservation Details */}
                                <div className="mt-4 border-t pt-4">
                                    <h3 className="mb-2 font-medium">Detail Reservasi:</h3>
                                    {(() => {
                                        try {
                                            const formData = JSON.parse(localStorage.getItem('reservation_form') || '{}');
                                            return (
                                                <div className="space-y-1 text-sm">
                                                    <p>
                                                        <span className="text-gray-500">Perusahaan:</span> {formData.companyName}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Proyek:</span> {formData.projectName}
                                                    </p>
                                                    <p>
                                                        <span className="text-gray-500">Tanggal Pengujian:</span>{' '}
                                                        {formData.testSubmissionDate
                                                            ? new Date(formData.testSubmissionDate).toLocaleDateString('id-ID', { dateStyle: 'long' })
                                                            : '-'}
                                                    </p>
                                                </div>
                                            );
                                        } catch (e) {
                                            return <p className="text-sm text-gray-500">Data reservasi tidak tersedia</p>;
                                        }
                                    })()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
