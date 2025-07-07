import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import { formatDate } from '@/utils/date-utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    GraduationCap,
    MapPin,
    ShoppingCart,
    Users,
} from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import axios from 'axios';

// Types
type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'internal' | 'external';
};

type ExternalForm = {
    company_name: string;
    project_name: string;
    project_address: string;
    test_submission_date: Date | undefined;
    user_note: string;
};

type InternalForm = {
    name: string;
    program_study: string;
    research_title: string;
    personnel_count: number;
    supervisor: string;
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
    submission_type: 'external' | 'internal';
    test_submission_date: string | undefined;
    user_note: string;
    submission_tests: SimplifiedTest[];
    submission_packages: SimplifiedPackage[];
    // External fields
    company_name?: string;
    project_name?: string;
    project_address?: string;
    // Internal fields
    name?: string;
    program_study?: string;
    research_title?: string;
    personnel_count?: number;
    supervisor?: string;
};

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

export default function ReservationForm() {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;
    const [cartEmpty, setCartEmpty] = useState(false);
    const [submissionType, setSubmissionType] = useState<'external' | 'internal'>(
        user.role === 'admin' ? 'external' : (user.role as 'external' | 'internal'),
    );
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    const checkAvailability = async () => {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        if (tests.length === 0 && packages.length === 0) {
            return;
        }

        setLoadingAvailability(true);

        try {
            // Set date range untuk 3 bulan ke depan
            const today = new Date();
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(today.getMonth() + 3);

            const response = await axios.post(route('booking.checkAvailability'), {
                test_ids: tests.map((test: SimplifiedTest) => test.test_id),
                package_ids: packages.map((pkg: SimplifiedPackage) => pkg.package_id),
                start_date: today.toISOString().split('T')[0],
                end_date: threeMonthsFromNow.toISOString().split('T')[0],
            });

            if (response.data.success) {
                const unavailableDateStrings = response.data.unavailable_dates.map(
                    (item: { date: string; unavailable_tests: string[] }) => item.date,
                );
                setUnavailableDates(unavailableDateStrings);
            }
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setLoadingAvailability(false);
        }
    };

    // Check availability when component mounts or cart changes
    useEffect(() => {
        checkAvailability();
    }, []); // Run once on mount

    // Function untuk check apakah tanggal disabled
    const isDateDisabled = (date: Date): boolean => {
        const today = new Date();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(today.getMonth() + 3);

        // Disable jika tanggal di masa lalu atau lebih dari 3 bulan
        if (date < today || date > threeMonthsFromNow) {
            return true;
        }

        // Disable jika tanggal tidak tersedia
        const dateString = date.toISOString().split('T')[0];
        return unavailableDates.includes(dateString);
    };

    console.log('Unavailable dates:', unavailableDates);

    const [externalForm, setExternalForm] = useState<ExternalForm>({
        company_name: '',
        project_name: '',
        project_address: '',
        test_submission_date: undefined,
        user_note: '',
    });

    const [internalForm, setInternalForm] = useState<InternalForm>({
        name: '',
        program_study: '',
        research_title: '',
        personnel_count: 1,
        supervisor: '',
        test_submission_date: undefined,
        user_note: '',
    });

    const { data, setData, post, processing, errors, reset } = useForm<SubmissionData>({
        submission_type: submissionType,
        test_submission_date: undefined,
        user_note: '',
        submission_tests: [],
        submission_packages: [],
    });
    console.info('Initial form data:', data);

    // Helper function untuk format tanggal ke YYYY-MM-DD
    const formatDateForSubmission = (date: Date | undefined): string | undefined => {
        if (!date) return undefined;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Load saved form data
    useEffect(() => {
        const savedExternalForm = localStorage.getItem('external_form');
        const savedInternalForm = localStorage.getItem('internal_form');

        if (savedExternalForm) {
            try {
                const parsedForm = JSON.parse(savedExternalForm);
                if (parsedForm.test_submission_date) {
                    const [year, month, day] = parsedForm.test_submission_date.split('-');
                    parsedForm.test_submission_date = new Date(Number(year), Number(month) - 1, Number(day));
                }
                setExternalForm(parsedForm);
            } catch (error) {
                console.error('Error parsing saved external form:', error);
                localStorage.removeItem('external_form');
            }
        }

        if (savedInternalForm) {
            try {
                const parsedForm = JSON.parse(savedInternalForm);
                if (parsedForm.test_submission_date) {
                    const [year, month, day] = parsedForm.test_submission_date.split('-');
                    parsedForm.test_submission_date = new Date(Number(year), Number(month) - 1, Number(day));
                }
                setInternalForm(parsedForm);
            } catch (error) {
                console.error('Error parsing saved internal form:', error);
                localStorage.removeItem('internal_form');
            }
        }
    }, []);

    // Update form data when forms change
    useEffect(() => {
        const tests = JSON.parse(localStorage.getItem('tests') || '[]');
        const packages = JSON.parse(localStorage.getItem('packages') || '[]');

        if (tests.length === 0 && packages.length === 0) {
            setCartEmpty(true);
            return;
        }

        // Save form data to localStorage
        if (submissionType === 'external') {
            const hasExternalData = Object.values(externalForm).some((val) => val !== undefined && val !== '');
            if (hasExternalData) {
                const sanitized = {
                    ...externalForm,
                    test_submission_date: externalForm.test_submission_date ? formatDateForSubmission(externalForm.test_submission_date) : undefined,
                };
                localStorage.setItem('external_form', JSON.stringify(sanitized));
            }
        } else {
            const hasInternalData = Object.values(internalForm).some((val) => val !== undefined && val !== '' && val !== 1);
            if (hasInternalData) {
                const sanitized = {
                    ...internalForm,
                    test_submission_date: internalForm.test_submission_date ? formatDateForSubmission(internalForm.test_submission_date) : undefined,
                };
                localStorage.setItem('internal_form', JSON.stringify(sanitized));
            }
        }

        // Update form data
        const baseData = {
            submission_type: submissionType,
            submission_tests: tests.map((test: SimplifiedTest) => ({
                test_id: test.test_id,
                unit: test.unit,
            })),
            submission_packages: packages.map((pkg: SimplifiedPackage) => ({
                package_id: pkg.package_id,
            })),
        };

        if (submissionType === 'external') {
            setData({
                ...baseData,
                test_submission_date: formatDateForSubmission(externalForm.test_submission_date),
                user_note: externalForm.user_note,
                company_name: externalForm.company_name,
                project_name: externalForm.project_name,
                project_address: externalForm.project_address,
            });
        } else {
            setData({
                ...baseData,
                test_submission_date: formatDateForSubmission(internalForm.test_submission_date),
                user_note: internalForm.user_note,
                name: internalForm.name,
                program_study: internalForm.program_study,
                research_title: internalForm.research_title,
                personnel_count: internalForm.personnel_count,
                supervisor: internalForm.supervisor,
            });
        }
    }, [externalForm, internalForm, submissionType]);

    const handleExternalFormChange = (field: keyof ExternalForm, value: string | Date | undefined) => {
        setExternalForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleInternalFormChange = (field: keyof InternalForm, value: string | Date | undefined | number) => {
        setInternalForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmissionTypeChange = (type: 'external' | 'internal') => {
        setSubmissionType(type);
        setData('submission_type', type);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (cartEmpty) {
            return;
        }

        post(route('createSubmission'), {
            onSuccess: (page) => {
                // Ambil submission ID dari response jika ada
                console.log('Submission created successfully:', page);

                reset();
                localStorage.removeItem('tests');
                localStorage.removeItem('packages');
                localStorage.removeItem('external_form');
                localStorage.removeItem('internal_form');
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
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Isi detail {submissionType === 'external' ? 'proyek dan perusahaan' : 'penelitian dan akademik'} Anda
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Submission Type Selector for Admin */}
                                    {user.role === 'admin' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-5 w-5 text-purple-600" />
                                                <h3 className="text-lg font-semibold">Tipe Pengajuan</h3>
                                            </div>
                                            <Separator />
                                            <Select value={submissionType} onValueChange={handleSubmissionTypeChange}>
                                                <SelectTrigger className="h-12">
                                                    <SelectValue placeholder="Pilih tipe pengajuan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="external">
                                                        <div className="flex items-center space-x-2">
                                                            <Building2 className="h-4 w-4" />
                                                            <span>External (Perusahaan/Industri)</span>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="internal">
                                                        <div className="flex items-center space-x-2">
                                                            <GraduationCap className="h-4 w-4" />
                                                            <span>Internal (Mahasiswa/Dosen)</span>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* External Form */}
                                    {submissionType === 'external' && (
                                        <>
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
                                                            value={externalForm.company_name}
                                                            onChange={(e) => handleExternalFormChange('company_name', e.target.value)}
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
                                                            value={externalForm.project_name}
                                                            onChange={(e) => handleExternalFormChange('project_name', e.target.value)}
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
                                                        value={externalForm.project_address}
                                                        onChange={(e) => handleExternalFormChange('project_address', e.target.value)}
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

                                            {/* Schedule Section for External */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-5 w-5 text-green-600" />
                                                    <h3 className="text-lg font-semibold">Jadwal Pengajuan</h3>
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="test_submission_date_external"
                                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Tanggal Pengajuan *
                                                        {loadingAvailability && (
                                                            <span className="ml-2 text-xs text-blue-600">
                                                                <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                                Mengecek ketersediaan...
                                                            </span>
                                                        )}
                                                    </label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="test_submission_date_external"
                                                                variant={'outline'}
                                                                className={cn(
                                                                    'h-12 w-full justify-start pl-4 text-left font-normal',
                                                                    !externalForm.test_submission_date && 'text-muted-foreground',
                                                                )}
                                                                disabled={processing || loadingAvailability}
                                                            >
                                                                <CalendarIcon className="mr-3 h-4 w-4" />
                                                                {externalForm.test_submission_date ? (
                                                                    formatDate(externalForm.test_submission_date)
                                                                ) : (
                                                                    <span>Pilih Tanggal Pengajuan</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                onSelect={(date) => handleExternalFormChange('test_submission_date', date)}
                                                                selected={externalForm.test_submission_date}
                                                                disabled={isDateDisabled}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    {errors.test_submission_date && (
                                                        <p className="flex items-center text-sm text-red-500">
                                                            <span className="mr-1">⚠</span>
                                                            {errors.test_submission_date}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Additional Notes for External */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-5 w-5 text-purple-600" />
                                                    <h3 className="text-lg font-semibold">Catatan Tambahan</h3>
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="user_note_external"
                                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Catatan Khusus (Opsional)
                                                    </label>
                                                    <Textarea
                                                        id="user_note_external"
                                                        value={externalForm.user_note}
                                                        onChange={(e) => handleExternalFormChange('user_note', e.target.value)}
                                                        placeholder="Tambahkan catatan khusus untuk pesanan Anda"
                                                        className="min-h-[120px] resize-none"
                                                        disabled={processing}
                                                    />
                                                    {errors.user_note && (
                                                        <p className="flex items-center text-sm text-red-500">
                                                            <span className="mr-1">⚠</span>
                                                            {errors.user_note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Internal Form */}
                                    {submissionType === 'internal' && (
                                        <>
                                            {/* Academic Information Section */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2">
                                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                                    <h3 className="text-lg font-semibold">Informasi Akademik</h3>
                                                </div>
                                                <Separator />

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="name"
                                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                        >
                                                            Nama Mahasiswa/Dosen *
                                                        </label>
                                                        <Input
                                                            id="name"
                                                            value={internalForm.name}
                                                            onChange={(e) => handleInternalFormChange('name', e.target.value)}
                                                            placeholder="Dr. Ahmad Fauzi, S.T., M.T."
                                                            disabled={processing}
                                                            className="h-12"
                                                        />
                                                        {errors.name && (
                                                            <p className="flex items-center text-sm text-red-500">
                                                                <span className="mr-1">⚠</span>
                                                                {errors.name}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="program_study"
                                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                        >
                                                            Program Studi *
                                                        </label>
                                                        <Input
                                                            id="program_study"
                                                            value={internalForm.program_study}
                                                            onChange={(e) => handleInternalFormChange('program_study', e.target.value)}
                                                            placeholder="Teknik Sipil"
                                                            disabled={processing}
                                                            className="h-12"
                                                        />
                                                        {errors.program_study && (
                                                            <p className="flex items-center text-sm text-red-500">
                                                                <span className="mr-1">⚠</span>
                                                                {errors.program_study}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="research_title"
                                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Judul Penelitian *
                                                    </label>
                                                    <Input
                                                        id="research_title"
                                                        value={internalForm.research_title}
                                                        onChange={(e) => handleInternalFormChange('research_title', e.target.value)}
                                                        placeholder="Analisis Kuat Tekan Beton dengan Agregat Daur Ulang"
                                                        disabled={processing}
                                                        className="h-12"
                                                    />
                                                    {errors.research_title && (
                                                        <p className="flex items-center text-sm text-red-500">
                                                            <span className="mr-1">⚠</span>
                                                            {errors.research_title}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="personnel_count"
                                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                        >
                                                            Jumlah Personel *
                                                        </label>
                                                        <Input
                                                            id="personnel_count"
                                                            type="number"
                                                            min="1"
                                                            value={internalForm.personnel_count}
                                                            onChange={(e) =>
                                                                handleInternalFormChange('personnel_count', parseInt(e.target.value) || 1)
                                                            }
                                                            disabled={processing}
                                                            className="h-12"
                                                        />
                                                        {errors.personnel_count && (
                                                            <p className="flex items-center text-sm text-red-500">
                                                                <span className="mr-1">⚠</span>
                                                                {errors.personnel_count}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label
                                                            htmlFor="supervisor"
                                                            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                        >
                                                            Dosen Pembimbing *
                                                        </label>
                                                        <Input
                                                            id="supervisor"
                                                            value={internalForm.supervisor}
                                                            onChange={(e) => handleInternalFormChange('supervisor', e.target.value)}
                                                            placeholder="Prof. Dr. Ir. Budi Santoso, M.T."
                                                            disabled={processing}
                                                            className="h-12"
                                                        />
                                                        {errors.supervisor && (
                                                            <p className="flex items-center text-sm text-red-500">
                                                                <span className="mr-1">⚠</span>
                                                                {errors.supervisor}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Schedule Section for Internal */}
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="test_submission_date_internal"
                                                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                >
                                                    Tanggal Pengajuan *
                                                    {loadingAvailability && (
                                                        <span className="ml-2 text-xs text-blue-600">
                                                            <div className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                            Mengecek ketersediaan...
                                                        </span>
                                                    )}
                                                </label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id="test_submission_date_internal"
                                                            variant={'outline'}
                                                            className={cn(
                                                                'h-12 w-full justify-start pl-4 text-left font-normal',
                                                                !internalForm.test_submission_date && 'text-muted-foreground',
                                                            )}
                                                            disabled={processing || loadingAvailability}
                                                        >
                                                            <CalendarIcon className="mr-3 h-4 w-4" />
                                                            {internalForm.test_submission_date ? (
                                                                formatDate(internalForm.test_submission_date)
                                                            ) : (
                                                                <span>Pilih Tanggal Pengajuan</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            onSelect={(date) => handleInternalFormChange('test_submission_date', date)}
                                                            selected={internalForm.test_submission_date}
                                                            disabled={isDateDisabled}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {errors.test_submission_date && (
                                                    <p className="flex items-center text-sm text-red-500">
                                                        <span className="mr-1">⚠</span>
                                                        {errors.test_submission_date}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Additional Notes for Internal */}
                                            <div className="space-y-6">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-5 w-5 text-purple-600" />
                                                    <h3 className="text-lg font-semibold">Catatan Tambahan</h3>
                                                </div>
                                                <Separator />

                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="user_note_internal"
                                                        className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                                                    >
                                                        Catatan Penelitian (Opsional)
                                                    </label>
                                                    <Textarea
                                                        id="user_note_internal"
                                                        value={internalForm.user_note}
                                                        onChange={(e) => handleInternalFormChange('user_note', e.target.value)}
                                                        placeholder="Tambahkan catatan khusus untuk penelitian Anda"
                                                        className="min-h-[120px] resize-none"
                                                        disabled={processing}
                                                    />
                                                    {errors.user_note && (
                                                        <p className="flex items-center text-sm text-red-500">
                                                            <span className="mr-1">⚠</span>
                                                            {errors.user_note}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

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
                                    {submissionType === 'external' ? (
                                        <>
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
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <span className="text-xs font-bold text-blue-600">1</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Pastikan judul penelitian sesuai dengan proposal yang disetujui
                                                </p>
                                            </div>
                                            <div className="flex items-start space-x-2">
                                                <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                                    <span className="text-xs font-bold text-blue-600">2</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Koordinasi dengan dosen pembimbing sebelum mengajukan jadwal
                                                </p>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-start space-x-2">
                                        <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                            <span className="text-xs font-bold text-blue-600">3</span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300">Pilih tanggal dengan mempertimbangkan waktu persiapan</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg dark:from-blue-900/20 dark:to-indigo-900/20">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        {submissionType === 'external' ? (
                                            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        )}
                                    </div>
                                    <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                                        {submissionType === 'external' ? 'Pengajuan Eksternal' : 'Pengajuan Internal'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {submissionType === 'external'
                                            ? 'Untuk perusahaan dan industri yang membutuhkan layanan pengujian profesional'
                                            : 'Untuk mahasiswa dan dosen yang melakukan penelitian akademik'}
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
