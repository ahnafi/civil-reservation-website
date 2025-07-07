import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, Testing } from "@/types"
import { parseAndFormatDate } from "@/utils/date-utils"
import { Head, Link } from "@inertiajs/react"
import {
    ArrowLeft,
    Beaker,
    Calendar,
    Check,
    ClipboardCheck,
    Clock,
    Download,
    FileText,
    Info,
    Link2,
} from "lucide-react"
import type React from "react"

// Format date helper
const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-"
    try {
        return parseAndFormatDate(new Date(dateString))
    } catch (error) {
        return `Format tanggal tidak valid: ${error}`
    }
}

// Get display status and color based on status and test_date (same logic as datatable)
const getStatusDisplay = (status: string, testDate: string) => {
    const testDateObj = new Date(testDate)
    const now = new Date()

    if (status === "completed") {
        return {
            displayStatus: "Selesai",
            colorClasses: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            icon: <Check className="h-4 w-4" />,
        }
    } else if (status === "testing") {
        if (now < testDateObj) {
            return {
                displayStatus: "Menunggu Pengujian",
                colorClasses: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
                icon: <Clock className="h-4 w-4" />,
            }
        } else {
            return {
                displayStatus: "Memproses Hasil",
                colorClasses: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                icon: <Beaker className="h-4 w-4" />,
            }
        }
    }

    // Default fallback
    return {
        displayStatus: "Tidak Diketahui",
        colorClasses: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        icon: <Info className="h-4 w-4" />,
    }
}

// Status badge component with updated logic
const StatusBadge = ({ status, testDate }: { status: string; testDate: string }) => {
    const { displayStatus, colorClasses, icon } = getStatusDisplay(status, testDate)

    return (
        <div
            className={`small-font-size inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 font-medium ${colorClasses}`}
        >
            {icon}
            {displayStatus}
        </div>
    )
}

// Info item component
const InfoItem = ({
                      icon,
                      label,
                      value,
                  }: { icon: React.ReactNode; label: string; value: string | React.ReactNode }) => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
}

