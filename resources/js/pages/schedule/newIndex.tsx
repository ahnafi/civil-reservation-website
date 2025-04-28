'use client';

import AppLayout from '@/layouts/app-layout';
import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router } from '@inertiajs/react';
import { Check, ChevronDown, FlaskConical, HardHat, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@/components/DatePicker';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { type BreadcrumbItem, SimpleOption, testForSchedule, scheduleForSchedule } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Pengujian',
        href: '/schedule',
    },
];

export default function Schedule({ testData, tests, schedules }: { testData: testForSchedule, tests: SimpleOption[], schedules: scheduleForSchedule })
 {

    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(tests[0]);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const [initialDate, setInitialDate] = useState<Date | undefined>(firstDayOfMonth);
    const [finalDate, setFinalDate] = useState<Date | undefined>(lastDayOfMonth);

    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());

    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    useEffect(() => {
        if (alertMessage) {
            toast.error(alertMessage, {
                position: 'top-center',
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

    useEffect(() => {
        if (selectedTest) {
            Inertia.post(route('schedule.submit'), { test_id: selectedTest.id});
        }
    }, [selectedTest]);

    const handleInitialDateSelect = (date: Date | undefined) => {
        const selected = date ?? new Date();
        setInitialDate(selected);

        if (!finalDate || finalDate.getTime() === selected.getTime()) {
            setFinalDate(selected);
            setAlertMessage(null);
        } else if (selected.getTime() > finalDate.getTime()) {
            setAlertMessage('Tanggal awal tidak boleh lebih besar dari tanggal akhir');
            setFinalDate(selected);
        } else {
            setAlertMessage(null);
        }
    };

    const handleFinalDateSelect = (date: Date | undefined) => {
        if (!date) {
            setFinalDate(undefined);
            return;
        }

        if (!initialDate) {
            setInitialDate(date);
            setFinalDate(date);
            setAlertMessage(null);
            return;
        }

        if (date.getTime() === initialDate.getTime()) {
            setFinalDate(date);
        } else if (date.getTime() < initialDate.getTime()) {
            setAlertMessage('Tanggal akhir tidak boleh lebih kecil dari tanggal awal');
            setFinalDate(initialDate);
            setFinalDateKey(Date.now()); // Force re-render if needed
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Pengujian" />
                <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden rounded-xl p-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="schedule col-span-full space-y-2">
                            <h1 className="title font-semibold">Cek Ketersediaan Jadwal Pengujian Laboratorium</h1>
                            <div className="schdule-filters small-font-size mb-2 flex hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
                                <div className="test-type">
                                    <SearchableSelect
                                        label="Jenis Pengujian"
                                        options={tests}
                                        selectedOption={selectedTest}
                                        setSelectedOption={setSelectedTest}
                                        placeholder="Cari Jenis Pengujian..."
                                        searchIcon={<HardHat size={18} />}
                                    />
                                </div>

                                <div className="date-range-picker flex flex-col gap-1">
                                    <label className="text-foreground font-medium">Tanggal</label>
                                    <div className="flex gap-3">
                                        <div className="initial-date">
                                            <DatePicker value={initialDate} placeholder="Pilih Tanggal Awal" onDateSelect={handleInitialDateSelect} />
                                        </div>
                                        <div className="flex items-center justify-center">-</div>
                                        <div className="final-date">
                                            <DatePicker
                                                key={finalDateKey}
                                                value={finalDate}
                                                placeholder="Pilih Tanggal Akhir"
                                                onDateSelect={handleFinalDateSelect}
                                            />
                                        </div>
                                    </div>

                                    {(initialDate || finalDate) && (
                                        <div className="clear-date-button flex justify-end text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setInitialDate(undefined);
                                                    setFinalDate(undefined);
                                                }}
                                                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs"
                                            >
                                                <X size={12} />
                                                Hapus Filter Tanggal
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="schedule-content flex h-full w-full flex-col gap-4 overflow-hidden rounded-xl bg-card p-4 shadow-md">
                                {!selectedTest &&(
                                    <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-muted-foreground">
                                        Silahkan pilih jenis pengujian untuk melihat jadwal pengujian.....
                                    </div>
                                )}

                                {selectedTest && (
                                    <div className="test-details h-full w-full grid grid-cols-1 rounded-xl bg-card p-4 shadow-md">
                                        {/*<div className="test-image flex h-20 w-full items-center justify-center rounded-xl bg-card">*/}
                                        {/*    <img*/}
                                        {/*        src={'/storage/test_image/' + testData.images[0]}*/}
                                        {/*        alt = {testData.name}*/}
                                        {/*        className="h-48 w-full rounded-md object-cover md:h-54 lg:h-60"*/}
                                        {/*    />*/}
                                        {/*</div>*/}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            <ToastContainer />
        </AppLayout>
    );
}
