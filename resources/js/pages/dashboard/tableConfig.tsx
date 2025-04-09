import { ColumnDef } from "@tanstack/react-table";
import { type SubmissionSchedule, Transaction, Testing, SimpleOption } from "@/types";
import * as React from "react";
import {Button} from "@/components/ui/button";
import {ArrowUpDown} from "lucide-react";

// Submission Column Labels
export const submissionColumnLabels: Record<string, string> = {
    code: "Kode Pengajuan",
    test_submission_date: "Tanggal",
    company_name: "Perusahaan",
    lab_code: "Lab",
    test_name: "Jenis Pengujian",
    status: "Status",
    detail: "Detail",
};

// Submission Status Options
export const submissionStatusOptions: SimpleOption[] = [
    { id: 1, name: "Approved" },
    { id: 2, name: "Rejected" },
    { id: 3, name: "Submitted" },
];

// Submission Columns Definition
export const submissionColumns: ColumnDef<SubmissionSchedule>[] = [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "code",
        header: () => <div className="flex justify-center text-center w-[5rem]">Kode Pengajuan</div>,
        cell: ({ row }) => (
            <div className="capitalize flex justify-center text-center w-[5rem]">{row.getValue("code")}</div>
        ),
    },
    {
        accessorKey: "test_submission_date",
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
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="flex justify-center text-center w-[5rem]"
            >
                Tanggal
                <ArrowUpDown />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize flex justify-center text-center w-[5rem]">
                {row.getValue("test_submission_date")}
            </div>
        ),
    },
    {
        accessorKey: "company_name",
        header: () => <div className="w-[5rem]">Perusahaan</div>,
        cell: ({ row }) => <div className="w-[7rem]">{row.getValue("company_name")}</div>,
    },
    {
        accessorKey: "lab_code",
        enableColumnFilter: true,
        header: () => <div className="flex justify-center w-[4rem]">Lab</div>,
        cell: ({ row }) =>
            <div className="flex justify-center w-[4rem]">{row.getValue("lab_code")}</div>,
    },
    {
        accessorKey: "test_name",
        enableColumnFilter: true,
        header: () => <div className="text-center">Jenis Pengujian</div>,
        cell: ({ row }) => {
            const test = row.getValue("test_name") as string | null;
            const pkg = row.original.package_name as string | null;
            return <div>{test || pkg || "-"}</div>;
        },
    },
    {
        accessorKey: "status",
        enableColumnFilter: true,
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status")
            const statusColor =
                status === "approved"
                    ? "bg-green-500"
                    : status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"

            return (
                <div className={`capitalize text-center items-center rounded-2xl py-1  font-medium ${statusColor}`}>
                    {row.getValue("status")}
                </div>
            )
        },
    },
    {
        id: "detail",
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Button
                    className="cursor-pointer"
                    onClick={() => handleDetailClick(row.original)}
                >
                    Lihat Detail
                </Button>
            </div>
        ),
    },
];

// Format Rupiah  Function
const formatRupiah = (value: number, currency = 'IDR') => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

// Transaction Column Definition
export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "code",
        header: () => <div className="flex justify-center text-center w-[5rem]">Kode Transaksi</div>,
        cell: ({ row }) => (
            <div className="capitalize flex justify-center text-center w-[5rem]">{row.getValue("code")}</div>
        ),
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-center">Jumlah</div>,
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return <div className="text-center">{formatRupiah(amount)}</div>;
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status Pembayaran</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusColor =
                status === "pending"
                    ? "bg-yellow-500"
                    : status === "success"
                        ? "bg-green-500"
                        : "bg-red-500";

            return (
                <div className={`capitalize text-center items-center rounded-2xl py-1  font-medium ${statusColor}`}>
                    {row.getValue("status")}
                </div>
            );
        }
    },
    {
        id: "detail",
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Button
                    className="cursor-pointer"
                    onClick={() => handleDetailClick(row.original)}
                >
                    Lihat Detail
                </Button>
            </div>
        ),
    }
];

// Testing Column Definition
export const testingColumns: ColumnDef<Testing>[] = [
    {
        header: "#",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "code",
        header: () => <div className="flex justify-center text-center w-[5rem]">Kode Pengujian</div>,
        cell: ({ row }) => (
            <div className="capitalize flex justify-center text-center w-[5rem]">{row.getValue("code")}</div>
        ),
    },
    {
         accessorKey: "test_date",
         header: () => <div className="text-center">Tanggal Pengujian</div>,
         cell: ({ row }) => {
             const testDate = row.getValue("test_date") as string;
             return <div className="text-center">{testDate}</div>;
         }
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status Pengujian</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const statusColor =
                status === "testing"
                    ? "bg-yellow-500"
                    : status === "completed"
                        ? "bg-green-500"
                        : "bg-red-500";

            return (
                <div className={`capitalize text-center items-center rounded-2xl py-1  font-medium ${statusColor}`}>
                    {row.getValue("status")}
                </div>
            );
        }
    },
    {
        id: "detail",
        header: () => <div className="flex justify-center text-center">Detail</div>,
        cell: ({ row }) => (
            <div className="flex justify-center">
                <Button
                    className="cursor-pointer"
                    onClick={() => handleDetailClick(row.original)}
                >
                    Lihat Detail
                </Button>
            </div>
        ),
    }
];

