'use client';

import AppLayout from '@/layouts/app-layout';
import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { Calendar, HardHat, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@/components/DatePicker';
import SearchableSelect from '@/components/ui/SearchableSelect';
import { type BreadcrumbItem, SimpleOption, testForSchedule, scheduleForSchedule, LaboratorySimple } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Pengujian',
        href: '/schedule',
    },
];

export default function Schedule({ tests, laboratories }: {
    tests: SimpleOption[],
    laboratories: LaboratorySimple[]
}) {
    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
    const [testData, setTestData] = useState<testForSchedule | null>(null);
    const [schedules, setSchedules] = useState<scheduleForSchedule[] | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());

    const { data, setData, post, processing, errors } = useForm<{
        test_id: number | '';
    }>({
        test_id: '',
    });

    // Date initialization
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const [initialDate, setInitialDate] = useState<Date | undefined>(firstDayOfMonth);
    const [finalDate, setFinalDate] = useState<Date | undefined>(lastDayOfMonth);

    // Fetch schedule data when test is selected
    useEffect(() => {
        if (!selectedTest) return;

        const fetchScheduleData = async () => {
            try {
                const response = await axios.post(route('schedule.submit'), {
                    test_id: selectedTest.id,
                });

                const { testData, schedules } = response.data;
                setTestData(testData);
                setSchedules(schedules);
                console.log('Updated Schedules:', schedules);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    setAlertMessage(error.response.data.message || "Terjadi kesalahan.");
                } else {
                    setAlertMessage("Gagal mengambil data jadwal.");
                }
            }
        };

        fetchScheduleData();
    }, [selectedTest]);

    // Toast notification handler
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

    // Utility function to check if date is within range
    function isWithinDateRange(date: Date, start?: Date, end?: Date) {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const s = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : undefined;
        const e = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : undefined;

        if (s && d < s) return false;
        if (e && d > e) return false;
        return true;
    }

    // Date selection handlers
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
            setFinalDateKey(Date.now());
        } else {
            setFinalDate(date);
            setAlertMessage(null);
        }
    };

    const clearDateFilters = () => {
        setInitialDate(undefined);
        setFinalDate(undefined);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jadwal Pengujian" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden rounded-xl p-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-700 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-zinc-600">
                    <h1 className="text-2xl font-bold text-blue-900 dark:text-zinc-100 mb-2">
                        Jadwal Pengujian Laboratorium
                    </h1>
                    <p className="text-blue-700 dark:text-zinc-300 text-sm">
                        Cek ketersediaan jadwal dan slot pengujian laboratorium berdasarkan jenis pengujian dan rentang tanggal
                    </p>
                </div>

                {/* Filters Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md border border-gray-100 dark:border-zinc-700">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-zinc-200 mb-4 flex items-center">
                        <Search className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Filter Pencarian
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Test Type Selection */}
                        <div className="test-type">
                            <form>
                                <input type="hidden" name="test_id" value={data.test_id} />
                                <SearchableSelect
                                    label="Jenis Pengujian"
                                    options={tests}
                                    selectedOption={selectedTest}
                                    setSelectedOption={setSelectedTest}
                                    placeholder="Cari Jenis Pengujian..."
                                    searchIcon={<HardHat size={18} className="text-blue-600 dark:text-blue-400" />}
                                />
                            </form>
                        </div>

                        {/* Date Range Picker */}
                        <div className="date-range-picker">
                            <label className="text-gray-700 dark:text-zinc-300 font-medium mb-2 block flex items-center">
                                <Calendar className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Rentang Tanggal
                            </label>

                            <div className="flex gap-3 items-center">
                                <div className="initial-date flex-1">
                                    <DatePicker
                                        value={initialDate}
                                        placeholder="Pilih Tanggal Awal"
                                        onDateSelect={handleInitialDateSelect}
                                    />
                                </div>

                                <div className="flex items-center justify-center text-gray-500 dark:text-zinc-400">—</div>

                                <div className="final-date flex-1">
                                    <DatePicker
                                        key={finalDateKey}
                                        value={finalDate}
                                        placeholder="Pilih Tanggal Akhir"
                                        onDateSelect={handleFinalDateSelect}
                                    />
                                </div>
                            </div>

                            {/* Clear Date Filter Button */}
                            {(initialDate || finalDate) && (
                                <div className="clear-date-button flex justify-end text-right mt-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearDateFilters}
                                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-zinc-800 flex items-center gap-1 text-xs"
                                    >
                                        <X size={12} />
                                        Hapus Filter Tanggal
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="schedule-content flex w-full flex-col gap-6">

                    {/* Empty State */}
                    {!selectedTest && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700">
                            <HardHat size={48} className="text-gray-300 dark:text-zinc-600 mb-4" />
                            <p className="text-xl font-semibold text-gray-500 dark:text-zinc-400">
                                Silahkan pilih jenis pengujian untuk melihat jadwal
                            </p>
                            <p className="text-gray-400 dark:text-zinc-500 mt-2">
                                Informasi jadwal akan ditampilkan setelah memilih jenis pengujian
                            </p>
                        </div>
                    )}

                    {/* Test Details */}
                    {selectedTest && testData != null && schedules != null && (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            <div className="bg-blue-50 dark:bg-zinc-800 px-6 py-4 border-b border-blue-100 dark:border-zinc-700">
                                <h2 className="text-lg font-semibold text-blue-900 dark:text-zinc-200">Detail Pengujian</h2>
                            </div>

                            <div className="p-6">
                                <div className="test-detail flex flex-col md:flex-row gap-6">

                                    {/* Test Image */}
                                    <div className="test-image w-full md:w-1/3 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-zinc-800 p-4 border border-gray-200 dark:border-zinc-700">
                                        {testData.images && testData.images.length > 0 ? (
                                            <img
                                                src={'/storage/' + testData.images[0]}
                                                alt={testData.name}
                                                className="w-full h-auto max-h-64 object-contain rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-zinc-500">
                                                <HardHat size={48} className="mb-2" />
                                                <span>Gambar tidak tersedia</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Test Information */}
                                    <div className="test-info w-full md:w-2/3 flex flex-col space-y-4">
                                        <h3 className="font-bold text-2xl text-gray-800 dark:text-zinc-200">{testData.name}</h3>
                                        <p className="text-gray-600 dark:text-zinc-400">{testData.description}</p>

                                        {/* Test Metadata */}
                                        <div className="test-metadata grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                <span className="font-medium text-gray-700 dark:text-zinc-300 block mb-1">Satuan</span>
                                                <span className="text-gray-900 dark:text-zinc-100">{testData.category_name}</span>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                <span className="font-medium text-gray-700 dark:text-zinc-300 block mb-1">Minimum Unit</span>
                                                <span className="text-gray-900 dark:text-zinc-100">{testData.minimum_unit} {testData.category_name}</span>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                <span className="font-medium text-gray-700 dark:text-zinc-300 block mb-1">Slot Harian</span>
                                                <span className="text-gray-900 dark:text-zinc-100">{testData.daily_slot}</span>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                <span className="font-medium text-gray-700 dark:text-zinc-300 block mb-1">Status</span>
                                                <span className={`font-medium ${testData.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {testData.is_active ? 'Aktif' : 'Inaktif'}
                        </span>
                                            </div>
                                        </div>

                                        {/* Laboratory Information */}
                                        <div className="laboratory-info mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                                            <h4 className="font-semibold text-lg text-gray-800 dark:text-zinc-200 mb-3">Informasi Laboratorium</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                    <span className="font-medium text-blue-800 dark:text-blue-400 block mb-1">Kode Laboratorium</span>
                                                    <span className="text-blue-900 dark:text-blue-300">{testData.laboratory_code}</span>
                                                </div>
                                                <div className="bg-blue-50 dark:bg-zinc-800 p-3 rounded-lg border dark:border-zinc-700">
                                                    <span className="font-medium text-blue-800 dark:text-blue-400 block mb-1">Nama Laboratorium</span>
                                                    <span className="text-blue-900 dark:text-blue-300">{testData.laboratory_name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule List */}
                    {selectedTest && testData != null && schedules != null && (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            <div className="bg-blue-50 dark:bg-zinc-800 px-6 py-4 border-b border-blue-100 dark:border-zinc-700 flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-blue-900 dark:text-zinc-200">Jadwal Terambil</h2>
                                <span className="bg-blue-100 dark:bg-zinc-700 text-blue-800 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5 rounded">
                  {schedules.filter(s => isWithinDateRange(new Date(s.date), initialDate, finalDate)).length} Jadwal
                </span>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    {schedules
                                        .filter(schedule =>
                                            isWithinDateRange(new Date(schedule.date), initialDate, finalDate)
                                        )
                                        .map((schedule: scheduleForSchedule) => (
                                            <div
                                                key={schedule.id}
                                                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-700 transition hover:shadow-md"
                                            >
                                                {/* Header */}
                                                <div className="bg-gray-100 dark:bg-zinc-800 px-6 py-4 rounded-t-2xl border-b border-gray-200 dark:border-zinc-700">
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                        {new Date(schedule.date).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            weekday: 'long',
                                                        })}
                                                    </h3>
                                                </div>

                                                {/* Body */}
                                                <div className="px-6 py-5">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {/* Available Slot */}
                                                        <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                                                            <span className="text-sm text-gray-500 dark:text-zinc-400">Slot Tersedia</span>
                                                            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{schedule.available_slots}</span>
                                                        </div>

                                                        {/* Approved Count */}
                                                        <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                                                            <span className="text-sm text-gray-500 dark:text-zinc-400">Slot Terambil</span>
                                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{schedule.approved_count}</span>
                                                        </div>

                                                        {/* Pending Count */}
                                                        <div className="flex flex-col items-center bg-gray-50 dark:bg-zinc-800 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                                                            <span className="text-sm text-gray-500 dark:text-zinc-400">Pengajuan Pending</span>
                                                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{schedule.pending_count}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Empty state */}
                                    {schedules.filter(s =>
                                        isWithinDateRange(new Date(s.date), initialDate, finalDate)
                                    ).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 dark:text-zinc-400">
                                            <Calendar size={40} className="mb-3 text-gray-300 dark:text-zinc-600" />
                                            <p className="text-base">Tidak ada jadwal dalam rentang tanggal yang dipilih</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer />
        </AppLayout>
    );
}
