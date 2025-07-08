import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SubmissionSchedule, Test, Testing, Transaction } from '@/types';
import { parseAndFormatDate } from '@/utils/date-utils';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Beaker,
    ClipboardCheck,
    Clock,
    CreditCard,
    ExternalLink,
    Factory,
    FileText,
    FolderKanban,
    Hammer,
    HardHat,
    MapPin,
    Package,
    User,
    UserCheck,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';

// Add these types at the top of the file after imports
// Update types at the top of the file after imports
type ResubmissionFormData = {
    company_name?: string;
    project_name?: string;
    project_address?: string;
    name?: string;
    program_study?: string;
    research_title?: string;
    personnel_count?: number;
    supervisor?: string;
    test_submission_date: string;
    user_note?: string; // Make optional since it's not in SubmissionSchedule
};

// ✅ Simplified TestData type based on actual SubmissionSchedule data
type TestData = {
    test_id: number;
    slug: string;
    unit: number;
    test: {
        id: number;
        name: string;
        slug: string;
        price: number;
        description: string;
        images: string[];
        minimum_unit: number;
        daily_slot: number;
        is_active: boolean;
        category_id: number;
        laboratory_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: null;
        category: {
            id: number;
            name: string;
            description: null;
            created_at: string;
            updated_at: string;
            deleted_at: null;
        };
        laboratory: {
            id: number;
            code: string;
            slug: string;
            name: string;
            room: string;
            description: string;
            images: string[];
            created_at: string;
            updated_at: string;
            deleted_at: null;
        };
    };
};

// ✅ Simplified PackageData type based on actual SubmissionSchedule data
type PackageData = {
    package_id: number;
    slug: string;
    package: {
        id: number;
        name: string;
        slug: string;
        price: number;
        images: string[];
        description: string;
        laboratory_id: number;
        created_at: string;
        updated_at: string;
        deleted_at: null;
        tests: Test[];
    };
    quantity: number;
};

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

