import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SubmissionSchedule } from '@/types';
import { parseAndFormatDate } from '@/utils/date-utils';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Beaker, Building2, ClipboardCheck, Clock, FileText, Package } from 'lucide-react';
import React from 'react';

// Helper function to format date
const formatDate = (dateString: string) => {
    if (!dateString) return 'Tanggal tidak valid';
    try {
        return parseAndFormatDate(new Date(dateString));
    } catch {
        return 'Tanggal tidak valid';
    }
};

// Component for info items
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 text-gray-500">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className="text-base font-medium">{value}</p>
        </div>
    </div>
);

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
    let colorClasses = 'bg-gray-100 text-gray-800';

    if (status === 'approved') {
        colorClasses = 'bg-green-100 text-green-800';
    } else if (status === 'submitted') {
        colorClasses = 'bg-yellow-100 text-yellow-800';
    } else if (status === 'rejected') {
        colorClasses = 'bg-red-100 text-red-800';
    }

    return (
        <div className={`rounded-full px-3 py-1 text-sm font-medium ${colorClasses} inline-flex w-fit items-center gap-1.5`}>
            {status === 'approved' && <ClipboardCheck className="h-4 w-4" />}
            {status === 'submitted' && <Clock className="h-4 w-4" />}
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
    );
};

export default function SubmissionDetail({ submissionHistoryDetail }: { submissionHistoryDetail: SubmissionSchedule[] }) {
    // Get the first submission record
    const testRecord: SubmissionSchedule = submissionHistoryDetail[0];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat',
            href: '/history',
        },
        {
            title: 'Pengajuan',
            href: '/history/submissions',
        },
        {
            title: `${testRecord.code}`,
            href: `/history/submission/${testRecord.code}`,
        },
    ];

    // If no data, show a message
    if (!testRecord) {
        return (
            <AppLayout>
                <Head title="Tidak Terdapat Pengajuan" />
                <div className="container mx-auto py-8">
                    <Card className="dark:bg-zinc-900">
                        <CardContent className="p-8 text-center">
                            <p>Data pengajuan tidak ditemukan</p>
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pengajuan ${testRecord.code}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            <h2>Detail Pengajuan</h2>
                                        </CardTitle>
                                        <CardDescription>
                                            <p>Informasi pengajuan pengujian kode {testRecord.code}</p>
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={testRecord.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="mb-6 rounded-lg border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Informasi Pengajuan</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoItem icon={<FileText className="h-5 w-5" />} label="Kode Pengajuan" value={testRecord.code} />
                                        <InfoItem icon={<Building2 className="h-5 w-5" />} label="Nama Perusahaan" value={testRecord.company_name} />
                                        <InfoItem
                                            icon={<Clock className="h-5 w-5" />}
                                            label="Tanggal Pengajuan"
                                            value={formatDate(testRecord.test_submission_date)}
                                        />
                                        <InfoItem
                                            icon={<Beaker className="h-5 w-5" />}
                                            label="Laboratorium"
                                            value={`${testRecord.lab_name} (${testRecord.lab_code})`}
                                        />
                                    </div>
                                </div>
                                <div className="rounded-lg border p-4">
                                    <h3 className="mb-4 text-lg font-medium">Detail Pengujian</h3>
                                    <div className="flex flex-col gap-4">
                                        {testRecord.package_id ? (
                                            <div>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Package className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-medium">Paket Pengujian</h4>
                                                </div>
                                                <div className="ml-7 rounded-lg bg-blue-50 p-2 lg:p-4 dark:bg-blue-900/20">
                                                    <p className="font-medium">{testRecord.package_name}</p>
                                                </div>
                                            </div>
                                        ) : testRecord.test_id ? (
                                            <div>
                                                <div className="mb-2 flex items-center gap-2">
                                                    <Beaker className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-medium">Pengujian Tunggal</h4>
                                                </div>
                                                <div className="ml-7 rounded-lg bg-blue-50 p-2 lg:p-4 dark:bg-blue-900/20">
                                                    <p className="font-medium">{testRecord.test_name}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400">Tidak ada detail pengujian</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="lg:col-span-1">
                        <Card className="gap-0 overflow-hidden p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Status Pengajuan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                {testRecord.status === 'approved' && (
                                    <>
                                        <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <ClipboardCheck className="h-5 w-5 text-green-600" />
                                                <h4 className="font-medium text-green-700 dark:text-green-400">Pengajuan Disetujui</h4>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                engajuan Anda telah disetujui. Silakan menunggu konfirmasi dari admin untuk informasi lebih lanjut terkait pembayaran dan jadwal pengujian.
                                            </p>
                                        </div>
                                        <Button className="w-full">Lihat Jadwal Pengujian</Button>
                                    </>
                                )}

                                {testRecord.status === 'submitted' && (
                                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-yellow-600" />
                                            <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Menunggu Persetujuan</h4>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Pengajuan ini sedang dalam proses review dengan waktu pemrosesan maksimal 2 x 24 jam. Kami akan memberi tahu Anda setelah pengajuan disetujui atau ditolak.
                                        </p>
                                    </div>
                                )}

                                {testRecord.status === 'rejected' && (
                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-red-600" />
                                            <h4 className="font-medium text-red-700 dark:text-red-400">Pengajuan Ditolak</h4>
                                        </div>
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            Pengajuan ini ditolak. Silakan cek email anda untuk informasi lebih lanjut mengenai alasan penolakan.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50 p-2 dark:bg-zinc-800">
                                <div className="w-full text-center text-sm text-gray-500">
                                    Terakhir diperbarui: {formatDate(testRecord.test_submission_date)}
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="mt-6 gap-0 p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800 rounded-t-lg">
                                <CardTitle className="text-lg">Bantuan</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="space-y-4 text-sm">
                                    <p>Jika Anda memiliki pertanyaan tentang pengajuan ini, silakan hubungi tim dukungan kami.</p>

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
