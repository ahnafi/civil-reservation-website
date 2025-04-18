import { Button } from '@/components/ui/button';
import { type GeneralSchedule, SimpleOption } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

// Column Labels
export const columnLabels: Record<string, string> = {
    test_submission_date: 'Tanggal',
    company_name: 'Perusahaan',
    lab_code: 'Lab',
    test_name: 'Jenis Pengujian',
};

// Status Options
export const statusOptions: SimpleOption[] = [
    { id: 1, name: 'Approved' },
    { id: 2, name: 'Rejected' },
    { id: 3, name: 'Submitted' },
];

// Table Columns Definition
export const columns: ColumnDef<GeneralSchedule>[] = [
    {
        header: '#',
        cell: ({ row }) => row.index + 1,
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
        cell: ({ row }) => <div className="flex w-[5rem] justify-center text-center capitalize">{row.getValue('test_submission_date')}</div>,
    },
    {
        accessorKey: 'company_name',
        header: () => <div className="w-fit">Perusahaan</div>,
        cell: ({ row }) => <div className="w-fit">{row.getValue('company_name')}</div>,
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
];
