import { ColumnDef } from "@tanstack/react-table";
import { type SubmissionSchedule } from "@/types";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";

// Table Columns Definition
export const columns: ColumnDef<SubmissionSchedule>[] = [
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
    }
];

