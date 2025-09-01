"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, PaginatedTests, Test, TestCart, LaboratorySimple } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { ChevronLeft, ChevronRight, ExternalLink, ShoppingCart, Building2, Package, Wrench, Search } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { toast, ToastContainer } from "react-toastify"
import DropdownSelect from "@/components/ui/DropdownSelect"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Pengujian",
        href: "/tests",
    },
]

export default function Tests({
                                  tests,
                                  laboratories,
                              }: {
    tests: PaginatedTests
    laboratories: LaboratorySimple[]
}) {
    const [testCart, setTestCart] = useState<TestCart[]>([])
    const [isAdding, setIsAdding] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedLaboratory, setSelectedLaboratory] = useState<LaboratorySimple | null>(null)

    useEffect(() => {
        const savedTest = localStorage.getItem("tests")
        if (savedTest) {
            const parsedTest = JSON.parse(savedTest)
            setTestCart(parsedTest)
        }
    }, [])

    // Filter tests based on search query and selected laboratory
    const filteredTests = useMemo(() => {
        let filtered = tests.data

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (test) =>
                    test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    test.laboratory.code.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Filter by selected laboratory
        if (selectedLaboratory) {
            filtered = filtered.filter((test) => test.laboratory.id === selectedLaboratory.id)
        }

        return filtered
    }, [tests.data, searchQuery, selectedLaboratory])

    const handleAddTestToCart = (test: Test) => {
        setIsAdding(true)
        const existingTest: TestCart | undefined = testCart.find((item) => item.test_id === test.id)
        if (existingTest) {
            toast.error("Pengujian sudah ada di keranjang!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            })
            setIsAdding(false)
        } else {
            const newTestCart: TestCart = {
                test_id: test.id,
                slug: test.slug,
                unit: test.minimum_unit,
                test: test,
            }
            setTestCart([...testCart, newTestCart])
            toast.success(
                <div className="flex flex-col h-full">
                    <div className="text-sm md:text-base mb-2">
                        Pengujian berhasil ditambahkan ke keranjang!
                    </div>
                    <div className="flex justify-end mt-auto">
                        <Link
                            href="/orders/cart"
                            className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 shadow-sm"
                        >
                            Lihat Keranjang
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </Link>
                    </div>
                </div>,
                {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            localStorage.setItem("tests", JSON.stringify([...testCart, newTestCart]))
            setIsAdding(false)
        }
    }

    const formatRupiah = (value: number, currency = "IDR") => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    const truncateText = (text: string, maxLength = 100) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + "..."
    }

    const renderPaginationLinks = () => {
        const { links, current_page, last_page } = tests

        const numberedLinks = links.filter(
            (link) => !link.label.includes("Sebelumnya") && !link.label.includes("Berikutnya"),
        )

        return (
            <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                    variant="outline"
                    size="icon"
                    disabled={current_page === 1}
                    asChild={current_page !== 1}
                    className="border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-transparent"
                >
                    {current_page !== 1 ? (
                        <Link href={tests.prev_page_url || "#"}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span>
              <ChevronLeft className="h-4 w-4" />
            </span>
                    )}
                </Button>
                {numberedLinks.map((link, i: number) => (
                    <Button
                        key={i}
                        variant={link.active ? "default" : "outline"}
                        size="sm"
                        className={
                            link.active
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }
                        asChild={!link.active}
                    >
                        {!link.active ? (
                            <Link href={link.url || "#"} dangerouslySetInnerHTML={{ __html: link.label }} />
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    disabled={current_page === last_page}
                    asChild={current_page !== last_page}
                    className="border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-transparent"
                >
                    {current_page !== last_page ? (
                        <Link href={tests.next_page_url || "#"}>
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span>
              <ChevronRight className="h-4 w-4" />
            </span>
                    )}
                </Button>
            </div>
        )
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengujian" />
            <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Katalog Pengujian</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-6">
                            Temukan berbagai layanan pengujian berkualitas tinggi untuk kebutuhan analisis Anda.
                        </p>

                        {/* Search and Filter Section */}
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col md:flex-row gap-4 items-end justify-center">
                                {/* Search Bar */}
                                <div className="flex-1 max-w-md relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Cari pengujian, kategori, atau laboratorium..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
                                    />
                                </div>

                                {/* Laboratory Filter */}
                                <div className="w-full md:w-auto">
                                    <div className="flex flex-col align-bottom justify-end">
                                        {" "}
                                        {/* Reserve space for clear button */}
                                        <DropdownSelect
                                            label=""
                                            options={laboratories}
                                            selectedOption={selectedLaboratory}
                                            setSelectedOption={setSelectedLaboratory}
                                            placeholder="Semua Lab"
                                            icon={<Building2 className="w-4 h-4" />}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Results Info */}
                    {(searchQuery || selectedLaboratory) && (
                        <div className="mb-6 text-center">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Menampilkan {filteredTests.length} hasil
                                {searchQuery && ` untuk "${searchQuery}"`}
                                {selectedLaboratory && ` di ${selectedLaboratory.name}`}
                            </p>
                            {(searchQuery || selectedLaboratory) && (
                                <div className="mt-2 flex justify-center gap-2 flex-wrap">
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery("")}
                                            className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                        >
                                            Hapus pencarian ✕
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tests Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredTests.map((data: Test) => (
                            <Link href={"/test/" + data.slug} key={data.id} className="block h-full">
                                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-zinc-900 h-full flex flex-col">
                                    {/* Test Image */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={"/storage/" + (data.images && data.images.length > 0 ? data.images[0] : "placeholder.jpg")}
                                            alt={data.name}
                                            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>

                                    <CardHeader className="px-4">
                                        <CardTitle>
                                            <h1 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                {data.name}
                                            </h1>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="px-4 flex-1 flex flex-col">
                                        <CardDescription className="flex-1 flex flex-col">
                                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
                                                {formatRupiah(data.price)}
                                            </div>

                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 flex-1">
                                                {truncateText(data.description, 120)}
                                            </p>

                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs"
                                                >
                                                    <Wrench className="w-3 h-3 mr-1" />
                                                    {data.category.name}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs"
                                                >
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    {data.laboratory.code}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 text-xs"
                                                >
                                                    <Package className="w-3 h-3 mr-1" />
                                                    {data.minimum_unit}
                                                </Badge>
                                            </div>
                                        </CardDescription>

                                        {/* Add to Cart Button */}
                                        <div className="flex items-center justify-end mt-auto">
                                            <Button
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    handleAddTestToCart(data)
                                                }}
                                                disabled={isAdding}
                                                size="sm"
                                                className="bg-blue-600 cursor-pointer hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                <span className="text-sm">Tambah ke keranjang</span>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

                    {/* No Results Message */}
                    {(searchQuery || selectedLaboratory) && filteredTests.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-zinc-400 dark:text-zinc-500 mb-4">
                                <Search className="h-16 w-16 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Tidak ada hasil ditemukan</h3>
                                <p>Coba gunakan kata kunci yang berbeda atau ubah filter laboratorium.</p>
                            </div>
                        </div>
                    )}

                    {/* Pagination - Only show when not searching or filtering */}
                    {!searchQuery && !selectedLaboratory && renderPaginationLinks()}

                    {/* Results Info */}
                    <div className="mt-6 text-center">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchQuery || selectedLaboratory
                  ? `Menampilkan ${filteredTests.length} hasil yang difilter`
                  : `Menampilkan ${tests.from} hingga ${tests.to} dari ${tests.total} pengujian`}
            </span>
                    </div>

                    {/* Toast Container */}
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                        className="mt-16"
                    />
                </div>
            </div>
        </AppLayout>
    )
}
