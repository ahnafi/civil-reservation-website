"use client"

import { Head, Link } from "@inertiajs/react"
import { AlertCircle, Calendar, CheckCircle2, Eye, FileText, Info, Mail } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Pesanan",
        href: "/orders",
    },
    {
        title: "Keranjang",
        href: "/orders/cart",
    },
    {
        title: "Formulir Pesanan",
        href: "/orders/form",
    },
    {
        title: "Konfirmasi Pengajuan",
        href: "/orders/checkout",
    },
]

export default function Checkout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Konfirmasi Pengajuan" />

            <div className="min-h-screen bg-zinc-50 dark:bg-black">
                <div className="container mx-auto px-4 py-8">
                    {/* Enhanced Stepper */}
                    <div className="mb-12">
                        <div className="relative">
                            <div className="absolute top-6 left-0 h-0.5 w-full bg-zinc-200 dark:bg-zinc-700"></div>
                            <div className="relative mx-auto flex max-w-2xl justify-between">
                                <div className="group flex flex-col items-center">
                                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">Keranjang</span>
                                    <Badge
                                        variant="secondary"
                                        className="mt-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    >
                                        Selesai
                                    </Badge>
                                </div>
                                <div className="group flex flex-col items-center">
                                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <span className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">Formulir Pesanan</span>
                                    <Badge
                                        variant="secondary"
                                        className="mt-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    >
                                        Selesai
                                    </Badge>
                                </div>
                                <div className="group flex flex-col items-center">
                                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <span className="mt-3 text-sm font-semibold text-green-600 dark:text-green-400">Konfirmasi</span>
                                    <Badge className="mt-1 bg-green-600 text-xs text-white border-0">Berhasil</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        {/* Success Message */}
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">Pengajuan Berhasil Dikirim!</h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-300">
                                Terima kasih atas pengajuan Anda. Kami akan meninjau dan memproses permohonan Anda segera.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Main Content */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Process Information */}
                                <Card className="border-0 bg-white dark:bg-zinc-900 shadow-lg">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                <Info className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-zinc-900 dark:text-white">Proses Selanjutnya</CardTitle>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    Tahapan yang akan dilakukan setelah pengajuan
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50">
                                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                                Tim admin kami akan meninjau pengajuan Anda dalam waktu 1-2 hari kerja. Anda akan menerima
                                                notifikasi melalui email dan dapat memantau status di riwayat pengajuan.
                                            </AlertDescription>
                                        </Alert>

                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">1</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-zinc-900 dark:text-white">Review Dokumen</h4>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                        Admin akan meninjau kelengkapan dokumen dan informasi yang Anda berikan
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">2</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-zinc-900 dark:text-white">Konfirmasi & Jadwal</h4>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                        Jika disetujui, Anda akan dihubungi untuk konfirmasi jadwal pengujian
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-4 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-800">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">3</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-zinc-900 dark:text-white">Notifikasi Email</h4>
                                                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                        Semua update status akan dikirimkan ke email yang Anda daftarkan
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row">
                                    <Link href="/history/submissions">
                                        <Button
                                            variant="outline"
                                            className="h-12 w-full px-6 sm:w-auto border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-transparent"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Riwayat Pengajuan
                                        </Button>
                                    </Link>
                                    <Link href="/orders/cart">
                                        <Button className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 px-8 text-white sm:w-auto">
                                            Buat Pengajuan Baru
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-6 space-y-6">
                                    {/* Contact Information */}
                                    <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg text-zinc-900 dark:text-white">
                                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                Informasi Kontak
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <div className="font-medium text-zinc-900 dark:text-white">Email Support</div>
                                                    <a
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                        href="mailto:laboratoriumsipil.unsoed@gmail.com"
                                                    >
                                                        laboratoriumsipil.unsoed@gmail.com
                                                    </a>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-zinc-900 dark:text-white">Telepon</div>
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
                                                    <div className="font-medium text-zinc-900 dark:text-white">Jam Operasional</div>
                                                    <div className="text-zinc-600 dark:text-zinc-300">
                                                        Senin - Jumat
                                                        <br />
                                                        08:00 - 16:00 WIB
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Tips Card */}
                                    <Card className="border-0 shadow-lg bg-white dark:bg-zinc-900">
                                        <CardHeader>
                                            <CardTitle className="flex items-center text-lg text-zinc-900 dark:text-white">
                                                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                Tips Penting
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3 text-sm">
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                        Periksa email secara berkala untuk update status
                                                    </p>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                        Siapkan jadwal kosong untuk koordinasi pengujian
                                                    </p>
                                                </div>
                                                <div className="flex items-start space-x-2">
                                                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                        <FileText className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <p className="text-zinc-600 dark:text-zinc-300">
                                                        Simpan ID pengajuan untuk referensi komunikasi
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
    )
}
