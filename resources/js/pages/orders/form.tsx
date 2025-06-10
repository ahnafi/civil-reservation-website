import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-utils';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    Building2,
    CalendarIcon,
    CheckCircle2,
    ClipboardList,
    Clock,
    CreditCard,
    FileText,
    MapPin,
    ShoppingCart,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pesanan',
        href: '/orders',
    },
    {
        title: 'Keranjang',
        href: '/orders/cart',
    },
    {
        title: 'Formulir Pesanan',
        href: '/orders/form',
    },
];

type ReservationForm = {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: Date | undefined;
    user_note: string;
};

type SimplifiedTest = {
    test_id: number;
    unit: number;
};

type SimplifiedPackage = {
    package_id: number;
};

type SubmissionData = {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: string | undefined;
    user_note: string;
    submission_tests: SimplifiedTest[];
    submission_packages: SimplifiedPackage[];
};

export default function ReservationForm() {
    const [cartEmpty, setCartEmpty] = useState(false);
    const [reservationForm, setReservationForm] = useState<ReservationForm>({
        company_name: '',
        project_name: '',
        project_address: '',
        test_submission_date: undefined,
        user_note: '',
    });
    const { data, setData, post, processing, errors, reset } = useForm<SubmissionData>({
        company_name: '',
        project_name: '',
        project_address: '',
        test_submission_date: undefined,
        user_note: '',
        submission_tests: [],
        submission_packages: [],
    });

    // Helper function untuk format tanggal ke YYYY-MM-DD
    const formatDateForSubmission = (date: Date | undefined): string | undefined => {
        if (!date) return undefined;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const savedForm = localStorage.getItem('reservation_form');
        if (savedForm) {
            try {
                const parsedForm = JSON.parse(savedForm);
                if (parsedForm.test_submission_date) {
                    const [year, month, day] = parsedForm.test_submission_date.split('-');
                    parsedForm.test_submission_date = new Date(Number(year), Number(month) - 1, Number(day));
                }

                setReservationForm(parsedForm);
            } catch (error) {
                console.error('Error parsing saved form data:', error);
                localStorage.removeItem('reservation_form');
            }
        }
    }, []);

    useEffect(() => {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        if (Object.values(reservationForm).some((val) => val !== undefined && val !== '')) {
            const sanitized = {
                ...reservationForm,
                test_submission_date: reservationForm.test_submission_date
                    ? formatDateForSubmission(reservationForm.test_submission_date)
                    : undefined,
            };
            localStorage.setItem('reservation_form', JSON.stringify(sanitized));
        }

        if (tests.length > 0 || packages.length > 0) {
            setData({
                company_name: reservationForm.company_name,
                project_name: reservationForm.project_name,
                project_address: reservationForm.project_address,
                test_submission_date: formatDateForSubmission(reservationForm.test_submission_date),
                user_note: reservationForm.user_note,
                submission_tests: tests.map((test: SimplifiedTest) => ({
                    test_id: test.test_id,
                    unit: test.unit,
                })),
                submission_packages: packages.map((pkg: SimplifiedPackage) => ({
                    package_id: pkg.package_id,
                })),
            });
        } else {
            setCartEmpty(true);
        }
    }, [reservationForm]);

    const handleChangeReservationForm = (field: keyof ReservationForm, value: string | Date | undefined) => {
        setReservationForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (cartEmpty) {
            return;
        }

        post(route('createSubmission'), {
            onSuccess: () => {
            // Saya ingin mengambil data dari submission yang baru dibuat (terutama saya ingin mendapatkan ID Submission-nya) yang baru saja dibuat

            reset();
            localStorage.removeItem('tests');
            localStorage.removeItem('packages');
            localStorage.removeItem('reservation_form');
            },
            onError: (errors) => {
            console.error('Submission errors:', errors);
            },
        });
    };

    if (cartEmpty) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Formulir Pesanan" />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                            <ClipboardList className="h-16 w-16 text-blue-500" />
                        </div>
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Keranjang Anda Kosong</h2>
                        <p className="mb-8 max-w-lg text-lg text-gray-600 dark:text-gray-300">
                            Anda perlu menambahkan pengujian atau paket ke keranjang sebelum mengisi formulir pesanan.
                        </p>
                        <Link href="/orders/cart">
                            <Button size="lg" className="px-8 py-3">
                                <ShoppingCart className="mr-2 h-5 w-5" />
                                Kembali ke Keranjang
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formulir Pesanan" />

            <div className="container mx-auto px-4 py-8">
                {/* Enhanced Stepper */}
                <div className="mb-12">
                    <div className="relative">
                        <div className="absolute top-6 left-0 h-0.5 w-full bg-gray-200 dark:bg-gray-700"></div>
                        <div className="relative mx-auto flex max-w-2xl justify-between">
                            <div className="group flex flex-col items-center">
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <span className="mt-3 text-sm font-medium text-green-600 dark:text-green-400">Keranjang</span>
                                <Badge variant="secondary" className="mt-1 text-xs">
                                    Selesai
                                </Badge>
                            </div>
                            <div className="group flex flex-col items-center">
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <span className="mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400">Formulir Pesanan</span>
                                <Badge className="mt-1 text-xs">Sedang Aktif</Badge>
                            </div>
                            <div className="group flex flex-col items-center">
                                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="mt-3 text-sm font-medium text-gray-500">Checkout</span>
                                <Badge variant="outline" className="mt-1 text-xs">
                                    Menunggu
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card className="border-0 bg-white shadow-lg dark:bg-gray-900">
                            <CardHeader className="pb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl">Informasi Pesanan</CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Isi detail proyek dan informasi perusahaan Anda</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Company Information Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2">
                                            <Building2 className="h-5 w-5 text-blue-600" />
                                            <h3 className="text-lg font-semibold">Informasi Perusahaan</h3>
                                        </div>
                                        <Separator />

                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="company_name"
                                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                >
                                                    Nama Perusahaan *
                                                </label>
                                                <Input
                                                    id="company_name"
                                                    value={reservationForm.company_name}
                                                    onChange={(e) => handleChangeReservationForm('company_name', e.target.value)}
                                                    placeholder="PT. Konstruksi Indonesia"
                                                    disabled={processing}
                                                    className="h-12"
                                                />
                                                {errors.company_name && (
                                                    <p className="flex items-center text-sm text-red-500">
                                                        <span className="mr-1">⚠</span>
                                                        {errors.company_name}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="project_name"
                                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                >
                                                    Nama Proyek *
                                                </label>
                                                <Input
                                                    id="project_name"
                                                    value={reservationForm.project_name}
                                                    onChange={(e) => handleChangeReservationForm('project_name', e.target.value)}
                                                    placeholder="Pembangunan Jembatan Suramadu"
                                                    disabled={processing}
                                                    className="h-12"
                                                />
                                                {errors.project_name && (
                                                    <p className="flex items-center text-sm text-red-500">
                                                        <span className="mr-1">⚠</span>
                                                        {errors.project_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="project_address"
                                                className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300"
                                            >
                                                <MapPin className="mr-2 h-4 w-4" />
                                                Alamat Proyek *
                                            </label>
                                            <Textarea
                                                id="project_address"
                                                value={reservationForm.project_address}
                                                onChange={(e) => handleChangeReservationForm('project_address', e.target.value)}
                                                placeholder="Jl. Raya Suramadu, Surabaya, Jawa Timur"
                                                className="min-h-[100px] resize-none"
                                                disabled={processing}
                                            />
                                            {errors.project_address && (
                                                <p className="flex items-center text-sm text-red-500">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.project_address}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Schedule Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-5 w-5 text-green-600" />
                                            <h3 className="text-lg font-semibold">Jadwal Pengajuan</h3>
                                        </div>
                                        <Separator />

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="test_submission_date"
                                                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                            >
                                                Tanggal Pengajuan *
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="test_submission_date"
                                                        variant={'outline'}
                                                        className={cn(
                                                            'h-12 w-full justify-start pl-4 text-left font-normal',
                                                            !reservationForm.test_submission_date && 'text-muted-foreground',
                                                        )}
                                                        disabled={processing}
                                                    >
                                                        <CalendarIcon className="mr-3 h-4 w-4" />
                                                        {reservationForm.test_submission_date ? (
                                                            formatDate(reservationForm.test_submission_date)
                                                        ) : (
                                                            <span>Pilih Tanggal Pengajuan</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        onSelect={(date) => {
                                                            handleChangeReservationForm('test_submission_date', date);
                                                        }}
                                                        selected={reservationForm.test_submission_date}
                                                        disabled={(date) => {
                                                            const today = new Date();
                                                            const threeMonthsFromNow = new Date();
                                                            threeMonthsFromNow.setMonth(today.getMonth() + 3);
                                                            return date < today || date > threeMonthsFromNow;
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="rounded-md bg-blue-50 p-2 text-sm text-blue-600 dark:bg-blue-900/20">
                                                📅 Pilih tanggal dalam rentang 3 bulan ke depan
                                            </p>
                                            {errors.test_submission_date && (
                                                <p className="flex items-center text-sm text-red-500">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.test_submission_date}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Additional Notes Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-purple-600" />
                                            <h3 className="text-lg font-semibold">Catatan Tambahan</h3>
                                        </div>
                                        <Separator />

                                        <div className="space-y-2">
                                            <label htmlFor="user_note" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Catatan Khusus (Opsional)
                                            </label>
                                            <Textarea
                                                id="user_note"
                                                value={reservationForm.user_note}
                                                onChange={(e) => handleChangeReservationForm('user_note', e.target.value)}
                                                placeholder="Tambahkan catatan khusus untuk pesanan Anda (mis: instruksi khusus, permintaan prioritas, dll.)"
                                                className="min-h-[120px] resize-none"
                                                disabled={processing}
                                            />
                                            <p className="rounded-md bg-gray-50 p-2 text-sm text-gray-500 dark:bg-gray-800">
                                                💡 Berikan informasi tambahan yang mungkin diperlukan oleh tim admin kami
                                            </p>
                                            {errors.user_note && (
                                                <p className="flex items-center text-sm text-red-500">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.user_note}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col justify-between gap-4 border-t pt-8 sm:flex-row">
                                        <Link href="/orders/cart">
                                            <Button type="button" variant="outline" disabled={processing} className="h-12 w-full px-6 sm:w-auto">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Kembali ke Keranjang
                                            </Button>
                                        </Link>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 hover:from-blue-700 hover:to-blue-800 sm:w-auto"
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    Kirim Pengajuan
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    Tips Pengisian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <span className="text-xs font-bold text-blue-600">1</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Pastikan nama perusahaan dan proyek sesuai dengan dokumen resmi
                                        </p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <span className="text-xs font-bold text-blue-600">2</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Alamat proyek harus lengkap dan detail untuk memudahkan kunjungan tim
                                        </p>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <span className="text-xs font-bold text-blue-600">3</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Pilih tanggal pengajuan dengan mempertimbangkan waktu persiapan
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:from-blue-900/20 dark:to-indigo-900/20">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Waktu Pemrosesan</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Pengajuan akan diproses dalam 1-2 hari kerja setelah formulir dikirim
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
