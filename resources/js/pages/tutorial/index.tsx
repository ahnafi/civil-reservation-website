import AppLayout from "@/layouts/app-layout"
import { Link } from "@inertiajs/react";
import { BreadcrumbItem, SharedData } from '@/types';
import {
    UserCheck,
    ShoppingCart,
    FileText,
    Send,
    Clock,
    Mail,
    CreditCard,
    Calendar,
    Download,
    RefreshCw,
    Users,
    GraduationCap,
    AlertCircle,
    CheckCircle2,
} from "lucide-react"
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Panduan Reservasi",
        href: "/tutorial",
    },
]

export default function Tutorial() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panduan Reservasi" />
            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-4">Panduan Reservasi Pengujian</h1>
                    <p className="text-lg text-muted-foreground">
                        Ikuti langkah-langkah berikut untuk melakukan reservasi pengujian
                    </p>
                </div>


                {(user.role==='external' || user.role==='admin') && (
                    <div className="bg-card rounded-lg dark:bg-zinc-900 shadow-md border border-border p-6 mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="h-8 w-8 text-blue-600" />
                            <h2 className="text-2xl font-bold text-card-foreground">Pengajuan Eksternal</h2>
                        </div>

                        <div className="space-y-6">
                            {/* Step 1-2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">1-2</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <h3 className="font-semibold text-card-foreground">Registrasi & Login</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Pastikan pengguna telah mendaftar akun di website dan akun tersebut sudah terverifikasi. Login
                                        menggunakan akun yang telah dibuat dan diverifikasi.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3-4 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">3-4</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        <h3 className="font-semibold text-card-foreground">Pilih Pengujian & Paket</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Buka halaman <Link className="underline text-blue-500" href="/tests">Pengujian</Link> untuk melihat katalog pengujian yang tersedia atau halaman <Link className="underline text-blue-500" href="/packages">Paket</Link> untuk
                                        paket pengujian. Klik pada salah satu untuk melihat detailnya, lalu tekan tombol "Tambahkan ke
                                        Keranjang".
                                    </p>
                                </div>
                            </div>

                            {/* Step 5-6 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">5-6</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <h3 className="font-semibold text-card-foreground">Review & Lanjutkan</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Buka halaman <Link className="underline text-blue-500" href="/orders/cart">Reservasi Pengujian</Link> untuk melihat isi keranjang dan detail pengujian yang telah
                                        dipilih. Jika sudah sesuai, klik tombol "Lanjutkan ke Formulir Pesanan".
                                    </p>
                                </div>
                            </div>

                            {/* Step 7 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">7</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <h3 className="font-semibold text-card-foreground">Isi Formulir Pengajuan</h3>
                                    </div>
                                    <p className="text-muted-foreground mb-3">Lengkapi informasi berikut pada formulir:</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                        <li>Nama Perusahaan</li>
                                        <li>Nama Proyek</li>
                                        <li>Alamat Proyek</li>
                                        <li>Jadwal Pelaksanaan Pengujian</li>
                                        <li>Lampiran dokumen (opsional)</li>
                                        <li>Catatan Tambahan (opsional)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Step 8-9 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">8-9</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                        <h3 className="font-semibold text-card-foreground">Kirim & Tunggu Review</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Klik tombol "Kirim Pengajuan" untuk mengirimkan permohonan. Pengajuan akan direview admin dalam
                                        maksimal 2 x 24 jam. Pantau status melalui halaman <Link className="underline text-blue-500" href="/history/submissions">Riwayat Pengajuan</Link>.
                                    </p>
                                </div>
                            </div>

                            {/* Step 10-12 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">10-12</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        <h3 className="font-semibold text-card-foreground">Notifikasi & Pembayaran</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Jika diterima, Anda akan menerima notifikasi email. Admin akan membuat transaksi pembayaran yang dapat
                                        dilihat di halaman <Link className="underline text-blue-500" href="/history/transactions">Riwayat Transaksi</Link>. Setelah pembayaran, admin akan menjadwalkan pengujian.
                                    </p>
                                </div>
                            </div>

                            {/* Step 13-15 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">13-15</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        <RefreshCw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        <h3 className="font-semibold text-card-foreground">Pelaksanaan & Hasil</h3>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Persiapkan pengujian sebaik mungkin. Setelah selesai, dokumen hasil dapat diunduh melalui halaman <Link className="underline text-blue-500" href="/history/testings">Riwayat Pengujian</Link>. Untuk pengujian ulang, gunakan tombol "Ajukan Pengujian Ulang" pada detail pengujian
                                        sebelumnya.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Catatan Penting:</h4>
                            </div>
                            <p className="text-yellow-700 dark:text-yellow-300">
                                Sebelum memilih jadwal pelaksanaan pengujian, disarankan untuk mengecek ketersediaan slot melalui halaman <Link className="underline text-blue-500" href="/schedule">Jadwal Pengujian</Link> terlebih dahulu.
                            </p>
                        </div>
                    </div>
                )}

                {(user.role==='internal' || user.role==='admin') && (
                    <div className="bg-card rounded-lg dark:bg-zinc-900 shadow-md border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-400" />
                        <h2 className="text-2xl font-bold text-card-foreground">Pengajuan Internal</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Step 1-2 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">1-2</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    <h3 className="font-semibold text-card-foreground">Registrasi & Login Internal</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Pastikan akun telah terdaftar, terverifikasi, dan memiliki role "Internal". Login menggunakan akun
                                    yang sudah terdaftar dan terverifikasi.
                                </p>
                            </div>
                        </div>

                        {/* Step 3-5 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">3-5</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                    <h3 className="font-semibold text-card-foreground">Pilih Pengujian & Review</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Pilih pengujian dari halaman <Link className="underline text-blue-500" href="/tests">Pengujian</Link> atau halaman <Link className="underline text-blue-500" href="/packages">Paket</Link>, tambahkan ke keranjang, lalu review di halaman <Link className="underline text-blue-500" href="/orders/cart">Reservasi Pengujian</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Step 6-7 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">6-7</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="font-semibold text-card-foreground">Isi Formulir Internal</h3>
                                </div>
                                <p className="text-muted-foreground mb-3">Lengkapi informasi berikut pada formulir:</p>
                                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                                    <li>Nama Mahasiswa/Dosen</li>
                                    <li>Program Studi</li>
                                    <li>Judul Penelitian</li>
                                    <li>Jumlah Personel</li>
                                    <li>Dosen Pembimbing</li>
                                    <li>Tanggal Pelaksanaan Pengujian</li>
                                    <li>Lampiran dokumen (opsional)</li>
                                    <li>Catatan Tambahan (opsional)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Step 8-11 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">8-11</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Send className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-semibold text-card-foreground">Kirim & Penjadwalan</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Kirim pengajuan dan tunggu review admin (maksimal 2 x 24 jam). Jika disetujui, Anda akan menerima
                                    notifikasi email dan admin akan menjadwalkan pengujian. Pantau status pengajuan melalui halaman <Link className="underline text-blue-500" href="/history/submissions">Riwayat Pengajuan</Link>.
                                </p>
                            </div>
                        </div>

                        {/* Step 12-13 */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">12-13</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                    <h3 className="font-semibold text-card-foreground">Pelaksanaan & Hasil</h3>
                                </div>
                                <p className="text-muted-foreground">
                                    Persiapkan pengujian dengan baik. Setelah selesai, hasil pengujian dapat diakses dan diunduh melalui
                                    halaman <Link className="underline text-blue-500" href="/history/testings">Riwayat Pengujian</Link>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Catatan Penting:</h4>
                            </div>
                            <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Cek ketersediaan slot melalui halaman <Link className="underline text-blue-500" href="/schedule">Jadwal Pengujian</Link> sebelum memilih jadwal</li>
                                <li>• Akun dengan email @unsoed.ac.id otomatis memiliki role "Internal"</li>
                                <li>• Jika belum memiliki role "Internal", ajukan permohonan perubahan role kepada admin</li>
                                <li>• Sangat disarankan menggunakan email @unsoed.ac.id untuk mempercepat verifikasi</li>
                            </ul>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </AppLayout>
    )
}
