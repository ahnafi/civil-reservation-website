'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Head, Link, useForm as useInertiaForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, Building, Check, CheckCircle2, CreditCard, FileText, Info, Mail, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Transaction } from '@/types';

// Available payment methods with account details
const PAYMENT_METHODS = [
    {
        id: 'BANK_JATENG',
        name: 'BANK JATENG',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
    {
        id: 'BANK_MANDIRI',
        name: 'BANK MANDIRI',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
    {
        id: 'BANK_BNI',
        name: 'BANK BNI',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
    {
        id: 'BANK_BRI',
        name: 'BANK BRI',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
    {
        id: 'BANK_BSI',
        name: 'BANK BSI',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
    {
        id: 'BANK_BTN',
        name: 'BANK BTN',
        accountNumber: '1234567890',
        accountName: 'PT. LABORATORIUM SIPIL',
    },
];

enum TransactionStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

// Form schema with validation
const formSchema = z.object({
    payment_method: z.string({
        required_error: 'Silakan pilih metode pembayaran',
    }),
    payment_receipt: z
        .instanceof(FileList, {
            message: 'Silakan unggah bukti pembayaran',
        })
        .refine((files) => files.length > 0, {
            message: 'Bukti pembayaran harus diunggah',
        })
        .refine((files) => files[0].size <= 5 * 1024 * 1024, {
            message: 'Ukuran file maksimal 5MB',
        })
        .refine((files) => ['image/jpeg', 'image/png', 'image/jpg'].includes(files[0].type), {
            message: 'Format file harus JPG, PNG, atau JPEG',
        }),
});

type FormValues = z.infer<typeof formSchema>;

type PaymentFormData = {
    transaction_id: number;
    payment_receipt: File | null;
    payment_method: string;
};

export default function Payment({ transactionDetail }: { transactionDetail: Transaction[] }) {
    const transaction = transactionDetail[0];
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengajuan',
            href: '/history/submissions',
        },
        {
            title: transaction.submission_code,
            href: `/history/submission/${transaction.submission_code}`,
        },
        {
            title: 'Pembayaran',
            href: `/payment/${transaction.code}`,
        },
    ];

    // Inertia form
    const { data, setData, post, processing, errors, reset } = useInertiaForm<PaymentFormData>({
        transaction_id: transaction.id,
        payment_receipt: null,
        payment_method: '',
    });

    // React Hook Form for validation
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            payment_method: '',
        },
    });

    const formatRupiah = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Format deadline date
    const formatDeadline = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    // Check if payment is overdue
    const isOverdue = new Date() > new Date(transaction.payment_deadline);

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

    // Handle file selection and preview
    const handleFileSelect = (files: FileList | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setData('payment_receipt', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            simulateUpload();
        }
    };

    // Remove selected file
    const removeFile = () => {
        setData('payment_receipt', null);
        setImagePreview(null);
        form.setValue('payment_receipt', undefined, { shouldValidate: true });

        const input = document.getElementById('payment-proof') as HTMLInputElement;
        if (input) input.value = '';
    };

    const handleSubmit = (formData: FormValues) => {
        // Sync data with Inertia form
        setData('payment_method', formData.payment_method);

        // Submit with Inertia
        post(route('submit-payment'), {
            onSuccess: () => {
            setIsSuccess(true);
            reset();
            setImagePreview(null);
            form.reset();
            },
            onError: (errors) => {
            console.error('Payment submission errors:', errors);
            },
        });
    };

    if (isSuccess && TransactionStatus.PAID === 'paid') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Pembayaran Berhasil" />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Pembayaran Berhasil!</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Terima kasih! Bukti pembayaran Anda telah berhasil dikirim. Silakan tunggu konfirmasi dari admin.
                        </p>
                        <Link href={`/history/submission/${transaction.submission_code}`}>
                            <Button className="mt-6">Kembali ke Detail Pengajuan</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (TransactionStatus.FAILED !== 'failed') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Pembayaran Gagal" />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-600 dark:text-red-400" />
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Pembayaran Gagal</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Maaf, terjadi kesalahan saat memproses pembayaran Anda. Silakan coba lagi atau hubungi admin.
                        </p>
                        <Link href={`/history/submission/${transaction.submission_code}`}>
                            <Button className="mt-6">Kembali ke Detail Pengajuan</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembayaran" />

            <div className="min-h-screen bg-gray-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8">
                    {/* Approval Status Header */}
                    <div className="mb-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Pengajuan Disetujui!</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Selamat! Pengajuan <span className="font-semibold text-blue-600">{transaction.submission_code}</span> telah disetujui.
                                Silakan lakukan pembayaran untuk melanjutkan proses pengujian.
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Payment Deadline Alert */}
                                {isOverdue && (
                                    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <AlertDescription className="text-red-700 dark:text-red-400">
                                            <strong>Pembayaran Terlambat!</strong> Batas waktu pembayaran telah berakhir pada{' '}
                                            {formatDeadline(transaction.payment_deadline)}. Silakan hubungi admin untuk perpanjangan.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Submission Summary */}
                                <Card className="border-0 bg-white shadow-sm dark:bg-zinc-900">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle>Detail Transaksi</CardTitle>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Informasi pembayaran pengajuan yang telah disetujui
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Transaksi</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{transaction.code}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Kode Pengajuan</div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{transaction.submission_code}</div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status Pembayaran</div>
                                                <Badge
                                                    className={`${transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                                                >
                                                    {transaction.status === 'pending' ? 'Menunggu Pembayaran' : 'Lunas'}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Batas Waktu Pembayaran</div>
                                                <div className={`font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                                    {formatDeadline(transaction.payment_deadline)}
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                            <div>
                                                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Pembayaran</div>
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatRupiah(transaction.amount)}
                                                </div>
                                            </div>
                                            <div className="text-blue-600 dark:text-blue-400">
                                                <CreditCard className="h-8 w-8" />
                                            </div>
                                        </div>

                                        {/* Download Invoice */}
                                        {transaction.payment_invoice_files && (
                                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                            <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">Invoice Pembayaran</div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Unduh invoice untuk panduan pembayaran
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button className="cursor-pointer" variant="outline" size="sm" asChild>
                                                        <a
                                                            href={`/storage/${transaction.payment_invoice_files[0]}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Unduh Invoice
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Payment Instructions */}
                                <Card className="border-0 bg-white shadow-sm dark:bg-zinc-900">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <CardTitle>Tata Cara Pembayaran</CardTitle>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Ikuti langkah-langkah berikut untuk menyelesaikan pembayaran
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Silakan lakukan pembayaran sesuai dengan total yang tertera dan unggah bukti pembayaran untuk
                                                memproses pengajuan Anda.
                                            </AlertDescription>
                                        </Alert>

                                        <ol className="ml-2 list-inside list-decimal space-y-3 text-sm">
                                            <li className="text-gray-700 dark:text-gray-300">Pilih metode pembayaran yang tersedia</li>
                                            <li className="text-gray-700 dark:text-gray-300">
                                                Transfer total pembayaran ke rekening yang ditampilkan
                                            </li>
                                            <li className="text-gray-700 dark:text-gray-300">Simpan bukti pembayaran (screenshot/foto)</li>
                                            <li className="text-gray-700 dark:text-gray-300">Unggah bukti pembayaran pada form yang disediakan</li>
                                            <li className="text-gray-700 dark:text-gray-300">
                                                Klik tombol "Kirim Bukti Pembayaran" untuk menyelesaikan proses
                                            </li>
                                        </ol>
                                    </CardContent>
                                </Card>

                                {/* Payment Form */}
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                                        {/* Payment Method Selection */}
                                        <Card className="border-0 bg-white shadow-sm dark:bg-zinc-900">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                                                        <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle>Metode Pembayaran</CardTitle>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Pilih bank untuk transfer pembayaran
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <FormField
                                                    control={form.control}
                                                    name="payment_method"
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-4">
                                                            <FormControl>
                                                                <RadioGroup
                                                                    onValueChange={(value) => {
                                                                        field.onChange(value);
                                                                        setData('payment_method', value);
                                                                    }}
                                                                    defaultValue={field.value}
                                                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                                                >
                                                                    {PAYMENT_METHODS.map((method) => (
                                                                        <div key={method.id} className="relative">
                                                                            <RadioGroupItem
                                                                                value={method.name}
                                                                                id={method.id}
                                                                                className="peer sr-only"
                                                                            />
                                                                            <Label
                                                                                htmlFor={method.id}
                                                                                className="flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 hover:bg-gray-50 peer-data-[state=checked]:dark:bg-blue-950 dark:hover:bg-gray-700"
                                                                            >
                                                                                <div className="flex items-center gap-3">
                                                                                    <Building className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                                                        {method.name}
                                                                                    </span>
                                                                                </div>
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage />
                                                            {errors.payment_method && <p className="text-sm text-red-500">{errors.payment_method}</p>}
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Payment Proof Upload */}
                                        <Card className="border-0 bg-white shadow-sm dark:bg-zinc-900">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                                                        <Upload className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <CardTitle>Bukti Pembayaran</CardTitle>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Unggah screenshot atau foto bukti transfer
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <FormField
                                                    control={form.control}
                                                    name="payment_receipt"
                                                    render={({ field: { onChange, value, ...rest } }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <div className="grid w-full items-center gap-4">
                                                                    {!imagePreview ? (
                                                                        <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700">
                                                                            <Input
                                                                                type="file"
                                                                                accept=".jpg,.jpeg,.png"
                                                                                className="hidden"
                                                                                id="payment-proof"
                                                                                onChange={(e) => {
                                                                                    onChange(e.target.files);
                                                                                    handleFileSelect(e.target.files);
                                                                                }}
                                                                                {...rest}
                                                                            />
                                                                            <Label htmlFor="payment-proof" className="cursor-pointer text-center">
                                                                                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                                                                <p className="text-lg font-medium text-gray-900 dark:text-white">
                                                                                    Klik untuk mengunggah file
                                                                                </p>
                                                                                <p className="mt-2 text-sm text-gray-500">atau seret file ke sini</p>
                                                                                <p className="mt-1 text-xs text-gray-400">
                                                                                    JPG, PNG, atau JPEG (Maks. 5MB)
                                                                                </p>
                                                                            </Label>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-4">
                                                                            {/* Image Preview */}
                                                                            <div className="relative rounded-lg border-2 border-gray-200 dark:border-gray-600">
                                                                                <img
                                                                                    src={imagePreview || "/placeholder.svg"}
                                                                                    alt="Preview bukti pembayaran"
                                                                                    className="h-64 w-full rounded-lg object-cover"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={removeFile}
                                                                                    className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                                                                                >
                                                                                    <X className="h-4 w-4" />
                                                                                </button>
                                                                            </div>

                                                                            {/* Upload another file */}
                                                                            <div className="text-center">
                                                                                <Input
                                                                                    type="file"
                                                                                    accept=".jpg,.jpeg,.png"
                                                                                    className="hidden"
                                                                                    id="payment-proof-replace"
                                                                                    onChange={(e) => {
                                                                                        onChange(e.target.files);
                                                                                        handleFileSelect(e.target.files);
                                                                                    }}
                                                                                />
                                                                                <Label htmlFor="payment-proof-replace">
                                                                                    <Button type="button" variant="outline" size="sm">
                                                                                        Ganti Gambar
                                                                                    </Button>
                                                                                </Label>
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {isUploading && (
                                                                        <div className="space-y-2">
                                                                            <Progress value={uploadProgress} className="h-2" />
                                                                            <p className="text-center text-sm text-gray-500">
                                                                                Mengunggah... {uploadProgress}%
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription className="text-sm text-gray-600 dark:text-gray-400">
                                                                Pastikan bukti pembayaran jelas dan mencantumkan nominal yang sesuai
                                                            </FormDescription>
                                                            <FormMessage />
                                                            {errors.payment_receipt && (
                                                                <p className="text-sm text-red-500">{errors.payment_receipt}</p>
                                                            )}
                                                        </FormItem>
                                                    )}
                                                />
                                            </CardContent>
                                        </Card>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row">
                                            <Link href={`/history/submission/${transaction.submission_code}`}>
                                                <Button type="button" variant="outline" disabled={processing} className="h-12 w-full px-6 sm:w-auto">
                                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                                    Kembali ke Detail
                                                </Button>
                                            </Link>
                                            <Button
                                                type="submit"
                                                disabled={processing || isOverdue || !data.payment_receipt || !data.payment_method}
                                                className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 sm:w-auto"
                                            >
                                                {processing ? (
                                                    <>
                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                        Memproses...
                                                    </>
                                                ) : isOverdue ? (
                                                    'Pembayaran Terlambat'
                                                ) : (
                                                    <>
                                                        Kirim Bukti Pembayaran
                                                        <Check className="ml-2 h-4 w-4" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-6">
                                    {/* Contact Information */}
                                    <Card className="border-0 shadow-sm dark:bg-zinc-900">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg">
                                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                Bantuan Pembayaran
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                                                    <div className="text-gray-600 dark:text-gray-300">payment@labsipil.com</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">WhatsApp</div>
                                                    <div className="text-gray-600 dark:text-gray-300">+62 812-3456-7890</div>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">Jam Operasional</div>
                                                    <div className="text-gray-600 dark:text-gray-300">
                                                        Senin - Jumat
                                                        <br />
                                                        08:00 - 16:00 WIB
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tips Payment */}
                                    <Card className="border-0 shadow-sm dark:bg-zinc-900">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg">
                                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                Tips Pembayaran
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-xs font-bold text-blue-600">1</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Transfer sesuai nominal exact untuk mempercepat verifikasi
                                                    </p>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-xs font-bold text-blue-600">2</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300">Simpan bukti pembayaran yang jelas dan lengkap</p>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <span className="text-xs font-bold text-blue-600">3</span>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Verifikasi pembayaran biasanya selesai dalam 1x24 jam
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
