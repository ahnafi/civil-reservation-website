'use client';

import { Button } from '@/components/ui/button';
import type { ExternalSubmission, InternalSubmission, SimpleOption, Testing, Transaction } from '@/types';
import { formatDate, parseISODate } from '@/utils/date-utils';
import { Link } from '@inertiajs/react';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Download } from 'lucide-react';

// Submission Column Labels
export const externalSubmissionColumnLabels: Record<string, string> = {
    code: 'Kode Pengajuan',
    test_submission_date: 'Tanggal',
    company_name: 'Perusahaan',
    lab_code: 'Lab',
    test_name: 'Jenis Pengujian',
    status: 'Status',
    detail: 'Detail',
};

export const internalSubmissionColumnLabels: Record<string, string> = {
    code: 'Kode Pengajuan',
    test_submission_date: 'Tanggal',
    name: 'Nama Peneliti',
    research_title: 'Judul Penelitian',
    personnel_count: 'Jumlah Personel',
    supervisor_name: 'Nama Supervisor',
    lab_code: 'Lab',
    test_name: 'Jenis Pengujian',
    status: 'Status',
    detail: 'Detail',
};

// Submission Status Options
export const submissionStatusOptions: SimpleOption[] = [
    { id: 1, name: 'Approved' },
    { id: 2, name: 'Rejected' },
    { id: 3, name: 'Submitted' },
];

// Transaction Status Options
export const transactionStatusOptions: SimpleOption[] = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Success' },
    { id: 3, name: 'Failed' },
];

// Testing Status Options
export const testingStatusOptions: SimpleOption[] = [
    { id: 1, name: 'Testing' },
    { id: 2, name: 'Completed' },
];

// Transaction Payment Method Options
export const paymentMethodOptions: SimpleOption[] = [
    { id: 1, name: 'BANK JATENG' },
    { id: 2, name: 'BANK MANDIRI' },
    { id: 3, name: 'BANK BNI' },
    { id: 4, name: 'BANK BRI' },
    { id: 5, name: 'BANK BSI' },
    { id: 6, name: 'BANK BTN' },
];

// Tranction Column Labels
export const transactionColumnLabels: Record<string, string> = {
    code: 'Kode Transaksi',
    created_at: 'Tanggal Dibuat',
    amount: 'Jumlah',
    payment_invoice_files: 'Invoice',
    status: 'Status Pembayaran',
    detail: 'Detail',
};

// Testing Column Labels
export const testingColumnLabels: Record<string, string> = {
    code: 'Kode Pengujian',
    test_date: 'Tanggal Pengujian',
    status: 'Status Pengujian',
    detail: 'Detail',
};

// Format Rupiah  Function
const formatRupiah = (value: number, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// External Submission Columns Definition
export const externalSubmissionColumns: ColumnDef<ExternalSubmission>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'code',
        header: () => <div className="flex w-[5rem] justify-center text-center">Kode Pengajuan</div>,
        cell: ({ row }) => <div className="flex w-[5rem] justify-center text-center capitalize">{row.getValue('code')}</div>,
    },
    {
        accessorKey: 'test_submission_date',
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const rowDate = new Date(row.getValue(columnId));
            const start = new Date(filterValue.start);
            const end = filterValue.end ? new Date(filterValue.end) : start;

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            rowDate.setHours(12, 0, 0, 0);

            return rowDate >= start && rowDate <= end;
        },
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="flex w-[5rem] justify-center text-center"
            >
                Tanggal
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const testDateRaw = row.getValue('test_submission_date') as string;
            const testDate = parseISODate(testDateRaw);
            const formatted = formatDate(testDate);

            return <div className="flex w-[5rem] justify-center text-center capitalize">{formatted}</div>;
        },
    },
    {
        accessorKey: 'company_name',
        header: () => <div className="w-[5rem]">Perusahaan</div>,
        cell: ({ row }) => <div className="w-[7rem]">{row.getValue('company_name')}</div>,
    },
    {
        accessorKey: 'lab_code',
        enableColumnFilter: true,
        header: () => <div className="flex w-[4rem] justify-center">Lab</div>,
        cell: ({ row }) => <div className="flex w-[4rem] justify-center">{row.getValue('lab_code')}</div>,
    },
    {
        accessorKey: 'test_name',
        enableColumnFilter: true,
        header: () => <div className="text-center">Jenis Pengujian</div>,
        cell: ({ row }) => {
            const test = row.getValue('test_name') as string | null;
            const pkg = row.original.package_name as string | null;
            return <div>{test || pkg || '-'}</div>;
        },
    },
    {
        accessorKey: 'status',
        enableColumnFilter: true,
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue('status');
            const statusColor =
                status === 'approved'
                    ? 'bg-green-600 dark:bg-green-700'
                    : status === 'rejected'
                      ? 'bg-red-600 dark:bg-red-700'
                      : 'bg-yellow-600 dark:bg-yellow-700';

            return (
                <div className="flex w-full justify-center">
                    <span
                        className={`items-center rounded-lg px-3 py-1.5 text-center text-sm font-medium text-white capitalize shadow-sm ${statusColor}`}
                    >
                        {row.getValue('status')}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'detail',
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Link
                    href={`/history/submission/${row.original.code}`}
                    className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Detail</span>
                </Link>
            </div>
        ),
    },
];

