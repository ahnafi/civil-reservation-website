import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Transaction } from '@/types';
import { parseAndFormatDate } from '@/utils/date-utils';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Check, Clock, CreditCard, Download, FileText, Link2, Receipt, XCircle } from 'lucide-react';
import React from 'react';

// Format currency helper
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format date helper
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
        return parseAndFormatDate(new Date(dateString));
    } catch (error) {
        return `Format tanggal tidak valid: ${error}`;
    }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    let colorClasses = 'bg-gray-100 text-gray-800';
    let icon = null;

    if (status === 'success') {
        colorClasses = 'bg-green-100 text-green-800';
        icon = <Check className="h-4 w-4" />;
    } else if (status === 'pending') {
        colorClasses = 'bg-yellow-100 text-yellow-800';
        icon = <Clock className="h-4 w-4" />;
    } else if (status === 'failed') {
        colorClasses = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-4 w-4" />;
    }

    return (
        <div className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${colorClasses}`}>
            {icon}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
    );
};

// Info item component
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">{icon}</div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
};

export default function TransactionDetail({ transactionHistoryDetail }: { transactionHistoryDetail: Transaction[] }) {
    // Get the first transaction record
    const transaction: Transaction = transactionHistoryDetail[0];

    const handleMultiDownload = (files: string[]) => {
        files.forEach((file) => {
            const link = document.createElement("a");
            link.href = `/storage/${file}`;
            link.download = file.split("/").pop() || "download";
            link.target = "_blank"; // optional
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Daftar Transaksi',
            href: '/history/transactions',
        },
        {
            title: `${transaction.code}`,
            href: `/history/transaction/${transaction.code}`,
        },
    ];

    // If no data, show a message
    if (!transaction) {
        return (
            <AppLayout>
                <Head title="Tidak Terdapat Transaksi" />
                <div className="container mx-auto py-8">
                    <Card className="bg-white dark:bg-zinc-900">
                        <CardContent className="p-8 text-center bg-white dark:bg-zinc-900">
                            <p>Data transaksi tidak ditemukan</p>
                            <Button variant="outline" className="mt-4" asChild>
                                <Link href="/history/transactions">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaksi ${transaction.code}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2">
                        <Card className="gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            <h2>Detail Transaksi</h2>
                                        </CardTitle>
                                        <CardDescription>
                                            <p>Informasi transaksi kode {transaction.code}</p>
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={transaction.status} />
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
                                <div className="mb-6 rounded-lg border p-4">
                                    <h3 className="mb-4 font-medium">Informasi Transaksi</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoItem
                                            icon={<FileText className="h-5 w-5 text-blue-600" />}
                                            label="Kode Transaksi"
                                            value={transaction.code}
                                        />
                                        <InfoItem
                                            icon={<CreditCard className="h-5 w-5 text-blue-600" />}
                                            label="Jumlah Pembayaran"
                                            value={formatCurrency(transaction.amount)}
                                        />
                                        <InfoItem
                                            icon={<Calendar className="h-5 w-5 text-blue-600" />}
                                            label="Tanggal Transaksi"
                                            value={formatDate(transaction.created_at)}
                                        />
                                        <InfoItem
                                            icon={<Clock className="h-5 w-5 text-blue-600" />}
                                            label="Tanggal Pembayaran"
                                            value={formatDate(transaction.payment_date)}
                                        />
                                        <InfoItem
                                            icon={<CreditCard className="h-5 w-5 text-blue-600" />}
                                            label="Metode Pembayaran"
                                            value={!transaction.payment_method ? "Tidak tersedia" : transaction.payment_method}
                                        />
                                        <InfoItem
                                            icon={<Link2 className="h-5 w-5 text-blue-600" />}
                                            label="ID Pengajuan"
                                            value={
                                                <Link
                                                    href={`/history/submission/${transaction.submission_code}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Pengajuan #{transaction.submission_code}
                                                </Link>
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Dokumen Transaksi</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="rounded-lg border p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-medium">Invoice Pembayaran</h4>
                                                </div>
                                                <Button size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleMultiDownload(transaction.payment_invoice_files || [])}
                                                        >
                                                        <Download className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <small className="text-gray-500">Invoice pembayaran untuk transaksi ini</small>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Receipt className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-medium">Bukti Pembayaran</h4>
                                                </div>
                                                {transaction.payment_receipt_images ? (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleMultiDownload(transaction.payment_receipt_images || [])}
                                                    >
                                                            <Download className="h-4 w-4" />
                                                    </Button>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Belum tersedia</span>
                                                )}
                                            </div>
                                            <small className="text-gray-500">
                                                {transaction.payment_receipt_images
                                                    ? "Bukti pembayaran yang telah diunggah"
                                                    : "Bukti pembayaran belum diunggah"
                                                }
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                {transaction.note && (
                                    <div className="mt-6 rounded-lg border p-4">
                                        <h3 className="mb-2 text-lg font-medium">Catatan</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{transaction.note}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="lg:col-span-1">
                        <Card className="gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Status Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
                                {transaction.status === 'success' && (
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-600" />
                                            <h4 className="font-medium text-green-700 dark:text-green-400">Pembayaran Berhasil</h4>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Pembayaran Anda telah diterima dan dikonfirmasi pada {formatDate(transaction.payment_date)}.
                                        </p>
                                    </div>
                                )}

                                {transaction.status === 'pending' && (
                                    <>
                                        {transaction.payment_receipt_images ? (
                                            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Menunggu Konfirmasi</h4>
                                                </div>
                                                <p className="text-sm text-blue-700 dark:text-blue-400">
                                                    Bukti pembayaran Anda telah kami terima. Admin akan memproses dalam waktu maksimal 2 x 24 jam.
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <Clock className="h-5 w-5 text-yellow-600" />
                                                        <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Menunggu Pembayaran</h4>
                                                    </div>
                                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                        Silakan selesaikan pembayaran Anda sebelum {formatDate(transaction.payment_deadline)}.
                                                    </p>
                                                </div>
                                                <Link href={`/payment/${transaction.code}`} className="mt-4">
                                                    <Button className="w-full">Upload Bukti Pembayaran</Button>
                                                </Link>
                                            </>
                                        )}
                                    </>
                                )}

                                {transaction.status === 'failed' && (
                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <XCircle className="h-5 w-5 text-red-600" />
                                            <h4 className="font-medium text-red-700 dark:text-red-400">Pembayaran Gagal</h4>
                                        </div>
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            Pembayaran Anda tidak dapat diproses. Silakan coba lagi atau hubungi kami untuk bantuan.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50 p-2 dark:bg-zinc-800">
                                <div className="w-full text-center text-gray-500">
                                    <small>Terakhir diperbarui: {formatDate(transaction.updated_at)}</small>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="mt-6 gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Ringkasan Pembayaran</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Total Biaya</span>
                                        <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Metode Pembayaran</span>
                                        <span className="font-medium">{transaction.payment_method}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total Dibayar</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(transaction.amount)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6 gap-0 p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800 rounded-t-lg">
                                <CardTitle className="text-lg">Bantuan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4 text-sm">
                                    <p>Jika Anda memiliki pertanyaan tentang pembayaran ini, silakan hubungi tim dukungan kami.</p>

                                    <div className="space-y-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Email Support</div>
                                            <a
                                                href="mailto:laboratoriumsipil.unsoed@gmail.com"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                laboratoriumsipil.unsoed@gmail.com
                                            </a>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">WhatsApp</div>
                                            <a
                                                href="https://wa.me/6281393133408"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                +62 813-9313-3408
                                            </a>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">Jam Operasional</div>
                                            <div className="text-gray-600 dark:text-gray-300">
                                                Senin - Jumat<br />
                                                08:00 - 16:00 WIB
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
