import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

import DateRangePicker from "@/components/ui/DateRangePicker";
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { HardHat, ChevronDown } from "lucide-react"
import { Head} from '@inertiajs/react';
import InfoCard from '@/components/ui/InfoCard';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// <HardHat />
// <ChevronDown />

const dummyTestData: string[] = [
    "Uji Tarik Baja",
    "Uji Tekan Material",
    "Uji Gradasi Pasir",
    "Uji Abrasi",
    "Uji Marshall",
    "Uji Kekekalan Agregat"
];

const dummyTableData: { date: string; company: string; status: string }[] = [
    {
        date: "2025-03-01",
        company: "Bangun Jaya Konstruksi",
        status: "Disetujui",
    },
    {
        date: "2025-03-02",
        company: "Gunung Mas Perkasa",
        status: "Tidak Disetujui",
    },
    {
        date: "2025-03-03",
        company: "Titan Teknik Mandiri",
        status: "Disetujui",
    },
    {
        date: "2025-03-04",
        company: "Puncak Sejahtera Konstruksi",
        status: "Tidak Disetujui",
    },
    {
        date: "2025-03-05",
        company: "Nusantara Megah Konstruksi",
        status: "Disetujui",
    },
];



export default function MainDashboard() {


    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Dashboard",
            href: "/dashboard",
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-col">
                
            <div className="page-title">
                <h1 className="text-4xl text-center mt-2 font-extrabold">Dashboard</h1>
            </div>

            <div className="user-cards flex justify-evenly mt-6">
                <InfoCard status="Pengajuan" count={5} color="blue"/>
            </div>

            <div className="table-options flex justify-evenly mt-6">
                <div className="test-type">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="font-semibold flex items-center gap-2 px-4 py-2 border rounded-md">
                            <span><HardHat/></span>
                            <span>Pilih Tipe Pengujian</span>
                            <ChevronDown />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {dummyTestData.map((test, index) => (
                                <DropdownMenuItem key={index}>{test}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="date-range-picker">
                    <DateRangePicker/>
                </div>
            </div>

            <div className="table-container mx-auto w-[90vw] mt-6">
                <Table>
                    <TableCaption>Daftar Pengajuan</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">Tanggal Pengujian</TableHead>
                            <TableHead>Perusahaan</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyTableData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.date}</TableCell>
                                <TableCell>{row.company}</TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            </div>

        </AppLayout>
    );

}

