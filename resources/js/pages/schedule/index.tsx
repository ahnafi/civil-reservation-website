import React, {useState, useEffect} from 'react';

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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {DatePicker} from '@/components/DatePicker';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { HardHat, ChevronDown } from "lucide-react";
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

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
        status: "Pending",
    },
    {
        date: "2025-03-03",
        company: "Titan Teknik Mandiri",
        status: "Disetujui",
    },
    {
        date: "2025-03-04",
        company: "Puncak Sejahtera Konstruksi",
        status: "Pending",
    },
    {
        date: "2025-03-05",
        company: "Nusantara Megah Konstruksi",
        status: "Disetujui",
    },
];

export default function MainDashboard() {
    const [selectedTest, setSelectedTest] = useState<string | null>(null);
    const [initialDate, setInitialDate] = useState<Date>(new Date());
    const [finalDate, setFinalDate] = useState<Date | undefined>(undefined);
    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        if (alertMessage) {
            toast.error(alertMessage, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setAlertMessage(null);
        }
    }, [alertMessage]);

    const handleInitialDateSelect = (date: Date | undefined) => {
        setInitialDate(date ?? new Date());
    }

    const handleFinalDateSelect = (date: Date | undefined) => {
        if (date && date.getTime() === initialDate.getTime()) {
            setFinalDate(undefined);
        } else if (date && date.getTime() < initialDate.getTime()) {
            setAlertMessage("Tanggal akhir tidak boleh lebih kecil dari tanggal awal");
            setFinalDate(undefined);
            setFinalDateKey(Date.now());
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: "Jadwal Pengujian",
            href: "/dashboard",
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Pengujian" />

            <div className="flex flex-col">
                <div className="page-title">
                    <h1 className="text-4xl text-center mt-2 font-extrabold">Agenda Pengujian Lab Teknik Sipil</h1>
                </div>

                <div className="table-options flex justify-between mx-10 mt-6">
                    <div className="test-type">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="font-medium text-base flex items-center gap-2 px-4 py-2 border rounded-md">
                                <span><HardHat/></span>
                                <span>{selectedTest? selectedTest : "Pilih Tipe Pengujian"}</span>
                                <ChevronDown />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {dummyTestData.map((test, index) => (
                                    <DropdownMenuItem key={index} onClick={()=>setSelectedTest(test)}>
                                        {test}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="date-range-picker flex items-center gap-4">
                        <div className="flex flex-col text-sm">
                            <span>Tanggal Awal:</span>
                            <DatePicker placeholder="Pilih Tanggal Awal" onDateSelect={handleInitialDateSelect}/>
                        </div>
                        -
                        <div className="flex flex-col text-sm">
                            <span>Tanggal Akhir:</span>
                        <DatePicker key={finalDateKey} placeholder="Pilih Tanggal Akhir" onDateSelect={handleFinalDateSelect} />
                        </div>
                    </div>
                </div>

                <div className="ms-3 mt-6 text-lg font-medium text-center">
                    <div> Jadwal Pengujian {selectedTest} </div>
                    {initialDate ? format(initialDate, 'PPPP', { locale: id }) : ''}
                    {finalDate && finalDate !== initialDate ? ` - ${format(finalDate, 'PPPP', { locale: id })}` : ''}
                </div>

                <div className="table-container mx-auto w-[90vw] mt-1">
                    <Table>
                        <TableCaption>Daftar Pengajuan</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40px]"> No </TableHead>
                                <TableHead className="w-[150px]">Tanggal Pengujian</TableHead>
                                <TableHead>Perusahaan</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyTableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.company}</TableCell>
                                    <TableCell>
                                        {row.status === "Disetujui" ? (
                                            <span className="bg-green-500 p-1 font-medium rounded">{row.status}</span>
                                        ) : row.status === "Pending" ? (
                                            <span className="bg-yellow-500 p-1 font-medium rounded">{row.status}</span>
                                        ) : (
                                            row.status
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <ToastContainer />
            </div>
        </AppLayout>
    );
}
