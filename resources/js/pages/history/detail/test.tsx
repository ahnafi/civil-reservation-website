import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Testing } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowLeft, Beaker, Calendar, Check, ClipboardCheck, Clock, Download, FileText, Info, Link2, XCircle } from 'lucide-react';

// Format date helper
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    try {
        return format(parseISO(dateString), 'd MMMM yyyy', { locale: id });
    } catch (error) {
        return `Format tanggal tidak valid: ${error}`;
    }
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    let colorClasses = 'bg-gray-100 text-gray-800';
    let icon = <Info className="h-4 w-4" />;

    if (status === 'completed') {
        colorClasses = 'bg-green-100 text-green-800';
        icon = <Check className="h-4 w-4" />;
    } else if (status === 'testing') {
        colorClasses = 'bg-blue-100 text-blue-800';
        icon = <Beaker className="h-4 w-4" />;
    } else if (status === 'pending') {
        colorClasses = 'bg-yellow-100 text-yellow-800';
        icon = <Clock className="h-4 w-4" />;
    } else if (status === 'cancelled') {
        colorClasses = 'bg-red-100 text-red-800';
        icon = <XCircle className="h-4 w-4" />;
    }

    return (
        <div className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${colorClasses}`}>
            {icon}
            {status === 'testing' ? 'Dalam Proses' : status.charAt(0).toUpperCase() + status.slice(1)}
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

export default function TestDetail({ testHistoryDetail }: { testHistoryDetail: Testing[] }) {
    // Get the first test record
    const testRecord: Testing = testHistoryDetail[0];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat',
            href: '/history',
        },
        {
            title: 'Pengujian',
            href: '/history/tests',
        },
        {
            title: `${testRecord.code}`,
            href: `/history/test/${testRecord.code}`,
        },
    ];

    // If no data, show a message
    if (!testRecord) {
        return (
            <AppLayout>
                <Head title="Tidak Terdapat Pengujian" />
                <div className="container mx-auto py-8">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p>Data pengujian tidak ditemukan</p>
                            <Button variant="outline" className="mt-4" asChild>
                                <Link href="/history/tests">
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

    // Calculate test progress based on status
    const getProgressPercentage = (status: string) => {
        switch (status) {
            case 'pending':
                return 0;
            case 'testing':
                return 50;
            case 'completed':
                return 100;
            case 'cancelled':
                return 0;
            default:
                return 0;
        }
    };

    const progressPercentage = getProgressPercentage(testRecord.status);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pengujian ${testRecord.code}`} />
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2">
                        <Card className="gap-0 overflow-hidden p-0">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-slate-800">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            <h2>Detail Pengujian</h2>
                                        </CardTitle>
                                        <CardDescription>
                                            <p>{testRecord.code}</p>
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={testRecord.status} />
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                <div className="mb-6 rounded-lg border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Informasi Pengujian</h3>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <InfoItem
                                            icon={<FileText className="h-5 w-5 text-blue-600" />}
                                            label="Kode Pengujian"
                                            value={testRecord.code}
                                        />
                                        <InfoItem
                                            icon={<Calendar className="h-5 w-5 text-blue-600" />}
                                            label="Tanggal Pengujian"
                                            value={formatDate(testRecord.test_date)}
                                        />
                                        <InfoItem
                                            icon={<Clock className="h-5 w-5 text-blue-600" />}
                                            label="Tanggal Selesai"
                                            value={formatDate(testRecord.completed_at) || 'Belum selesai'}
                                        />
                                        <InfoItem
                                            icon={<Link2 className="h-5 w-5 text-blue-600" />}
                                            label="ID Pengajuan"
                                            value={
                                                <Link
                                                    href={`/history/submission/${testRecord.submission_id}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Pengajuan #{testRecord.submission_id}
                                                </Link>
                                            }
                                        />
                                    </div>
                                </div>

                                {testRecord.note && (
                                    <div className="mb-6 rounded-lg border p-4">
                                        <h3 className="mb-2 text-lg font-medium">Catatan</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{testRecord.note}</p>
                                    </div>
                                )}

                                {testRecord.documents && (
                                    <div className="mb-6 rounded-lg border p-4">
                                        <h3 className="mb-4 text-lg font-medium">Dokumen Hasil Pengujian</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="rounded-lg border p-4">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-blue-600" />
                                                        <h4 className="font-medium">Hasil Pengujian</h4>
                                                    </div>
                                                    <Button size="sm" variant="ghost" asChild>
                                                        <a href={`/storage/${testRecord.documents}`} target="_blank">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-500">Laporan hasil pengujian yang telah dilakukan</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Timeline pengujian */}
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Timeline Pengujian</h3>
                                    <div className="space-y-4">
                                        <div className="relative pl-8">
                                            <div className="absolute top-1.5 left-0 h-4 w-4 rounded-full bg-green-500"></div>
                                            <div className="absolute top-5 left-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                            <h4 className="font-medium">Pengajuan Diterima</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(testRecord.created_at)}</p>
                                        </div>

                                        <div className="relative pl-8">
                                            <div
                                                className={`absolute top-1.5 left-0 h-4 w-4 rounded-full ${testRecord.status === 'pending' || testRecord.status === 'testing' || testRecord.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}
                                            ></div>
                                            <div className="absolute top-5 left-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                            <h4 className="font-medium">Pengujian Dijadwalkan</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(testRecord.test_date)}</p>
                                        </div>

                                        <div className="relative pl-8">
                                            <div
                                                className={`absolute top-1.5 left-0 h-4 w-4 rounded-full ${testRecord.status === 'testing' || testRecord.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}
                                            ></div>
                                            <div className="absolute top-5 left-2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                            <h4 className="font-medium">Pengujian dalam Proses</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {testRecord.status === 'testing'
                                                    ? 'Sedang dalam proses'
                                                    : testRecord.status === 'completed'
                                                      ? 'Selesai'
                                                      : 'Menunggu'}
                                            </p>
                                        </div>

                                        <div className="relative pl-8">
                                            <div
                                                className={`absolute top-1.5 left-0 h-4 w-4 rounded-full ${testRecord.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}
                                            ></div>
                                            <h4 className="font-medium">Pengujian Selesai</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {testRecord.completed_at ? formatDate(testRecord.completed_at) : 'Belum selesai'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="lg:col-span-1">
                        <Card className="overflow-hidden p-0 gap-0">
                            <CardHeader className="border-b p-4 bg-slate-50 dark:bg-slate-800">
                                <CardTitle className="text-lg">Status Pengujian</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Progres</span>
                                        <span className="text-sm text-gray-500">{progressPercentage}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className={`h-full rounded-full ${testRecord.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-600'}`}
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {testRecord.status === 'completed' && (
                                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <h4 className="font-medium text-green-700 dark:text-green-400">Pengujian Selesai</h4>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                Pengujian telah selesai dilakukan pada {formatDate(testRecord.completed_at)}. Hasil pengujian dapat
                                                diunduh dari bagian dokumen.
                                            </p>
                                        </div>
                                    )}

                                    {testRecord.status === 'testing' && (
                                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Beaker className="h-5 w-5 text-blue-600" />
                                                <h4 className="font-medium text-blue-700 dark:text-blue-400">Dalam Proses Pengujian</h4>
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                                Pengujian sedang dalam proses. Kami akan memberi tahu Anda ketika pengujian telah selesai.
                                            </p>
                                        </div>
                                    )}

                                    {testRecord.status === 'pending' && (
                                        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Menunggu Jadwal</h4>
                                            </div>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                Pengujian telah dijadwalkan pada {formatDate(testRecord.test_date)}. Silakan mempersiapkan sampel
                                                untuk pengujian.
                                            </p>
                                        </div>
                                    )}

                                    {testRecord.status === 'cancelled' && (
                                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <XCircle className="h-5 w-5 text-red-600" />
                                                <h4 className="font-medium text-red-700 dark:text-red-400">Pengujian Dibatalkan</h4>
                                            </div>
                                            <p className="text-sm text-red-700 dark:text-red-400">
                                                Pengujian ini telah dibatalkan. Silakan hubungi admin untuk informasi lebih lanjut.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50 p-2 dark:bg-slate-800">
                                <div className="w-full text-center text-sm text-gray-500">
                                    Terakhir diperbarui: {formatDate(testRecord.updated_at)}
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="mt-6 overflow-hidden p-0 gap-0">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-slate-800">
                                <CardTitle className="text-lg">Pengingat Pengujian</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                        <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400">
                                            <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                            Hal yang Perlu Diperhatikan
                                        </h4>
                                        <ul className="list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-400">
                                            <li>Pastikan sampel pengujian telah disiapkan dengan baik</li>
                                            <li>Datang tepat waktu sesuai jadwal yang ditentukan</li>
                                            <li>Hasil pengujian akan tersedia setelah proses selesai</li>
                                        </ul>
                                    </div>

                                    <Button variant="outline" className="w-full">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Tambahkan ke Kalender
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6 overflow-hidden p-0 gap-0">
                            <CardHeader className="border-b bg-slate-50 dark:bg-slate-800 p-4">
                                <CardTitle className="text-lg">Bantuan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4 text-sm">
                                    <p>Jika Anda memiliki pertanyaan tentang pengujian ini, silakan hubungi tim dukungan kami.</p>
                                    <Button variant="outline" className="w-full">
                                        Hubungi Dukungan
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
