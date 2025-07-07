"use client"

import { DatePicker } from "@/components/DatePicker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DropdownSelect from "@/components/ui/DropdownSelect"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, LaboratorySimple, SimpleOption, Testing } from "@/types"
import { Head } from "@inertiajs/react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"
import { Beaker, Check, CheckCircle, ChevronDown, Clock, X } from "lucide-react"
import type * as React from "react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { testingColumnLabels, testingColumns, testingStatusOptions } from "./tableConfig"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Riwayat Pengujian",
        href: "/history/tests",
    },
]

export default function Testings({
                                     userTestings,
                                     tests,
                                     packages,
                                     laboratories,
                                 }: {
    userTestings: Testing[]
    tests: SimpleOption[]
    packages: SimpleOption[]
    laboratories: LaboratorySimple[]
}) {
    // Calculate status counts using complex logic (same as datatable)
    const getStatusCounts = () => {
        const counts = {
            completed: 0, // Selesai
            waiting: 0, // Menunggu Pengujian (testing + before test date)
            processing: 0, // Memproses Hasil (testing + after test date)
        }

        const now = new Date()

        userTestings.forEach((testing) => {
            const testDate = new Date(testing.test_date)

            if (testing.status === "completed") {
                counts.completed++
            } else if (testing.status === "testing") {
                if (now < testDate) {
                    counts.waiting++ // Menunggu Pengujian
                } else {
                    counts.processing++ // Memproses Hasil
                }
            }
        })

        return counts
    }

    const statusCounts = getStatusCounts()

    // Testing Table State
    const [testingSorting, setTestingSorting] = useState<SortingState>([])
    const [testingFilters, setTestingFilters] = useState<ColumnFiltersState>([])
    const [testingVisibility, setTestingVisibility] = useState<VisibilityState>({})
    const [testingSelection, setTestingSelection] = useState({})
    const [testingRows, setTestingRows] = useState<number>(10)

    // Testing Table Filter State
    const [testingSelectedStatus, setTestingSelectedStatus] = useState<SimpleOption | null>(null)

    const [testingInitialDate, setTestingInitialDate] = useState<Date | undefined>()
    const [testingFinalDate, setTestingFinalDate] = useState<Date | undefined>()
    const [testingFinalDateKey, setTestingFinalDateKey] = useState<number>(Date.now())

    // Alert State
    const [alertMessage, setAlertMessage] = useState<string | null>(null)

    // Initial Date Select Handlers
    const handleInitialDateSelect = (
        date: Date | undefined,
        setInitialDate: (date: Date | undefined) => void,
        setFinalDate: (date: Date | undefined) => void,
        finalDate: Date | undefined,
    ) => {
        const selected = date ?? new Date()
        setInitialDate(selected)

        if (!finalDate || (date && finalDate.getTime() === selected.getTime())) {
            setFinalDate(selected)
        } else if (selected.getTime() > finalDate.getTime()) {
            setAlertMessage("Tanggal awal tidak boleh lebih besar dari tanggal akhir")
            setFinalDate(selected)
        } else {
            setAlertMessage(null)
        }
    }

    // Final Date Select Handlers
    const handleFinalDateSelect = (
        date: Date | undefined,
        initialDate: Date | undefined,
        setInitialDate: (date: Date | undefined) => void,
        setFinalDate: (date: Date | undefined) => void,
        setAlertMessage: (msg: string | null) => void,
        setFinalDateKey: (key: number) => void,
    ) => {
        if (!initialDate || !date) {
            setFinalDate(date)
            return
        }

        if (!initialDate) {
            setInitialDate(date)
            setFinalDate(date)
            setAlertMessage(null)
            return
        }

        if (date.getTime() === initialDate.getTime()) {
            setFinalDate(date)
        } else if (date.getTime() < initialDate.getTime()) {
            setAlertMessage("Tanggal akhir tidak boleh lebih kecil dari tanggal awal")
            setFinalDate(initialDate)
            setFinalDateKey(Date.now())
        } else {
            setFinalDate(date)
            setAlertMessage(null)
        }
    }

    // Testing Table Definition
    const testingTable = useReactTable<Testing>({
        data: userTestings,
        columns: testingColumns,
        onSortingChange: setTestingSorting,
        onColumnFiltersChange: setTestingFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setTestingVisibility,
        onRowSelectionChange: setTestingSelection,
        state: {
            sorting: testingSorting,
            columnFilters: testingFilters,
            columnVisibility: testingVisibility,
            rowSelection: testingSelection,
        },
    })

    // Column Filter Update
    const updateColumnFilter = (
        setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
        columnId: string,
        value: unknown,
    ) => {
        setFilters((prevFilters) => {
            const otherFilters = prevFilters.filter((f) => f.id !== columnId)
            if (value === undefined || value === null || value === "") {
                return otherFilters
            }
            return [...otherFilters, { id: columnId, value }]
        })
    }

    // Testing Date Column Filter Effect
    useEffect(() => {
        if (testingInitialDate) {
            updateColumnFilter(setTestingFilters, "test_date", {
                start: testingInitialDate,
                end: testingFinalDate ?? testingInitialDate,
            })
        } else {
            updateColumnFilter(setTestingFilters, "test_date", undefined)
        }
    }, [testingInitialDate, testingFinalDate])

    // Reusable Column Filter Effect
    const useColumnFilterEffect = (
        selectedOption: SimpleOption | null,
        setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>,
        columnId: string,
    ) => {
        useEffect(() => {
            if (selectedOption?.name) {
                updateColumnFilter(setFilters, columnId, selectedOption.name)
            } else {
                updateColumnFilter(setFilters, columnId, undefined)
            }
        }, [selectedOption, columnId, setFilters])
    }

    // Testing Status Column Filter Effect
    useColumnFilterEffect(testingSelectedStatus, setTestingFilters, "status")

    // Row Pagination Effect
    const usePageSizeEffect = <T,>(table: TanStackTable<T>, rows: number) => {
        useEffect(() => {
            table.setPageSize(rows)
        }, [rows, table])
    }

    // Testing Table Row Pagination Effect
    usePageSizeEffect(testingTable, testingRows)

    // Alert Message
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
            })
            setAlertMessage(null)
        }
    }, [alertMessage])

    // Filter Dialog State
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Daftar Pengujian" />

            <div className="min-h-screen bg-white dark:bg-black">
                <div className="flex h-full flex-1 flex-col gap-6 overflow-hidden p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="testing col-span-full space-y-2">
                            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
                                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Daftar Pengujian</h1>
                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    Kelola dan pantau daftar pengujian yang sedang berlangsung
                                </p>
                            </div>

                            {/* Status Count Card Summary */}
                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Menunggu Pengujian Count Card */}
                                <Card className="border-l-4 border-l-yellow-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                                            Menunggu Pengujian
                                        </CardTitle>
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {statusCounts.waiting}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengujian yang belum dimulai</p>
                                    </CardContent>
                                </Card>

                                {/* Memproses Hasil Count Card */}
                                <Card className="border-l-4 border-l-blue-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">
                                            Memproses Hasil
                                        </CardTitle>
                                        <Beaker className="h-4 w-4 text-blue-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statusCounts.processing}</div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengujian sedang diproses</p>
                                    </CardContent>
                                </Card>

                                {/* Selesai Count Card */}
                                <Card className="border-l-4 border-l-green-500 bg-white dark:bg-zinc-900">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base font-medium text-gray-600 dark:text-gray-400">Selesai</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {statusCounts.completed}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pengujian yang telah selesai</p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="testing-table-filters small-font-size mb-4 hidden justify-end gap-4 lg:mb-6 lg:flex lg:flex-wrap bg-gray-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-gray-200 dark:border-zinc-800">
                                <div className="status-type">
                                    <DropdownSelect
                                        label="Status"
                                        options={testingStatusOptions}
                                        selectedOption={testingSelectedStatus}
                                        setSelectedOption={setTestingSelectedStatus}
                                        placeholder="Filter Status"
                                        icon={<Check size={18} />}
                                    />
                                </div>
                                <div className="date-range-picker">
                                    <label className="text-foreground font-medium">Tanggal</label>
                                    <div className="flex gap-3">
                                        <div className="initial-date">
                                            <DatePicker
                                                value={testingInitialDate}
                                                placeholder="Pilih Tanggal Awal"
                                                onDateSelect={(date) =>
                                                    handleInitialDateSelect(date, setTestingInitialDate, setTestingFinalDate, testingFinalDate)
                                                }
                                            />
                                        </div>
                                        <div className="flex items-center justify-center">-</div>
                                        <div className="final-date">
                                            <DatePicker
                                                key={testingFinalDateKey}
                                                value={testingFinalDate}
                                                placeholder="Pilih Tanggal Akhir"
                                                onDateSelect={(date) =>
                                                    handleFinalDateSelect(
                                                        date,
                                                        testingInitialDate,
                                                        setTestingInitialDate,
                                                        setTestingFinalDate,
                                                        setAlertMessage,
                                                        setTestingFinalDateKey,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    {(testingInitialDate || testingFinalDate) && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTestingInitialDate(undefined)
                                                setTestingFinalDate(undefined)
                                            }}
                                            className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                                        >
                                            <X size={14} />
                                            Kosongkan pilihan
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tombol Filter untuk Layar Kecil */}
                            <div className="mb-2 flex justify-end lg:mb-4 lg:hidden">
                                <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="bg-blue-600 hover:bg-blue-700 text-white small-font-size font-medium border-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800 dark:border-blue-700"
                                        >
                                            Filter
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="animate-slide-up w-fit p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                                        <DialogHeader>
                                            <DialogTitle>Filter</DialogTitle>
                                        </DialogHeader>
                                        <div className="small-font-size flex flex-col gap-4">
                                            <div className="status-type">
                                                <DropdownSelect
                                                    label="Status"
                                                    options={testingStatusOptions}
                                                    selectedOption={testingSelectedStatus}
                                                    setSelectedOption={setTestingSelectedStatus}
                                                    placeholder="Filter Status"
                                                    icon={<Check size={16} />}
                                                />
                                            </div>
                                            <div className="date-range-picker">
                                                <label className="text-foreground font-medium">Tanggal</label>
                                                <div className="flex justify-between gap-2">
                                                    <div className="initial-date flex flex-col">
                                                        <DatePicker
                                                            value={testingInitialDate}
                                                            placeholder="Pilih Tanggal Awal"
                                                            onDateSelect={(date) =>
                                                                handleInitialDateSelect(
                                                                    date,
                                                                    setTestingInitialDate,
                                                                    setTestingFinalDate,
                                                                    testingFinalDate,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="final-date flex flex-col">
                                                        <DatePicker
                                                            key={testingFinalDateKey}
                                                            value={testingFinalDate}
                                                            placeholder="Pilih Tanggal Akhir"
                                                            onDateSelect={(date) =>
                                                                handleFinalDateSelect(
                                                                    date,
                                                                    testingInitialDate,
                                                                    setTestingInitialDate,
                                                                    setTestingFinalDate,
                                                                    setAlertMessage,
                                                                    setTestingFinalDateKey,
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                                {(testingInitialDate || testingFinalDate) && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setTestingInitialDate(undefined)
                                                            setTestingFinalDate(undefined)
                                                        }}
                                                        className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-1"
                                                    >
                                                        <X size={14} />
                                                        Kosongkan pilihan
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="testing-table-main bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm">
                                <div className="testing-table-option mb-4 flex justify-between lg:mb-6 p-4 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex w-full flex-wrap justify-end gap-2">
                                        <div className="code-search">
                                            <Input
                                                placeholder="Cari Kode Pengujian..."
                                                value={(testingTable.getColumn("code")?.getFilterValue() as string) ?? ""}
                                                onChange={(e) => testingTable.getColumn("code")?.setFilterValue(e.target.value)}
                                                className="border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-blue-500 dark:focus:ring-blue-400 small-font-size w-full rounded-md border py-2 shadow-sm focus:ring-1 focus:outline-none placeholder-zinc-500 dark:placeholder-zinc-400"
                                            />
                                        </div>
                                        <div className="table-column-filter mb-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="small-font-size ml-auto font-normal bg-transparent">
                                                        Kolom <ChevronDown />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {testingTable
                                                        .getAllColumns()
                                                        .filter((column) => column.getCanHide())
                                                        .map((column) => {
                                                            return (
                                                                <DropdownMenuCheckboxItem
                                                                    key={column.id}
                                                                    checked={column.getIsVisible()}
                                                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                                                    className="small-font-size"
                                                                >
                                                                    {testingColumnLabels[column.id] ?? column.id}
                                                                </DropdownMenuCheckboxItem>
                                                            )
                                                        })}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="pagination-rows-selector mb-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="outline" className="small-font-size ml-auto font-normal bg-transparent">
                                                        Tampilkan {testingRows} Baris <ChevronDown className="ml-1 h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {[10, 25, 50, 100].map((size) => (
                                                        <DropdownMenuCheckboxItem
                                                            key={size}
                                                            checked={testingRows === size}
                                                            onCheckedChange={() => setTestingRows(size)}
                                                            className="small-font-size"
                                                        >
                                                            {size} baris
                                                        </DropdownMenuCheckboxItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                                <div className="testing-table-body">
                                    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 mx-4 mb-4">
                                        <Table className="small-font-size bg-white dark:bg-zinc-900">
                                            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/50">
                                                {testingTable.getHeaderGroups().map((headerGroup) => (
                                                    <TableRow key={headerGroup.id}>
                                                        {headerGroup.headers.map((header) => {
                                                            return (
                                                                <TableHead key={header.id}>
                                                                    {header.isPlaceholder
                                                                        ? null
                                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                                </TableHead>
                                                            )
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableHeader>
                                            <TableBody>
                                                {testingTable.getRowModel().rows?.length ? (
                                                    testingTable.getRowModel().rows.map((row, index) => (
                                                        <TableRow
                                                            key={row.id}
                                                            className={
                                                                index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-gray-50 dark:bg-zinc-800/30"
                                                            }
                                                        >
                                                            {row.getVisibleCells().map((cell) => (
                                                                <TableCell key={cell.id}>
                                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={testingColumns.length} className="h-24 text-center">
                                                            No results.
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t border-gray-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                                        <div className="space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => testingTable.previousPage()}
                                                disabled={!testingTable.getCanPreviousPage()}
                                                className="small-font-size"
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => testingTable.nextPage()}
                                                disabled={!testingTable.getCanNextPage()}
                                                className="small-font-size"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </AppLayout>
    )
}
