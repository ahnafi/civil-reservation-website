'use client';

import AppLayout from '@/layouts/app-layout';
import * as React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router, useForm } from '@inertiajs/react';
import { Check, ChevronDown, FlaskConical, HardHat, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
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

export default function Schedule({tests}: {tests: SimpleOption[] } )
 {
     const { data, setData, post, processing, errors } = useForm<{
         test_id: number | '';
     }>({
         test_id: '',
     });

     const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
     const [testData, setTestData] = useState<testForSchedule | null>(null);
     const [schedules, setSchedules] = useState<scheduleForSchedule[] | null>(null);

     useEffect(() => {
         if (!selectedTest) return;

         console.log('Selected Test:', selectedTest);

         const fetchScheduleData = async () => {
             try {
                 const response = await axios.post(route('schedule.submit'), {
                     test_id: selectedTest.id,
                 });

                 console.log('Full Response:', response.data);

                 const { testData, schedules } = response.data;

                 setTestData(testData);
                 setSchedules(schedules);

                 console.log('Updated Test Data:', testData);
                 console.log('Updated Schedules:', schedules);
             } catch (error) {
                 console.error(error);
             }
         };


         fetchScheduleData();
     }, [selectedTest]);

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
                            <div className="schedule-filters small-font-size mb-2 flex hidden justify-end gap-4 lg:mb-4 lg:flex lg:flex-wrap">
                                <div className="test-type">
                                    <form>
                                        <input type="hidden" name="test_id" value={data.test_id} />

                                        <SearchableSelect
                                            label="Jenis Pengujian"
                                            options={tests}
                                            selectedOption={selectedTest}
                                            setSelectedOption={setSelectedTest}
                                            placeholder="Cari Jenis Pengujian..."
                                            searchIcon={<HardHat size={18} />}
                                        />
                                    </form>
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

                            {selectedTest && testData != null && schedules != null && (
                                <div className="results flex w-full rounded-xl bg-card p-4 shadow-md">
                                    {/* Test Information Section */}
                                    <div className="test-detail flex w-full">
                                        <div className="test-image w-1/3 flex items-center justify-center rounded-lg bg-gray-100 p-2">
                                            {testData.images && testData.images.length > 0 ? (
                                                <img
                                                    src={'/storage/test_image/' + testData.images[0]}
                                                    alt={testData.name}
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No image available</span>
                                            )}
                                        </div>

                                        <div className="test-info w-2/3 ml-4 flex flex-col space-y-2">
                                            <h3 className="font-semibold text-xl">{testData.name}</h3>
                                            <p className="text-sm">{testData.description}</p>

                                            {/* Test Metadata */}
                                            <div className="test-metadata grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium">Category:</span> {testData.category_name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Min. Unit:</span> {testData.minimum_unit}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Daily Slots:</span> {testData.daily_slot}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Status:</span> {testData.is_active ? 'Active' : 'Inactive'}
                                                </div>
                                            </div>

                                            {/* Laboratory Information */}
                                            <div className="laboratory-info mt-4 pt-2 border-t border-gray-300">
                                                <div className="font-medium text-lg">Laboratory Information</div>
                                                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                                                    <div>
                                                        <span className="font-medium">Name:</span> {testData.laboratory_name}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Code:</span> {testData.laboratory_code}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedules Section - as a card below the test information */}
                                    <div className="schedules mt-4 p-4 rounded-xl bg-white shadow-lg">
                                        <div className="font-semibold text-xl mb-4">Available Schedules</div>
                                        <div className="schedule-list space-y-3">
                                            {schedules.map((schedule: scheduleForSchedule) => (
                                                <div key={schedule.id} className="schedule-item flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                                                    <div className="schedule-date text-sm font-medium text-gray-700">
                                                        {new Date(schedule.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <div className="schedule-slots text-sm text-gray-500">
                                                        {schedule.available_slots} slots available
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            <ToastContainer />
        </AppLayout>
    );
}
