import React, { useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import {
    ArrowLeft, Beaker, Calendar, Check, ClipboardCheck,
    Clock, Download, Edit, FileText, Info, Link2, Star, XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, Testing } from "@/types"
import { parseAndFormatDate } from "@/utils/date-utils"


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
    );
};

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

    // Review form state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);

    // Inertia form for review submission
    const { data, setData, post, put, processing, errors, reset } = useForm({
        rating: testRecord?.reviews?.rating || 0,
        content: testRecord?.reviews?.content || '',
        testing_id: testRecord?.id || 0,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Pengujian",
            href: "/history/tests",
        },
        {
            title: `${testRecord?.code || 'Unknown'}`,
            href: `/history/test/${testRecord?.code || 'unknown'}`,
        },
    ];

    // Update form data when editing existing review
    const initializeEditForm = () => {
        if (testRecord.reviews) {
            setData({
                rating: testRecord.reviews.rating,
                content: testRecord.reviews.content,
                testing_id: testRecord.id,
            });
        }
        setEditMode(true);
        setShowReviewForm(true);
    };

    // Handle review submission (create or update)
    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.rating === 0) {
            alert('Silakan berikan rating untuk pengujian ini');
            return;
        }

        if (data.content.trim() === '') {
            alert('Silakan berikan komentar tentang pengujian ini');
            return;
        }

        if (editMode && testRecord.reviews) {
            // Update existing review
            put(route('reviews.update', testRecord.reviews.id), {
                onSuccess: () => {
                    setReviewSuccess(true);
                    setShowReviewForm(false);
                    setEditMode(false);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                },
                onError: (errors) => {
                    console.error('Review update errors:', errors);
                    if (errors.message) {
                        alert(errors.message);
                    } else {
                        alert('Terjadi kesalahan saat memperbarui review');
                    }
                },
            });
        } else {
            // Create new review
            post(route('reviews.store'), {
                onSuccess: () => {
                    setReviewSuccess(true);
                    setShowReviewForm(false);
                    reset();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                },
                onError: (errors) => {
                    console.error('Review submission errors:', errors);
                    if (errors.message) {
                        alert(errors.message);
                    } else {
                        alert('Terjadi kesalahan saat mengirim review');
                    }
                },
            });
        }
    };

    // Handle star rating
    const handleStarClick = (rating: number) => {
        setData('rating', rating);
    };

    // Reset form and states
    const resetForm = () => {
        setShowReviewForm(false);
        setEditMode(false);
        if (testRecord.reviews) {
            setData({
                rating: testRecord.reviews.rating,
                content: testRecord.reviews.content,
                testing_id: testRecord.id,
            });
        } else {
            setData({ rating: 0, content: '', testing_id: testRecord.id });
        }
    };

    // Check if testing is completed
    const isTestingCompleted = testRecord?.status === 'completed' && testRecord?.completed_at;

    // If no data, show a message
    if (!testRecord) {
        return (
            <AppLayout>
                <Head title="Tidak Terdapat Pengujian" />
                <div className="container mx-auto py-8">
                    <Card className="dark:bg-zinc-900">
                        <CardContent className="p-8 text-center">
                            <p>Data pengujian tidak ditemukan</p>
                            <Button variant="outline" className="mt-4 bg-transparent" asChild>
                                <Link href="/history/testings">
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
                        <Card className="overflow-hidden bg-white p-0 dark:bg-zinc-900">
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
                                            {testRecord.documents.map((document, index) => (
                                                <div key={index} className="rounded-lg border p-4">
                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-medium">Hasil Pengujian {index + 1}</h4>
                                                        </div>
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <a href={`/storage/${document}`} target="_blank" rel="noopener noreferrer">
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Laporan hasil pengujian yang telah dilakukan</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ✅ Enhanced Review Section */}
                                {isTestingCompleted && (
                                    <div className="mb-6 rounded-lg border p-4">
                                        <h3 className="mb-4 text-lg font-medium">Review Pengujian</h3>

                                        {/* Show existing review or form */}
                                        {testRecord.reviews && !showReviewForm ? (
                                            /* Display existing review with edit option */
                                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star
                                                                    key={star}
                                                                    className={`h-5 w-5 ${
                                                                        star <= testRecord.reviews.rating
                                                                            ? 'fill-yellow-400 text-yellow-400'
                                                                            : 'text-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-sm text-gray-500">({testRecord.reviews.rating}/5)</span>
                                                    </div>
                                                    <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                                        Review Anda
                                                    </div>
                                                </div>
                                                <p className="mb-3 text-gray-700 dark:text-gray-300">{testRecord.reviews.content}</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500">Dikirim pada {formatDate(testRecord.reviews.created_at)}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={initializeEditForm}
                                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        Edit Review
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Show review form (new or edit) */
                                            <div>
                                                {!showReviewForm ? (
                                                    /* New review button */
                                                    <div className="text-center">
                                                        <p className="mb-4 text-gray-600 dark:text-gray-400">
                                                            Pengujian telah selesai. Bagaimana pengalaman Anda?
                                                        </p>
                                                        <Button onClick={() => setShowReviewForm(true)} className="inline-flex items-center gap-2">
                                                            <Star className="h-4 w-4" />
                                                            Berikan Review
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    /* Review Form (Create or Edit) */
                                                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                                                        <div className="mb-3 flex items-center justify-between">
                                                            <h4 className="text-md font-medium">
                                                                {editMode ? 'Edit Review Anda' : 'Berikan Review'}
                                                            </h4>
                                                            {editMode && (
                                                                <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                                    Mode Edit
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Rating *
                                                            </label>
                                                            <div className="flex items-center gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => handleStarClick(star)}
                                                                        className="p-1 transition-transform hover:scale-110"
                                                                    >
                                                                        <Star
                                                                            className={`h-8 w-8 ${
                                                                                star <= data.rating
                                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                                    : 'text-gray-300 hover:text-yellow-200'
                                                                            }`}
                                                                        />
                                                                    </button>
                                                                ))}
                                                                <span className="ml-2 text-sm text-gray-500">({data.rating}/5)</span>
                                                            </div>
                                                            {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
                                                        </div>

                                                        <div>
                                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                Komentar *
                                                            </label>
                                                            <Textarea
                                                                value={data.content}
                                                                onChange={(e) => setData('content', e.target.value)}
                                                                placeholder="Bagikan pengalaman Anda tentang layanan pengujian ini..."
                                                                className="min-h-[100px]"
                                                                maxLength={1000}
                                                            />
                                                            <p className="mt-1 text-xs text-gray-500">{data.content.length}/1000 karakter</p>
                                                            {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                                                        </div>

                                                        <div className="flex gap-3">
                                                            <Button type="submit" disabled={processing || data.rating === 0} className="flex-1">
                                                                {processing ? (
                                                                    <>
                                                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                                        {editMode ? 'Memperbarui...' : 'Mengirim...'}
                                                                    </>
                                                                ) : editMode ? (
                                                                    'Perbarui Review'
                                                                ) : (
                                                                    'Kirim Review'
                                                                )}
                                                            </Button>
                                                            <Button type="button" variant="outline" onClick={resetForm} disabled={processing}>
                                                                Batal
                                                            </Button>
                                                        </div>

                                                        {errors.testing_id && <p className="text-sm text-red-500">{errors.testing_id}</p>}
                                                    </form>
                                                )}
                                            </div>
                                        )}

                                        {/* Success message */}
                                        {reviewSuccess && (
                                            <div className="mt-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                                <div className="flex items-center gap-2">
                                                    <Check className="h-5 w-5 text-green-600" />
                                                    <p className="text-green-700 dark:text-green-400">
                                                        {editMode
                                                            ? 'Review berhasil diperbarui. Terima kasih atas feedback Anda!'
                                                            : 'Review berhasil dikirim. Terima kasih atas feedback Anda!'}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Show message for non-completed testing */}
                                {!isTestingCompleted && (
                                    <div className="mb-6 rounded-lg border p-4">
                                        <h3 className="mb-4 text-lg font-medium">Review Pengujian</h3>
                                        <div className="rounded-lg bg-yellow-50 p-4 text-center dark:bg-yellow-900/20">
                                            <div className="mb-2 flex items-center justify-center gap-2">
                                                <Clock className="h-5 w-5 text-yellow-600" />
                                                <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Review Belum Tersedia</h4>
                                            </div>
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                Review dapat diberikan setelah pengujian selesai dilakukan.
                                            </p>
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

                                    {testRecord.status === 'completed' && (
                                        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Check className="h-5 w-5 text-green-600" />
                                                <h4 className="font-medium text-green-700 dark:text-green-400">Pengujian Selesai</h4>
                                            </div>
                                            <p className="text-sm text-green-700 dark:text-green-400">
                                                Pengujian telah selesai pada {formatDate(testRecord.completed_at)}.
                                                {testRecord.documents &&
                                                    testRecord.documents.length > 0 &&
                                                    ' Dokumen hasil pengujian tersedia untuk diunduh.'}
                                            </p>
                                        </div>
                                    )}

                                    {testRecord.status === 'cancelled' && (
                                        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
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
                                <div className="w-full text-center text-xs text-gray-500">
                                    Terakhir diperbarui: {formatDate(testRecord.updated_at)}
                                </div>
                            </CardFooter>
                        </Card>

                        {/* Pengingat Card */}
                        <Card className="mt-6 overflow-hidden bg-white p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <CardTitle className="text-lg">Pengingat Pengujian</CardTitle>
                            </CardHeader>
                            <CardContent className="bg-white p-4 dark:bg-zinc-900">
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

                                </div>
                            </CardContent>
                        </Card>

                        {/* Bantuan Card */}
                        <Card className="mt-6 p-0 dark:bg-zinc-900">
                            <CardHeader className="rounded-t-lg border-b bg-slate-50 p-4 dark:bg-zinc-800">
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