export default function SubmissionDetail({
    submissionHistoryDetail,
    relatedTransaction,
    relatedTesting,
}: {
    submissionHistoryDetail: SubmissionSchedule[];
    relatedTransaction: Transaction[];
    relatedTesting: Testing[];
}) {
    const testRecord: SubmissionSchedule = submissionHistoryDetail[0];
    const [processing, setProcessing] = useState<boolean>(false);

    const uniquePackages: SubmissionSchedule[] = submissionHistoryDetail
        .filter((record: SubmissionSchedule): boolean => Boolean(record.package_id))
        .reduce((acc: SubmissionSchedule[], current: SubmissionSchedule): SubmissionSchedule[] => {
            const existingPackage: SubmissionSchedule | undefined = acc.find(
                (pkg: SubmissionSchedule): boolean => pkg.package_id === current.package_id,
            );
            if (!existingPackage) {
                acc.push(current);
            }
            return acc;
        }, []);

    const uniqueTests: SubmissionSchedule[] = submissionHistoryDetail
        .filter((record: SubmissionSchedule): boolean => Boolean(record.test_id))
        .reduce((acc: SubmissionSchedule[], current: SubmissionSchedule): SubmissionSchedule[] => {
            const existingTest: SubmissionSchedule | undefined = acc.find((test: SubmissionSchedule): boolean => test.test_id === current.test_id);
            if (!existingTest) {
                acc.push(current);
            }
            return acc;
        }, []);

    // ✅ Type boolean checks properly
    const packageExists: boolean = uniquePackages.length > 0;
    const testExists: boolean = uniqueTests.length > 0;

    // Uncomment this if you want to use cleanSubmissionData for any purpose
    // const cleanSubmissionData = {
    //     packages: uniquePackages.map((pkg) => ({
    //         package_id: pkg.package_id,
    //         package_name: pkg.package_name,
    //         package_price: pkg.package_price,
    //         package_slug: pkg.package_slug,
    //         package_images: pkg.package_images,
    //     })),
    //     tests: uniqueTests.map((test) => ({
    //         test_id: test.test_id,
    //         test_name: test.test_name,
    //         test_price: test.test_price,
    //         test_slug: test.test_slug,
    //         test_images: test.test_images,
    //         quantity: test.quantity,
    //     })),
    // };

    const handleRepeatSubmission = (): void => {
        setProcessing(true);

        try {
            const submissionType: string = testRecord.submission_type;

            // ✅ Prepare form data with proper typing - remove user_note since it's not in SubmissionSchedule
            if (submissionType === 'external') {
                const externalFormData: ResubmissionFormData = {
                    company_name: testRecord.company_name || '',
                    project_name: testRecord.project_name || '',
                    project_address: testRecord.project_address || '',
                    test_submission_date: testRecord.test_submission_date ? testRecord.test_submission_date.split('T')[0] : '',
                };
                localStorage.setItem('external_form', JSON.stringify(externalFormData));
            } else if (submissionType === 'internal') {
                const internalFormData: ResubmissionFormData = {
                    name: testRecord.researcher_name || '',
                    program_study: testRecord.program_study || '',
                    research_title: testRecord.research_title || '',
                    personnel_count: testRecord.personnel_count || 1,
                    supervisor: testRecord.supervisor || '',
                    test_submission_date: testRecord.test_submission_date ? testRecord.test_submission_date.split('T')[0] : '',
                };
                localStorage.setItem('internal_form', JSON.stringify(internalFormData));
            }

            // ✅ Prepare tests data with type safety - only use fields that exist in SubmissionSchedule
            const testsData: TestData[] = uniqueTests.map((test: SubmissionSchedule): TestData => {
                // Parse images with type safety - only use test_images which exists
                const testImages: string[] = Array.isArray(test.test_images)
                    ? test.test_images
                    : typeof test.test_images === 'string'
                      ? JSON.parse(test.test_images || '["test_images/default.jpg"]')
                      : ['test_images/default.jpg'];

                // ✅ Use default laboratory images since lab_images doesn't exist in SubmissionSchedule
                const labImages: string[] = ['laboratory_images/default.jpg'];

                return {
                    test_id: test.test_id,
                    slug: test.test_slug,
                    unit: test.quantity,
                    test: {
                        id: test.test_id,
                        name: test.test_name,
                        slug: test.test_slug,
                        price: test.test_price,
                        description: '', // Not available in SubmissionSchedule
                        images: testImages,
                        minimum_unit: 1, // Default value
                        daily_slot: 10, // Default value
                        is_active: true, // Default value
                        category_id: 1, // Default value - not available in SubmissionSchedule
                        laboratory_id: test.lab_id,
                        created_at: test.created_at,
                        updated_at: test.created_at, // Use created_at as fallback
                        deleted_at: null,
                        category: {
                            id: 1, // Default value
                            name: 'Kategori', // Default value
                            description: null,
                            created_at: test.created_at,
                            updated_at: test.created_at,
                            deleted_at: null,
                        },
                        laboratory: {
                            id: test.lab_id,
                            code: test.lab_code,
                            slug: test.lab_code?.toLowerCase() || '',
                            name: test.lab_name,
                            room: '', // Not available in SubmissionSchedule
                            description: '', // Not available in SubmissionSchedule
                            images: labImages,
                            created_at: test.created_at,
                            updated_at: test.created_at,
                            deleted_at: null,
                        },
                    },
                };
            });

            // ✅ Prepare packages data with type safety - only use fields that exist in SubmissionSchedule
            const packagesData: PackageData[] = uniquePackages.map((pkg: SubmissionSchedule): PackageData => {
                // Parse images with type safety
                const packageImages: string[] = Array.isArray(pkg.package_images)
                    ? pkg.package_images
                    : typeof pkg.package_images === 'string'
                      ? JSON.parse(pkg.package_images || '["package_images/default.jpg"]')
                      : ['package_images/default.jpg'];

                return {
                    package_id: pkg.package_id,
                    slug: pkg.package_slug,
                    package: {
                        id: pkg.package_id,
                        name: pkg.package_name,
                        slug: pkg.package_slug,
                        price: pkg.package_price,
                        images: packageImages,
                        description: '', // Not available in SubmissionSchedule
                        laboratory_id: pkg.lab_id,
                        created_at: pkg.created_at,
                        updated_at: pkg.created_at, // Use created_at as fallback
                        deleted_at: null,
                        tests: [], // Empty array for tests in package
                    },
                    quantity: 1, // Default quantity for packages
                };
            });

            // ✅ Save to localStorage with type checking
            if (testsData.length > 0) {
                localStorage.setItem('tests', JSON.stringify(testsData));
            }

            if (packagesData.length > 0) {
                localStorage.setItem('packages', JSON.stringify(packagesData));
            }

            // ✅ Build URL parameters with type safety
            const testIds: number[] = testsData.map((test: TestData): number => test.test_id);
            const packageIds: number[] = packagesData.map((pkg: PackageData): number => pkg.package_id);

            const params: URLSearchParams = new URLSearchParams();
            testIds.forEach((id: number): void => {
                params.append('testIds[]', id.toString());
            });
            packageIds.forEach((id: number): void => {
                params.append('packageIds[]', id.toString());
            });

            const formUrl: string = `/orders/form?${params.toString()}`;

            // ✅ Redirect with delay
            setTimeout((): void => {
                window.location.href = formUrl;
            }, 500);
        } catch (error: unknown) {
            console.error('Error during resubmission:', error);

            // Type-safe error handling
            const errorMessage: string = error instanceof Error ? error.message : 'Terjadi kesalahan saat mengajukan ulang. Silakan coba lagi.';

            alert(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    const transactionStatusMap: Record<string, string> = {
        success: 'Sukses',
        pending: 'Pending',
        failed: 'Gagal',
    };

    const testingStatusMap: Record<string, string> = {
        testing: 'Menunggu Pengujian',
        completed: 'Selesai',
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat Pengajuan',
            href: '/history/submissions',
        },
        {
            title: `${testRecord.code}`,
            href: `/history/submissions/${testRecord.code}`,
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
                            <Button variant="outline" className="mt-4 bg-transparent" asChild>
                                <Link href="/history/submissions">
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Pengajuan ${testRecord.code}`} />
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="gap-6 lg:col-span-2">
                        <Card className="overflow-hidden p-0 dark:bg-zinc-900">
                            <CardHeader className="border-b bg-slate-50 p-4 dark:bg-zinc-800">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>
                                            <h2>
                                                Detail Pengujian{' '}
                                                {testRecord.submission_type === 'internal'
                                                    ? 'Internal'
                                                    : testRecord.submission_type === 'external'
                                                      ? 'Eksternal'
                                                      : ''}
                                            </h2>
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
                                    <div className="InfoItem grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <InfoItem icon={<FileText className="h-5 w-5" />} label="Kode Pengajuan" value={testRecord.code} />

                                        {testRecord.submission_type === 'external' && (
                                            <>
                                                <InfoItem
                                                    icon={<Factory className="h-5 w-5" />}
                                                    label="Nama Perusahaan"
                                                    value={testRecord.company_name}
                                                />
                                                <InfoItem
                                                    icon={<FolderKanban className="h-5 w-5" />}
                                                    label="Nama Proyek"
                                                    value={testRecord.project_name}
                                                />
                                                <InfoItem
                                                    icon={<MapPin className="h-5 w-5" />}
                                                    label="Alamat Proyek"
                                                    value={testRecord.project_address}
                                                />
                                            </>
                                        )}

                                        {testRecord.submission_type === 'internal' && (
                                            <>
                                                <InfoItem
                                                    icon={<User className="h-5 w-5" />}
                                                    label="Nama Peneliti"
                                                    value={testRecord.researcher_name}
                                                />
                                                <InfoItem
                                                    icon={<FileText className="h-5 w-5" />}
                                                    label="Judul Penelitian"
                                                    value={testRecord.research_title}
                                                />
                                                <InfoItem
                                                    icon={<Users className="h-5 w-5" />}
                                                    label="Jumlah Personel"
                                                    value={String(testRecord.personnel_count)}
                                                />
                                                <InfoItem
                                                    icon={<UserCheck className="h-5 w-5" />}
                                                    label="Nama Supervisor"
                                                    value={testRecord.supervisor}
                                                />
                                            </>
                                        )}

                                        <InfoItem
                                            icon={<Clock className="h-5 w-5" />}
                                            label="Tanggal Pengajuan"
                                            value={formatDate(testRecord.created_at)}
                                        />
                                        <InfoItem
                                            icon={<Clock className="h-5 w-5" />}
                                            label="Tanggal Pengujian Diajukan"
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
                                    <h3 className="mb-4 text-lg font-medium">Detail Pengujian </h3>
                                    <div className="flex flex-col gap-4">
                                        {packageExists &&
                                            (() => {
                                                const externalPackages = submissionHistoryDetail.filter(
                                                    (pkg: SubmissionSchedule) => pkg.package_id && pkg.submission_type === 'external',
                                                );

                                                const totalPackagePrice = externalPackages.reduce((acc, pkg) => acc + pkg.package_price, 0);

                                                return (
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <Package className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-medium">Paket Pengujian</h4>
                                                        </div>

                                                        <div className="flex flex-col gap-2 rounded-lg p-2 lg:p-4">
                                                            {externalPackages.map((pkg: SubmissionSchedule) => {
                                                                if (!pkg.package_id) {
                                                                    return null;
                                                                }

                                                                const packageImages: string[] = Array.isArray(pkg.package_images)
                                                                    ? pkg.package_images
                                                                    : JSON.parse(pkg.package_images || '[]');

                                                                return (
                                                                    <React.Fragment key={pkg.package_id}>
                                                                        <div className="ml-3 rounded-sm bg-blue-50 p-2 lg:p-4 dark:bg-blue-900/20">
                                                                            <Link
                                                                                href={`/packages/${pkg.package_slug}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center justify-between gap-4"
                                                                            >
                                                                                <div className="flex items-center gap-4">
                                                                                    <img
                                                                                        src={`/storage/${packageImages[0]}`}
                                                                                        alt={pkg.package_name}
                                                                                        className="h-20 w-20 rounded-md object-cover"
                                                                                    />
                                                                                    <div className="flex flex-col">
                                                                                        <p className="font-medium">{pkg.package_name}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <p className="min-w-[150px] text-right text-sm font-medium">
                                                                                    Subtotal:{' '}
                                                                                    <span className="font-medium">
                                                                                        Rp {pkg.package_price.toLocaleString('id-ID')}
                                                                                    </span>
                                                                                </p>
                                                                            </Link>
                                                                        </div>
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Show grand total */}
                                                        {externalPackages.length > 0 && (
                                                            <div className="mt-6 ml-7 rounded-lg bg-blue-200 p-4 text-right font-bold dark:bg-blue-700/30">
                                                                Total: Rp {totalPackagePrice.toLocaleString('id-ID')}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                        {testExists &&
                                            (() => {
                                                const externalTests = submissionHistoryDetail.filter(
                                                    (test: SubmissionSchedule) => test.test_id && test.submission_type === 'external',
                                                );

                                                const totalTestPrice = externalTests.reduce((acc, test) => acc + test.quantity * test.test_price, 0);

                                                return (
                                                    <div>
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <HardHat className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-medium">Pengujian Tunggal</h4>
                                                        </div>

                                                        <div className="flex flex-col gap-2 rounded-lg p-2 lg:p-4">
                                                            {submissionHistoryDetail.map((test: SubmissionSchedule) => {
                                                                if (!test.test_id) {
                                                                    return null;
                                                                }

                                                                const testImages: string[] = Array.isArray(test.test_images)
                                                                    ? test.test_images
                                                                    : JSON.parse(test.test_images || '[]');

                                                                const subtotal = test.quantity * test.test_price;

                                                                return (
                                                                    <React.Fragment key={test.test_id}>
                                                                        <Link
                                                                            href={`/tests/${test.test_slug}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="ml-3 rounded-lg bg-blue-50 p-2 transition-colors hover:bg-blue-100 lg:p-4 dark:bg-blue-900/20 dark:hover:bg-blue-800/40"
                                                                        >
                                                                            <div className="flex items-center gap-4">
                                                                                <img
                                                                                    src={`/storage/${testImages[0]}`}
                                                                                    alt={test.test_name}
                                                                                    className="h-20 w-20 rounded-md object-cover"
                                                                                />
                                                                                <div className="flex w-full flex-col justify-center">
                                                                                    <div className="flex justify-between text-sm font-medium">
                                                                                        <span>
                                                                                            {test.test_name} × {test.quantity}
                                                                                        </span>
                                                                                        {test.submission_type === 'external' && (
                                                                                            <span>
                                                                                                Subtotal: Rp {subtotal.toLocaleString('id-ID')}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    {test.submission_type === 'external' && (
                                                                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                                                                            Harga Satuan: Rp {test.test_price.toLocaleString('id-ID')}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </React.Fragment>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Show grand total for external tests */}
                                                        {externalTests.length > 0 && (
                                                            <div className="mt-6 ml-7 rounded-lg bg-blue-200 p-4 text-right font-bold dark:bg-blue-700/30">
                                                                Total: Rp {totalTestPrice.toLocaleString('id-ID')}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}

                                        {!testExists && !packageExists && (
                                            <p className="text-gray-500 dark:text-gray-400">Tidak ada detail pengujian</p>
                                        )}
                                    </div>
                                </div>

                                {testRecord.status === 'approved' && testRecord.submission_type === 'external' && relatedTransaction && (
                                    <div className="mt-4 rounded-lg border p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            <h4 className="font-medium">Transaksi Terkait</h4>
                                        </div>
                                        <p className="mb-3 text-sm">
                                            Dikarenakan transaksi terkait pengujian ini telah dibuat, silakan cek detail transaksi untuk informasi
                                            lebih lanjut.
                                        </p>

                                        <div className="space-y-3">
                                            {relatedTransaction.map((transaction: Transaction) => (
                                                <div key={transaction.code} className="rounded-md border p-3 shadow-sm">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>Kode Transaksi:</span>
                                                        <span>{transaction.code}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Status:</span>
                                                        <span
                                                            className={`font-semibold capitalize ${
                                                                transaction.status === 'success'
                                                                    ? 'text-green-600'
                                                                    : transaction.status === 'pending'
                                                                      ? 'text-yellow-600'
                                                                      : 'text-red-600'
                                                            }`}
                                                        >
                                                            {transactionStatusMap[transaction.status] || transaction.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Jumlah:</span>
                                                        <span>Rp {transaction.amount.toLocaleString('id-ID')}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>Batas Pembayaran:</span>
                                                        <span>{transaction.payment_deadline}</span>
                                                    </div>
                                                    <div className="mt-2 text-right">
                                                        <Link
                                                            href={`/history/transactions/${transaction.code}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                                        >
                                                            <span>Lihat Detail</span>
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {testRecord.status === 'approved' && relatedTesting && (
                                    <div className="mt-4 rounded-lg border p-4">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Hammer className="h-5 w-5" />
                                            <h4 className="font-medium">Pengujian Terkait</h4>
                                        </div>
                                        <p className="mb-3 text-sm">
                                            Dikarenakan pengujian terkait pengajuan ini telah dibuat, silakan cek detail pengujian untuk informasi
                                            lebih lanjut.
                                        </p>
                                        {relatedTesting.map((testing: Testing) => (
                                            <div key={testing.code} className="rounded-md border p-3 shadow-sm">
                                                <div className="flex justify-between text-sm font-medium">
                                                    <span>Kode Pengujian:</span>
                                                    <span>{testing.code}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Status:</span>
                                                    <span
                                                        className={`font-semibold capitalize ${
                                                            testing.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                                        }`}
                                                    >
                                                        {testingStatusMap[testing.status] || testing.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Tanggal Pengujian:</span>
                                                    <span>{testing.test_date}</span>
                                                </div>
                                                <div className="mt-2 text-right">
                                                    <Link
                                                        href={`/history/testings/${testing.code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                                    >
                                                        <span>Lihat Detail</span>
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <ClipboardCheck className="h-5 w-5 text-green-600" />
                                            <h4 className="font-medium text-green-700 dark:text-green-400">Pengajuan Disetujui</h4>
                                        </div>
                                        <p className="text-sm text-green-700 dark:text-green-400">
                                            Pengajuan Anda telah disetujui. Silakan menunggu konfirmasi dari admin untuk informasi lebih lanjut
                                            terkait pembayaran dan jadwal pengujian.
                                        </p>
                                    </div>
                                )}

                                {testRecord.status === 'submitted' && (
                                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-yellow-600" />
                                            <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Menunggu Persetujuan</h4>
                                        </div>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                            Pengajuan ini sedang dalam proses review dengan waktu pemrosesan maksimal 1 x 24 jam pada hari kerja. Kami
                                            akan memberi tahu Anda setelah pengajuan disetujui atau ditolak.
                                        </p>
                                    </div>
                                )}

                                {testRecord.status === 'rejected' && (
                                    <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                                        <div className="mb-2 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-red-600" />
                                            <h4 className="font-medium text-red-700 dark:text-red-400">Pengajuan Ditolak</h4>
                                        </div>
                                        <p className="mb-3 text-sm text-red-700 dark:text-red-400">
                                            Pengajuan ini ditolak. Silakan cek email anda untuk informasi lebih lanjut mengenai alasan penolakan.
                                        </p>
                                        <Button
                                            onClick={handleRepeatSubmission}
                                            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                    Memproses...
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="h-4 w-4" />
                                                    Ajukan Ulang
                                                </>
                                            )}
                                        </Button>
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
                            <CardHeader className="rounded-t-lg border-b bg-slate-50 p-4 dark:bg-zinc-800">
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
    );
}