// Internal Submission Columns Definition
export const internalSubmissionColumns: ColumnDef<InternalSubmission>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'code',
        header: () => <div className="flex w-[5rem] justify-center text-center">Kode Pengajuan</div>,
        cell: ({ row }) => <div className="flex w-[5rem] justify-center text-center capitalize">{row.getValue('code')}</div>,
    },
    {
        accessorKey: 'test_submission_date',
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const rowDate = new Date(row.getValue(columnId));
            const start = new Date(filterValue.start);
            const end = filterValue.end ? new Date(filterValue.end) : start;

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            rowDate.setHours(12, 0, 0, 0);

            return rowDate >= start && rowDate <= end;
        },
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="flex w-[5rem] justify-center text-center"
            >
                Tanggal
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => {
            const testDateRaw = row.getValue('test_submission_date') as string;
            const testDate = parseISODate(testDateRaw);
            const formatted = formatDate(testDate);

            return <div className="flex w-[5rem] justify-center text-center capitalize">{formatted}</div>;
        },
    },
    {
        accessorKey: 'name',
        header: () => <div className="w-[6rem]">Nama Peneliti</div>,
        cell: ({ row }) => <div className="w-[6rem]">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'research_title',
        header: () => <div className="w-[8rem]">Judul Penelitian</div>,
        cell: ({ row }) => (
            <div className="w-[8rem]">
                <span className="line-clamp-2 block overflow-hidden text-ellipsis" title={row.getValue('research_title') as string}>
                    {row.getValue('research_title')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'personnel_count',
        header: () => <div className="flex w-[4rem] justify-center">Personel</div>,
        cell: ({ row }) => <div className="flex w-[4rem] justify-center">{row.getValue('personnel_count')}</div>,
    },
    {
        accessorKey: 'lab_code',
        enableColumnFilter: true,
        header: () => <div className="flex w-[4rem] justify-center">Lab</div>,
        cell: ({ row }) => <div className="flex w-[4rem] justify-center">{row.getValue('lab_code')}</div>,
    },
    {
        accessorKey: 'test_name',
        enableColumnFilter: true,
        header: () => <div className="text-center">Jenis Pengujian</div>,
        cell: ({ row }) => {
            const test = row.getValue('test_name') as string | null;
            const pkg = row.original.package_name as string | null;
            return <div>{test || pkg || '-'}</div>;
        },
    },
    {
        accessorKey: 'status',
        enableColumnFilter: true,
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue('status');
            const statusColor =
                status === 'approved'
                    ? 'bg-green-600 dark:bg-green-700'
                    : status === 'rejected'
                      ? 'bg-red-600 dark:bg-red-700'
                      : 'bg-yellow-600 dark:bg-yellow-700';

            return (
                <div className="flex w-full justify-center">
                    <span
                        className={`items-center rounded-lg px-3 py-1.5 text-center text-sm font-medium text-white capitalize shadow-sm ${statusColor}`}
                    >
                        {row.getValue('status')}
                    </span>
                </div>
            );
        },
    },
    {
        id: 'detail',
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Link
                    href={`/history/submission/${row.original.code}`}
                    className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Detail</span>
                </Link>
            </div>
        ),
    },
];

