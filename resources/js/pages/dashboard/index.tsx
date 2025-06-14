"use client"

import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, SubmissionSchedule, Transaction, Testing, SharedData } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import {
    Banknote,
    Clock,
    HardHat,
    Hammer,
    CheckCircle,
    AlertCircle,
    XCircle,
    FileText,
    CreditCard,
} from "lucide-react"
import { ToastContainer } from "react-toastify"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
]

export default function MainDashboard({
                                          userSubmissions,
                                          userTransactions,
                                          userTestings,
                                          userUpcomingTestings,
                                          userSubmissionsCount,
                                          userTransactionsCount,
                                          userTestingCount,
                                      }: {
    userSubmissions: SubmissionSchedule[]
    userTransactions: Transaction[]
    userTestings: Testing[]
    userUpcomingTestings: Testing[]
    userSubmissionsCount: number
    userTransactionsCount: number
    userTestingCount: number
}) {
    const { auth } = usePage<SharedData>().props
    const user = auth.user

    function formatToRupiah(value: number): string {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatDateTimeWithWeekday = (dateString: string) => {
        const date = new Date(dateString)
        const weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
        const weekday = weekdays[date.getDay()]

        return `${weekday}, ${date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}`
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
            case "completed":
            case "approved":
                return <CheckCircle className="size-4 text-green-500" />
            case "pending":
            case "waiting":
            case "testing":
                return <AlertCircle className="size-4 text-amber-500" />
            case "failed":
            case "cancelled":
            case "rejected":
                return <XCircle className="size-4 text-red-500" />
            default:
                return <AlertCircle className="size-4 text-gray-500" />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "success":
                return "Berhasil"
            case "completed":
                return "Selesai"
            case "approved":
                return "Disetujui"
            case "pending":
                return "Menunggu"
            case "submitted":
                return "Diajukan"
            case "testing":
                return "Proses Pengujian"
            case "failed":
                return "Gagal"
            case "cancelled":
                return "Dibatalkan"
            case "rejected":
                return "Ditolak"
            default:
                return status
        }
    }

    const getRoleText = (role: string) => {
        switch (role) {
            case "admin":
                return "Administrator"
            case "internal":
                return "Pengguna Internal"
            case "external":
                return "Pengguna Eksternal"
            default:
                return "Pengguna"
        }
    }

    const getWeekdayName = (dateString: string) => {
        const date = new Date(dateString)
        const weekdays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
        return weekdays[date.getDay()]
    }

    const upcomingCount = userUpcomingTestings?.length || 0
    const nextUpcoming = userUpcomingTestings?.[0]

    const summaryCards = [
        {
            title: "Total Pengajuan Reservasi",
            value: userSubmissionsCount,
            icon: <FileText className="text-blue-600 dark:text-blue-400 size-6" />,
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
            subtitle: "Total semua pengajuan reservasi pengujian",
        },
        {
            title: "Total Transaksi",
            value: userTransactionsCount,
            icon: <CreditCard className="text-green-600 dark:text-green-400 size-7" />,
            bgColor: "bg-green-50 dark:bg-green-950",
            subtitle: "Total semua transaksi dari pengajuan reservasi yang sudah disetujui",
        },
        {
            title: "Total Pengujian",
            value: userTestingCount,
            icon: <HardHat className="text-orange-600 dark:text-orange-400 size-6" />,
            bgColor: "bg-orange-50 dark:bg-orange-950/30",
            subtitle: "Semua aktivitas pengujian dari pengajuan reservasi yang sudah disetujui",
        },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Section */}
                <div className="flex items-center gap-4 mb-2">
                    <div className="rounded-full">
                        <img
                            src={`/storage/${user.photo}`}
                            alt={user.name}
                            className="size-16 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Selamat Datang, {user.name}!</h1>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Kelola reservasi dan pantau aktivitas laboratorium Anda
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {getRoleText(user.role)} • {user.email}
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="flex flex-wrap justify-evenly gap-4">
                    {summaryCards.map((card, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md transition-shadow flex-1 min-w-[300px] max-w-[350px]"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`rounded-full p-3 ${card.bgColor}`}>{card.icon}</div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{card.title}</div>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-white">{card.value}</div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{card.subtitle}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reminder Cards */}
                <div className="space-y-4">
                    {/* Pending Transactions Reminder */}
                    {userTransactions?.filter((transaction) => transaction.status === "pending").length > 0 && (
                        <div className="rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="size-5 text-yellow-700 dark:text-yellow-300" />
                                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                                    ⚠️ Transaksi Menunggu Pembayaran
                                </h3>
                                <span className="bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 text-xs font-medium px-2 py-1 rounded-full">
                  {userTransactions?.filter((transaction) => transaction.status === "pending").length} item
                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {userTransactions
                                    ?.filter((transaction) => transaction.status === "pending")
                                    .map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-yellow-300 dark:border-yellow-600 shadow-sm"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="size-4 text-yellow-700 dark:text-yellow-300" />
                                                    <span className="font-medium text-neutral-900 dark:text-white text-sm">
                            {transaction.code}
                          </span>
                                                </div>
                                                <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
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

                    {/* Testing Status Reminder */}
                    {userUpcomingTestings && userUpcomingTestings.length > 0 ? (
                        <div className="rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/40 p-6 shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <HardHat className="size-5 text-yellow-700 dark:text-yellow-300" />
                                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                                    Pengujian Yang Akan Datang
                                </h3>
                                <span className="bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100 text-xs font-medium px-2 py-1 rounded-full">
                  {userUpcomingTestings.length} item
                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {userUpcomingTestings.map((testing) => (
                                    <div
                                        key={testing.id}
                                        className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-yellow-300 dark:border-yellow-600 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Hammer className="size-4 text-yellow-700 dark:text-yellow-300" />
                                                <span className="font-medium text-neutral-900 dark:text-white text-sm">
                          {testing.code || testing.submission_code}
                        </span>
                                            </div>
                                            <span className="bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">
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
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <HardHat className="size-5 text-gray-500 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                    Pengujian Yang Akan Datang
                                </h3>
                            </div>
                            <div className="text-center py-8">
                                <div className="text-gray-500 dark:text-gray-400 text-sm">
                                    Tidak ada pengujian yang dijadwalkan dalam waktu dekat. Semua pengujian Anda sudah selesai atau belum
                                    ada yang direncanakan.
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Submissions */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText className="size-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Pengajuan Reservasi Terbaru</h3>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {userSubmissions?.slice(0, 5).map((submission) => (
                                <div
                                    key={submission.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-2">
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
                                        <span className="text-xs font-medium capitalize text-neutral-600 dark:text-neutral-400">
                      {getStatusText(submission.status)}
                    </span>
                                    </div>
                                </div>
                            ))}
                            {(!userSubmissions || userSubmissions.length === 0) && (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">Belum ada reservasi</div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/submissions" // placeholder link
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <FileText className="size-4" />
                                Lihat Semua Pengajuan
                            </a>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="size-5 text-green-600 dark:text-green-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Transaksi Terbaru</h3>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {userTransactions?.slice(0, 5).map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
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
                                        <span className="text-xs font-medium capitalize text-neutral-600 dark:text-neutral-400">
                      {getStatusText(transaction.status)}
                    </span>
                                    </div>
                                </div>
                            ))}
                            {(!userTransactions || userTransactions.length === 0) && (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">Belum ada transaksi</div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/transactions" // placeholder link
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <CreditCard className="size-4" />
                                Lihat Semua Transaksi
                            </a>
                        </div>
                    </div>
                </div>

                {/* Chart and Testing Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Testing Activities */}
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <HardHat className="size-5 text-orange-600 dark:text-orange-400" />
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Aktivitas Pengujian</h3>
                        </div>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {userTestings?.slice(0, 5).map((testing) => (
                                <div
                                    key={testing.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-2">
                                            <Clock className="size-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-neutral-900 dark:text-white">
                                                {testing.code || testing.submission_code}
                                            </div>
                                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {formatDateTime(testing.test_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(testing.status)}
                                        <span className="text-xs font-medium capitalize text-neutral-600 dark:text-neutral-400">
                      {getStatusText(testing.status)}
                    </span>
                                    </div>
                                </div>
                            ))}
                            {(!userTestings || userTestings.length === 0) && (
                                <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
                                    Belum ada aktivitas pengujian
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            <a
                                href="/history/tests" // placeholder link
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
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
    )
}