export default function TestingDetail({ testingHistoryDetail }: { testingHistoryDetail: Testing[] }) {
    // Get the first test record
    const testRecord: Testing = testingHistoryDetail[0]

    console.info("Testing Detail Page - Test Record:", testRecord)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pengujian",
            href: "/history/tests",
        },
        {
            title: `${testRecord.code}`,
            href: `/history/test/${testRecord.code}`,
        },
    ]

    // If no data, show a message
    if (!testRecord) {
        return (
            <AppLayout>
                <Head title="Tidak Terdapat Pengujian" />
                <div className="container mx-auto py-8">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p>Data pengujian tidak ditemukan</p>
                            <Button variant="outline" className="mt-4 bg-transparent" asChild>
                                <Link href="/history/tests">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Kembali
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        )
    }

    // Calculate test progress based on status and test_date
    const getProgressPercentage = (status: string, testDate: string) => {
        const testDateObj = new Date(testDate)
        const now = new Date()

        if (status === "completed") {
            return 100
        } else if (status === "testing") {
            if (now < testDateObj) {
                return 25 // Menunggu Pengujian
            } else {
                return 75 // Memproses Hasil
            }
        }
        return 0 // Default
    }

    const progressPercentage = getProgressPercentage(testRecord.status, testRecord.test_date)
    const { displayStatus } = getStatusDisplay(testRecord.status, testRecord.test_date)

    // Get timeline step status
    const getTimelineStepStatus = (stepIndex: number, status: string, testDate: string) => {
        const testDateObj = new Date(testDate)
        const now = new Date()

        if (status === "completed") {
            return stepIndex <= 3 // All steps completed
        } else if (status === "testing") {
            if (now < testDateObj) {
                return stepIndex <= 1 // Up to "Pengujian Dijadwalkan"
            } else {
                return stepIndex <= 2 // Up to "Pengujian dalam Proses"
            }
        }
        return stepIndex <= 0 // Only first step
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pengujian ${testRecord.code}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2">
                        <Card className="gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            <h2>Detail Pengujian</h2>
                                        </CardTitle>
                                        <CardDescription>
                                            <p>{testRecord.code}</p>
                                        </CardDescription>
                                    </div>
                                    <StatusBadge status={testRecord.status} testDate={testRecord.test_date} />
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
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
                                            value={formatDate(testRecord.completed_at) || "Belum selesai"}
                                        />
                                        <InfoItem
                                            icon={<Link2 className="h-5 w-5 text-blue-600" />}
                                            label="ID Pengajuan"
                                            value={
                                                <Link
                                                    href={`/history/submission/${testRecord.submission_code}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat Pengajuan #{testRecord.submission_code}
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

                                {/* Timeline pengujian - Improved stepper look */}
                                <div className="rounded-lg border mb-6 p-4">
                                    <h3 className="mb-6 text-lg font-medium">Timeline Pengujian</h3>
                                    <div className="space-y-6">
                                        {/* Step 1: Pengajuan Diterima */}
                                        <div className="relative flex items-start">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                                                <Check className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Pengajuan Diterima</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(testRecord.created_at)}</p>
                                            </div>
                                            <div className="absolute left-5 top-10 h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                        </div>

                                        {/* Step 2: Pengujian Dijadwalkan */}
                                        <div className="relative flex items-start">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                                                    getTimelineStepStatus(1, testRecord.status, testRecord.test_date)
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Pengujian Dijadwalkan</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(testRecord.test_date)}</p>
                                            </div>
                                            <div className="absolute left-5 top-10 h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                        </div>

                                        {/* Step 3: Pengujian dalam Proses */}
                                        <div className="relative flex items-start">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                                                    getTimelineStepStatus(2, testRecord.status, testRecord.test_date)
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                <Beaker className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Pengujian dalam Proses</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testRecord.status === "testing" && new Date() >= new Date(testRecord.test_date)
                                                        ? "Sedang dalam proses"
                                                        : testRecord.status === "completed"
                                                            ? "Selesai diproses"
                                                            : "Menunggu jadwal pengujian"}
                                                </p>
                                            </div>
                                            <div className="absolute left-5 top-10 h-6 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                                        </div>

                                        {/* Step 4: Pengujian Selesai */}
                                        <div className="relative flex items-start">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${
                                                    getTimelineStepStatus(3, testRecord.status, testRecord.test_date)
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                <ClipboardCheck className="h-5 w-5" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-gray-900 dark:text-white">Pengujian Selesai</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {testRecord.completed_at ? formatDate(testRecord.completed_at) : "Belum selesai"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                                        <a href={`/storage/${testRecord.documents}`} target="_blank" rel="noreferrer">
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-500">Laporan hasil pengujian yang telah dilakukan</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="lg:col-span-1">
                        <Card className="gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Status Pengujian</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm font-medium">Progres</span>
                                        <span className="text-sm text-gray-500">{progressPercentage}%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-in-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Scenario 1: Completed */}
                                    {testRecord.status === "completed" && (
                                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <h4 className="font-medium text-green-700 dark:text-green-400">Selesai</h4>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                Pengujian telah selesai dilakukan pada {formatDate(testRecord.completed_at)}. Hasil pengujian
                                                dapat diunduh dari bagian dokumen.
                                            </p>
                                        </div>
                                    )}

                                    {/* Scenario 2: Testing - Before test date (Menunggu Pengujian) */}
                                    {testRecord.status === "testing" && new Date() < new Date(testRecord.test_date) && (
                                        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Menunggu Pengujian</h4>
                                            </div>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                Pengujian telah dijadwalkan pada {formatDate(testRecord.test_date)}. Silakan mempersiapkan
                                                sampel untuk pengujian dan datang tepat waktu.
                                            </p>
                                        </div>
                                    )}

                                    {/* Scenario 3: Testing - After test date (Memproses Hasil) */}
                                    {testRecord.status === "testing" && new Date() >= new Date(testRecord.test_date) && (
                                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Beaker className="h-5 w-5 text-blue-600" />
                                                <h4 className="font-medium text-blue-700 dark:text-blue-400">Memproses Hasil</h4>
                                            </div>
                                            <p className="text-sm text-blue-700 dark:text-blue-400">
                                                Pengujian sedang dalam tahap pemrosesan hasil. Kami akan memberi tahu Anda ketika hasil
                                                pengujian telah siap.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t bg-slate-50 p-2 dark:bg-zinc-800">
                                <div className="small-font-size w-full text-center text-gray-500">
                                    Terakhir diperbarui: {formatDate(testRecord.updated_at)}
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="mt-6 gap-0 overflow-hidden p-0 bg-white dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Pengingat Pengujian</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 bg-white dark:bg-zinc-900">
                                <div className="space-y-4">
                                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                                        <h4 className="mb-2 flex items-center gap-2 font-medium text-blue-700 dark:text-blue-400">
                                            <ClipboardCheck className="h-5 w-5 text-blue-600" />
                                            Hal yang Perlu Diperhatikan
                                        </h4>
                                        <ul className="small-font-size list-inside list-disc space-y-1 text-blue-700 dark:text-blue-400">
                                            <li>Pastikan sampel pengujian telah disiapkan dengan baik</li>
                                            <li>Datang tepat waktu sesuai jadwal yang ditentukan</li>
                                            <li>Hasil pengujian akan tersedia setelah proses selesai</li>
                                        </ul>
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
                                    <p>Jika Anda memiliki pertanyaan tentang pengujian ini, silakan hubungi tim dukungan kami.</p>

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
                                                Senin - Jumat
                                                <br />
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
    )
}