// Transaction Column Definition
export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'code',
        header: () => <div className="flex w-[7rem] justify-center text-center">Kode Transaksi</div>,
        cell: ({ row }) => (
            <div className="flex w-full">
                <span className="max-w-[6rem] truncate md:max-w-full md:whitespace-normal" title={row.getValue('code')}>
                    {row.getValue('code')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="flex w-[5rem] justify-center text-center"
            >
                Tanggal
                <ArrowUpDown />
            </Button>
        ),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const rowDate = new Date(row.getValue(columnId));
            const start = new Date(filterValue.start);
            const end = filterValue.end ? new Date(filterValue.end) : start;

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            rowDate.setHours(12, 0, 0, 0);

            return rowDate >= start && rowDate <= end;
        },
        cell: ({ row }) => {
            const createdAtRaw = row.getValue('created_at') as string;
            const createdAt = parseISODate(createdAtRaw);
            const formatted = formatDate(createdAt);

            return <div className="flex w-[5rem] justify-center text-center capitalize">{formatted}</div>;
        },
    },
    {
        accessorKey: 'amount',
        header: () => <div className="text-center">Jumlah</div>,
        cell: ({ row }) => {
            const amount = row.getValue('amount') as number;
            return <div className="text-center">{formatRupiah(amount)}</div>;
        },
    },
    {
        accessorKey: 'payment_invoice_files',
        header: () => <div className="text-center">Invoice</div>,
        cell: ({ row }) => {
            const invoices = row.getValue('payment_invoice_files') as string[];

            const handleDownloadAll = () => {
                invoices.forEach((filename) => {
                    const url = `/storage/${filename}`;
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            };

            return (
                <div className="flex justify-center">
                    {invoices && invoices.length > 0 ? (
                        <Button onClick={handleDownloadAll} className="h-auto cursor-pointer gap-1 px-2 py-1 text-xs" size="sm">
                            <Download size={12} />
                            {invoices.length > 1 ? 'Download Semua' : 'Download'}
                        </Button>
                    ) : (
                        '-'
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'status',
        header: () => <div className="w-full text-center">Status Pembayaran</div>,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColor =
                status === 'pending'
                    ? 'bg-yellow-600 dark:bg-yellow-700'
                    : status === 'success'
                      ? 'bg-green-600 dark:bg-green-700'
                      : 'bg-red-600 dark:bg-red-700';

            return (
                <div className="flex w-full justify-center">
                    <div
                        className={`items-center rounded-lg px-3 py-1.5 text-center text-sm font-medium text-white capitalize shadow-sm ${statusColor}`}
                    >
                        {
                            transactionStatusMap[status]
                        }
                    </div>
                </div>
            );
        },
    },
    {
        id: 'detail',
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Link
                    href={`/history/transaction/${row.original.code}`}
                    className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Detail</span>
                </Link>
            </div>
        ),
    },
];

// Testing Column Definition
export const testingColumns: ColumnDef<Testing>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'code',
        header: () => <div className="flex w-[7rem] justify-center text-center">Kode Pengujian</div>,
        cell: ({ row }) => <div className="flex w-[7rem] justify-center text-center capitalize">{row.getValue('code')}</div>,
    },
    {
        accessorKey: 'test_date',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                className="flex w-[5rem] justify-center text-center"
            >
                Tanggal Pengujian
                <ArrowUpDown />
            </Button>
        ),
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
            const rowDate = new Date(row.getValue(columnId));
            const start = new Date(filterValue.start);
            const end = filterValue.end ? new Date(filterValue.end) : start;

            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            rowDate.setHours(12, 0, 0, 0);

            return rowDate >= start && rowDate <= end;
        },
        cell: ({ row }) => {
            const testDateRaw = row.getValue('test_date') as string;
            const testDate = parseISODate(testDateRaw);
            const formatted = formatDate(testDate);

            return <div className="flex w-[5rem] justify-center text-center capitalize">{formatted}</div>;
        },
    },
    {
        accessorKey: 'status',
        header: () => <div className="text-center">Status Pengujian</div>,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const statusColor =
                status === 'testing'
                    ? 'bg-yellow-600 dark:bg-yellow-700'
                    : status === 'completed'
                      ? 'bg-green-600 dark:bg-green-700'
                      : 'bg-red-600 dark:bg-red-700';

            return (
                <div className="flex w-full justify-center">
                    <div
                        className={`items-center rounded-lg px-3 py-1.5 text-center text-sm font-medium text-white capitalize shadow-sm ${statusColor}`}
                    >
                        {row.getValue('status')}
                    </div>
                </div>
            );
            );
        },
    },
    {
        id: 'detail',
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Link
                    href={`/history/test/${row.original.code}`}
                    className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Lihat Detail</span>
                </Link>
            </div>
        ),
    },
];
