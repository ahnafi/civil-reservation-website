'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData, SubmissionSchedule, Testing, Transaction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, Banknote, CheckCircle, ClipboardList, Clock, CreditCard, FileText, Hammer, HardHat, XCircle } from 'lucide-react';
import { ToastContainer } from 'react-toastify';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function MainDashboard({
    userSubmissions,
    userTransactions,
    userTestings,
    userUpcomingTestings,
    userWaitResultTestings,
    userSubmissionsCount,
    userTransactionsCount,
    userTestingCount,
}: {
    userSubmissions: SubmissionSchedule[];
    userTransactions: Transaction[];
    userTestings: Testing[];
    userUpcomingTestings: Testing[];
    userWaitResultTestings: Testing[];
    userSubmissionsCount: number;
    userTransactionsCount: number;
    userTestingCount: number;
}) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    function formatToRupiah(value: number): string {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateTimeWithWeekday = (dateString: string) => {
        const date = new Date(dateString);
        const weekdays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const weekday = weekdays[date.getDay()];

        return `${weekday}, ${date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })}`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
            case 'completed':
            case 'approved':
                return <CheckCircle className="size-4 text-green-500" />;
            case 'pending':
            case 'waiting':
            case 'testing':
                return <AlertCircle className="size-4 text-amber-500" />;
            case 'failed':
            case 'cancelled':
            case 'rejected':
                return <XCircle className="size-4 text-red-500" />;
            default:
                return <AlertCircle className="size-4 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'success':
                return 'Berhasil';
            case 'completed':
                return 'Selesai';
            case 'approved':
                return 'Disetujui';
            case 'pending':
                return 'Menunggu';
            case 'submitted':
                return 'Diajukan';
            case 'testing':
                return 'Proses Pengujian';
            case 'failed':
                return 'Gagal';
            case 'cancelled':
                return 'Dibatalkan';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Administrator';
            case 'internal':
                return 'Pengguna Internal';
            case 'external':
                return 'Pengguna Eksternal';
            default:
                return 'Pengguna';
        }
    };

    const summaryCards = [
        {
            title: 'Total Pengajuan Reservasi',
            value: userSubmissionsCount,
            icon: <FileText className="size-6 text-blue-600 dark:text-blue-400" />,
            bgColor: 'bg-blue-50 dark:bg-blue-950/30',
            subtitle: 'Total semua pengajuan reservasi pengujian',
        },
        {
            title: 'Total Transaksi',
            value: userTransactionsCount,
            icon: <CreditCard className="size-7 text-green-600 dark:text-green-400" />,
            bgColor: 'bg-green-50 dark:bg-green-950',
            subtitle: 'Total semua transaksi dari pengajuan reservasi yang sudah disetujui',
        },
        {
            title: 'Total Pengujian',
            value: userTestingCount,
            icon: <HardHat className="size-6 text-orange-600 dark:text-orange-400" />,
            bgColor: 'bg-orange-50 dark:bg-orange-950/30',
            subtitle: 'Semua aktivitas pengujian dari pengajuan reservasi yang sudah disetujui',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="mb-2 flex items-center gap-4">
                    <div className="rounded-full">
                        {/* <img
                            src={`/storage/${user.photo}`}
                            alt={user.name}
                            className="size-16 rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-700"
                        /> */}
                        <Avatar className="text-dark-base large-font-size size-16 border-2 border-neutral-200 object-cover dark:border-neutral-700">
                            <AvatarImage src={`/storage/${user.storage}`} alt={user.name} />
                            <AvatarFallback className="font-semibold">{user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Selamat Datang, {user.name}!</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">Kelola reservasi dan pantau aktivitas laboratorium Anda</p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {getRoleText(user.role)} • {user.email}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="flex flex-wrap justify-evenly gap-4">
                    {summaryCards.map((card, index) => (
                        <div
                            key={index}
                            className="max-w-[350px] min-w-[300px] flex-1 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-3 ${card.bgColor}`}>{card.icon}</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{card.title}</div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</div>
                                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{card.subtitle}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reminder Cards */}
                <div className="space-y-4">
                    {/* Pending Transactions Reminder */}
                    {userTransactions?.filter((transaction) => transaction.status === 'pending').length > 0 && (
                        <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6 shadow-lg dark:border-yellow-700 dark:bg-yellow-950/40">
                            <div className="mb-4 flex items-center gap-3">
                                <AlertCircle className="size-5 text-yellow-700 dark:text-yellow-300" />
                                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Transaksi Menunggu Pembayaran</h3>
                                <span className="rounded-full bg-yellow-300 px-2 py-1 text-xs font-medium text-yellow-900 dark:bg-yellow-700 dark:text-yellow-100">
                                    {userTransactions?.filter((transaction) => transaction.status === 'pending').length} item
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {userTransactions
                                    ?.filter((transaction) => transaction.status === 'pending')
                                    .map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="rounded-lg border border-yellow-300 bg-white p-4 shadow-sm dark:border-yellow-600 dark:bg-neutral-800"
                                        >
                                            <div className="mb-2 flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="size-4 text-yellow-700 dark:text-yellow-300" />
                                                    <span className="text-sm font-medium text-neutral-900 dark:text-white">{transaction.code}</span>
                                                </div>
                                                <span className="rounded-full bg-yellow-200 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200">
                                                    Pending
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-lg font-bold text-neutral-900 dark:text-white">
                                                    {formatToRupiah(transaction.amount)}
                                                </div>
                                                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    Batas: {formatDate(transaction.payment_deadline)}
                                                </div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                                    Dibuat: {formatDate(transaction.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming Testing Reminder */}
                    {userUpcomingTestings && userUpcomingTestings.length > 0 ? (
                        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6 shadow-lg dark:border-blue-700 dark:bg-blue-950/40">
                            <div className="mb-4 flex items-center gap-3">
                                <HardHat className="size-5 text-blue-700 dark:text-blue-300" />
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Pengujian Yang Akan Datang</h3>
                                <span className="rounded-full bg-blue-300 px-2 py-1 text-xs font-medium text-blue-900 dark:bg-blue-700 dark:text-blue-100">
                                    {userUpcomingTestings.length} item
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {userUpcomingTestings.map((testing) => (
                                    <div
                                        key={testing.id}
                                        className="rounded-lg border border-blue-300 bg-white p-4 shadow-sm dark:border-blue-600 dark:bg-neutral-800"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Hammer className="size-4 text-blue-700 dark:text-blue-300" />
                                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {testing.code || testing.submission_code}
                                                </span>
                                            </div>
                                            <span className="rounded-full bg-blue-200 px-2 py-1 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                                                Upcoming
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">Tanggal Pengujian</div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {formatDateTimeWithWeekday(testing.test_date)}
                                            </div>
                                            <div className="text-xs text-neutral-500 dark:text-neutral-500">
                                                Dibuat: {formatDate(testing.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                            <div className="mb-4 flex items-center gap-3">
                                <HardHat className="size-5 text-gray-500 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pengujian Yang Akan Datang</h3>
                            </div>
                            <div className="py-8 text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada pengujian yang dijadwalkan dalam waktu dekat. Semua pengujian Anda sudah selesai atau belum ada yang
                                    direncanakan.
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tests Waiting for Results Reminder */}
                    {userWaitResultTestings && userWaitResultTestings.length > 0 ? (
                        <div className="rounded-xl border border-blue-300 bg-blue-50 p-6 shadow-lg dark:border-blue-700 dark:bg-blue-950/40">
                            <div className="mb-4 flex items-center gap-3">
                                <ClipboardList className="size-5 text-blue-700 dark:text-blue-300" />
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100"> Pengujian Menunggu Hasil</h3>
                                <span className="rounded-full bg-blue-300 px-2 py-1 text-xs font-medium text-blue-900 dark:bg-blue-700 dark:text-blue-100">
                                    {userWaitResultTestings.length} item
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {userWaitResultTestings.map((testing) => (
                                    <div
                                        key={testing.id}
                                        className="rounded-lg border border-blue-300 bg-white p-4 shadow-sm dark:border-blue-600 dark:bg-neutral-800"
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <Clock className="size-4 text-blue-700 dark:text-blue-300" />
                                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                                    {testing.code || testing.submission_code}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">Tanggal Pengujian</div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {formatDateTimeWithWeekday(testing.test_date)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
                            <div className="mb-4 flex items-center gap-3">
                                <ClipboardList className="size-5 text-gray-500 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Pengujian Menunggu Hasil</h3>
                            </div>
                            <div className="py-8 text-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak ada pengujian yang sedang menunggu hasil. Semua pengujian sudah memiliki hasil atau belum ada yang selesai
                                    diuji.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Recent Submissions */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center gap-3">
                            <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Pengajuan Reservasi Terbaru</h3>
                        </div>
                        <div className="max-h-80 space-y-3 overflow-y-auto">
                            {userSubmissions?.slice(0, 5).map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                            <Hammer className="size-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">{submission.code}</div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {submission.company_name} • {formatDate(submission.test_submission_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(submission.status)}
                                        <span className="text-xs font-medium text-neutral-600 capitalize dark:text-neutral-400">
                                            {getStatusText(submission.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!userSubmissions || userSubmissions.length === 0) && (
                                <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">Belum ada reservasi</div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/submissions" // placeholder link
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                            >
                                <FileText className="size-4" />
                                Lihat Semua Pengajuan
                            </a>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center gap-3">
                            <CreditCard className="size-5 text-green-600 dark:text-green-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Transaksi Terbaru</h3>
                        </div>
                        <div className="max-h-80 space-y-3 overflow-y-auto">
                            {userTransactions?.slice(0, 5).map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                                            <Banknote className="size-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">{transaction.code}</div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {formatToRupiah(transaction.amount)} • {formatDate(transaction.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(transaction.status)}
                                        <span className="text-xs font-medium text-neutral-600 capitalize dark:text-neutral-400">
                                            {getStatusText(transaction.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!userTransactions || userTransactions.length === 0) && (
                                <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">Belum ada transaksi</div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/transactions" // placeholder link
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                            >
                                <CreditCard className="size-4" />
                                Lihat Semua Transaksi
                            </a>
                        </div>
                    </div>
                </div>

                {/* Chart and Testing Activities */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Testing Activities */}
                    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-4 flex items-center gap-3">
                            <HardHat className="size-5 text-orange-600 dark:text-orange-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Aktivitas Pengujian</h3>
                        </div>
                        <div className="max-h-80 space-y-3 overflow-y-auto">
                            {userTestings?.slice(0, 5).map((testing) => (
                                <div
                                    key={testing.id}
                                    className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                                            <Clock className="size-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {testing.code || testing.submission_code}
                                            </div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">{formatDateTime(testing.test_date)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(testing.status)}
                                        <span className="text-xs font-medium text-neutral-600 capitalize dark:text-neutral-400">
                                            {getStatusText(testing.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!userTestings || userTestings.length === 0) && (
                                <div className="py-8 text-center text-neutral-500 dark:text-neutral-400">Belum ada aktivitas pengujian</div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/tests" // placeholder link
                                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                            >
                                <HardHat className="size-4" />
                                Lihat Semua Pengujian
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </AppLayout>
    );
}
