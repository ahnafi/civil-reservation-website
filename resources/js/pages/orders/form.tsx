import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatRupiah } from '@/lib/format-rupiah';
import { cn } from '@/lib/utils';
import { calculateCartTotal } from '@/services/form-cart-service';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-utils';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CalendarIcon, ClipboardList, CreditCard, ShoppingCart } from 'lucide-react';
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
    test_submission_date: Date | undefined;
    user_note: string;
    submission_tests: SimplifiedTest[];
    submission_packages: SimplifiedPackage[];
};

export default function ReservationForm() {
    const [cartEmpty, setCartEmpty] = useState(false);
    const { subtotal, tax, shipping, total } = calculateCartTotal();
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
                    parsedForm.test_submission_date = new Date(parsedForm.test_submission_date);
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
            localStorage.setItem('reservation_form', JSON.stringify(reservationForm));
        }

        if (tests.length > 0 || packages.length > 0) {
            setData({
                ...reservationForm,
                test_submission_date: reservationForm.test_submission_date,
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

        // Format data sebelum submit
        const submissionData = {
            ...data,
            test_submission_date: formatDateForSubmission(data.test_submission_date),
        };

        console.info('Formatted submission data:', submissionData);

        post(route('createSubmission'), {
            onSuccess: () => {
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
                <div className="container mx-auto py-6">
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                            <ClipboardList className="h-12 w-12 text-gray-400" />
                        </div>
                        <h2 className="mb-2 text-2xl font-semibold">Keranjang Anda Kosong</h2>
                        <p className="mb-8 max-w-md text-gray-500">
                            Anda perlu menambahkan pengujian atau paket ke keranjang sebelum mengisi formulir pesanan.
                        </p>
                        <Link href="/orders/cart">
                            <Button size="lg">Kembali ke Keranjang</Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Formulir Pesanan" />

            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-3xl font-bold">Formulir Pesanan</h1>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-between">
                            <div className="flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-500">Keranjang</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
                                    <ClipboardList className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium">Formulir Pesanan</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-800">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <span className="mt-2 text-sm font-medium text-gray-500">Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label htmlFor="company_name" className="block text-sm font-medium">
                                                Nama Perusahaan
                                            </label>
                                            <Input
                                                id="company_name"
                                                value={reservationForm.company_name}
                                                onChange={(e) => handleChangeReservationForm('company_name', e.target.value)}
                                                placeholder="PT. Konstruksi Indonesia"
                                                disabled={processing}
                                            />
                                            {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="project_name" className="block text-sm font-medium">
                                                Nama Proyek
                                            </label>
                                            <Input
                                                id="project_name"
                                                value={reservationForm.project_name}
                                                onChange={(e) => handleChangeReservationForm('project_name', e.target.value)}
                                                placeholder="Pembangunan Jembatan Suramadu"
                                                disabled={processing}
                                            />
                                            {errors.project_name && <p className="text-sm text-red-500">{errors.project_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="project_address" className="block text-sm font-medium">
                                                Alamat Proyek
                                            </label>
                                            <Textarea
                                                id="project_address"
                                                value={reservationForm.project_address}
                                                onChange={(e) => handleChangeReservationForm('project_address', e.target.value)}
                                                placeholder="Jl. Raya Suramadu, Surabaya, Jawa Timur"
                                                className="resize-none"
                                                disabled={processing}
                                            />
                                            {errors.project_address && <p className="text-sm text-red-500">{errors.project_address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="test_submission_date" className="block text-sm font-medium">
                                                Tanggal Pengajuan
                                            </label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="test_submission_date"
                                                        variant={'outline'}
                                                        className={cn(
                                                            'w-[240px] pl-3 text-left font-normal',
                                                            !reservationForm.test_submission_date && 'text-muted-foreground',
                                                        )}
                                                    >
                                                        {reservationForm.test_submission_date ? (
                                                            formatDate(reservationForm.test_submission_date)
                                                        ) : (
                                                            <span>Pilih Tanggal</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            onSelect={(date) => {
                                                                setData('test_submission_date', date); // untuk submit form
                                                                handleChangeReservationForm('test_submission_date', date); // untuk localStorage
                                                            }}
                                                            selected={reservationForm.test_submission_date}
                                                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                            autoFocus
                                                        />
                                                </PopoverContent>
                                            </Popover>
                                            <p className="text-sm text-gray-500">Tanggal pengujian tidak boleh lebih dari 3 bulan</p>
                                            {errors.test_submission_date && <p className="text-sm text-red-500">{errors.test_submission_date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="user_note" className="block text-sm font-medium">
                                                Catatan (Opsional)
                                            </label>
                                            <Textarea
                                                id="user_note"
                                                value={reservationForm.user_note}
                                                onChange={(e) => handleChangeReservationForm('user_note', e.target.value)}
                                                placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                                                className="resize-none"
                                                disabled={processing}
                                            />
                                            <p className="text-sm text-gray-500">Berikan informasi tambahan yang mungkin diperlukan oleh admin</p>
                                            {errors.user_note && <p className="text-sm text-red-500">{errors.user_note}</p>}
                                        </div>
                                    </div>

                                    <div className="flex justify-between pt-4">
                                        <Link href="/orders/cart">
                                            <Button type="button" variant="outline" disabled={processing}>
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Kembali ke Keranjang
                                            </Button>
                                        </Link>
                                        <Button type="submit" disabled={processing}>
                                            Kirim Pengajuan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary Card */}
                    <div>
                        <Card className="sticky top-6">
                            <CardHeader className="pb-3">
                                <CardTitle>Ringkasan Pesanan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span>{formatRupiah(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Pajak (10%)</span>
                                        <span>{formatRupiah(tax)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Biaya Pengiriman</span>
                                        <span>{formatRupiah(shipping)}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-medium">
                                    <span>Total</span>
                                    <span>{formatRupiah(total)}</span>
                                </div>

                                <Alert className="border-gray-200 bg-gray-50">
                                    <AlertDescription className="text-xs">
                                        Silakan lengkapi formulir pesanan untuk melanjutkan ke proses checkout dan pembayaran.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleSubmit} disabled={processing}>
                                    Kirim Pengajuan
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
