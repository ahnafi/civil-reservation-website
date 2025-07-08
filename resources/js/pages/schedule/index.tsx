'use client';

import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import SearchableSelect from '@/components/ui/SearchableSelect';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SimpleOption, scheduleForSchedule, testForSchedule } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, HardHat, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jadwal Pengujian',
        href: '/schedule',
    },
];

export default function Schedule({ tests }: { tests: SimpleOption[] }) {
    const [selectedTest, setSelectedTest] = useState<SimpleOption | null>(null);
    const [testData, setTestData] = useState<testForSchedule | null>(null);
    const [schedules, setSchedules] = useState<scheduleForSchedule[] | null>(null);
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [finalDateKey, setFinalDateKey] = useState<number>(Date.now());

    // const { data, setData, post, processing, errors } = useForm<{
    //     test_id: number | '';
    // }>({
    //     test_id: '',
    // });

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
                    setAlertMessage(error.response.data.message || 'Terjadi kesalahan.');
                } else {
                    setAlertMessage('Gagal mengambil data jadwal.');
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
                <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm dark:border-zinc-600 dark:from-zinc-800 dark:to-zinc-700">
                    <h1 className="mb-2 text-2xl font-bold text-blue-900 dark:text-zinc-100">Jadwal Pengujian Laboratorium</h1>
                    <p className="text-sm text-blue-700 dark:text-zinc-300">
                        Cek ketersediaan jadwal dan slot pengujian laboratorium berdasarkan jenis pengujian dan rentang tanggal
                    </p>
                </div>

                {/* Filters Section */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                    <h2 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-zinc-200">
                        <Search className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Filter Pencarian
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Test Type Selection */}
                        <div className="test-type">
                            <form>
                                <input type="hidden" name="test_id" value={selectedTest?.id || ''} />
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
                            <label className="mb-2 flex items-center font-medium text-gray-700 dark:text-zinc-300">
                                <Calendar className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                Rentang Tanggal
                            </label>

                            <div className="flex items-center gap-3">
                                <div className="initial-date flex-1">
                                    <DatePicker value={initialDate} placeholder="Pilih Tanggal Awal" onDateSelect={handleInitialDateSelect} />
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
                                <div className="clear-date-button mt-2 flex justify-end text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearDateFilters}
                                        className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
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
                        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-16 shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                            <HardHat size={48} className="mb-4 text-gray-300 dark:text-zinc-600" />
                            <p className="text-xl font-semibold text-gray-500 dark:text-zinc-400">
                                Silahkan pilih jenis pengujian untuk melihat jadwal
                            </p>
                            <p className="mt-2 text-gray-400 dark:text-zinc-500">Informasi jadwal akan ditampilkan setelah memilih jenis pengujian</p>
                        </div>
                    )}

                    {/* Test Details */}
                    {selectedTest && testData != null && schedules != null && (
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="border-b border-blue-100 bg-blue-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800">
                                <h2 className="text-lg font-semibold text-blue-900 dark:text-zinc-200">Detail Pengujian</h2>
                            </div>

                            <div className="p-6">
                                <div className="test-detail flex flex-col gap-6 md:flex-row">
                                    {/* Test Image */}
                                    <div className="test-image flex w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 md:w-1/3 dark:border-zinc-700 dark:bg-zinc-800">
                                        {testData.images && testData.images.length > 0 ? (
                                            <img
                                                src={'/storage/' + testData.images[0]}
                                                alt={testData.name}
                                                className="h-auto max-h-64 w-full rounded-lg object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-zinc-500">
                                                <HardHat size={48} className="mb-2" />
                                                <span>Gambar tidak tersedia</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Test Information */}
                                    <div className="test-info flex w-full flex-col space-y-4 md:w-2/3">
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-zinc-200">{testData.name}</h3>
                                        <p className="text-gray-600 dark:text-zinc-400">{testData.description}</p>

                                        {/* Test Metadata */}
                                        <div className="test-metadata mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div className="rounded-lg border bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                <span className="mb-1 block font-medium text-gray-700 dark:text-zinc-300">Satuan</span>
                                                <span className="text-gray-900 dark:text-zinc-100">{testData.category_name}</span>
                                            </div>
                                            <div className="rounded-lg border bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                <span className="mb-1 block font-medium text-gray-700 dark:text-zinc-300">Minimum Unit</span>
                                                <span className="text-gray-900 dark:text-zinc-100">
                                                    {testData.minimum_unit} {testData.category_name}
                                                </span>
                                            </div>
                                            <div className="rounded-lg border bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                <span className="mb-1 block font-medium text-gray-700 dark:text-zinc-300">Slot Harian</span>
                                                <span className="text-gray-900 dark:text-zinc-100">{testData.daily_slot}</span>
                                            </div>
                                            <div className="rounded-lg border bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                <span className="mb-1 block font-medium text-gray-700 dark:text-zinc-300">Status</span>
                                                <span
                                                    className={`font-medium ${testData.is_active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                                                >
                                                    {testData.is_active ? 'Aktif' : 'Inaktif'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Laboratory Information */}
                                        <div className="laboratory-info mt-4 border-t border-gray-200 pt-4 dark:border-zinc-700">
                                            <h4 className="mb-3 text-lg font-semibold text-gray-800 dark:text-zinc-200">Informasi Laboratorium</h4>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="rounded-lg border bg-blue-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                    <span className="mb-1 block font-medium text-blue-800 dark:text-blue-400">Kode Laboratorium</span>
                                                    <span className="text-blue-900 dark:text-blue-300">{testData.laboratory_code}</span>
                                                </div>
                                                <div className="rounded-lg border bg-blue-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
                                                    <span className="mb-1 block font-medium text-blue-800 dark:text-blue-400">Nama Laboratorium</span>
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
                        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md dark:border-zinc-700 dark:bg-zinc-900">
                            <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800">
                                <h2 className="text-lg font-semibold text-blue-900 dark:text-zinc-200">Jadwal Terambil</h2>
                                <span className="rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-zinc-700 dark:text-blue-400">
                                    {schedules.filter((s) => isWithinDateRange(new Date(s.date), initialDate, finalDate)).length} Jadwal
                                </span>
                            </div>

                            <div className="p-6">
                                <div className="space-y-6">
                                    {schedules
                                        .filter((schedule) => isWithinDateRange(new Date(schedule.date), initialDate, finalDate))
                                        .map((schedule: scheduleForSchedule) => (
                                            <div
                                                key={schedule.id}
                                                className="schedule-item overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800"
                                            >
                                                {/* Schedule Date Header */}
                                                <div className="border-b border-gray-200 bg-gray-100 px-4 py-3 dark:border-zinc-600 dark:bg-zinc-700">
                                                    <div className="text-md font-semibold text-gray-800 dark:text-zinc-200">
                                                        {new Date(schedule.date).toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            weekday: 'long',
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Schedule Details */}
                                                <div className="p-4">
                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-900">
                                                            <span className="mb-1 text-sm text-gray-500 dark:text-zinc-400">Slot Tersedia</span>
                                                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                                                {schedule.available_slots}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-900">
                                                            <span className="mb-1 text-sm text-gray-500 dark:text-zinc-400">Slot Terambil</span>
                                                            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                                                                {schedule.approved_count}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-600 dark:bg-zinc-900">
                                                            <span className="mb-1 text-sm text-gray-500 dark:text-zinc-400">Pengajuan Pending</span>
                                                            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                                                                {schedule.pending_count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                    {/* Empty Schedule State */}
                                    {schedules.filter((s) => isWithinDateRange(new Date(s.date), initialDate, finalDate)).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-zinc-400">
                                            <Calendar size={36} className="mb-2 text-gray-300 dark:text-zinc-600" />
                                            <p>Tidak ada jadwal dalam rentang tanggal yang dipilih</p>
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
