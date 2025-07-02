"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem, Laboratory } from "@/types"
import { Head, Link } from "@inertiajs/react"
import { Building2, MapPin, ExternalLink } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Laboratorium",
        href: "/laboratories",
    },
]

export default function Laboratories({ laboratories }: { laboratories: Laboratory[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laboratorium" />
            <div className="min-h-screen bg-zinc-50 dark:bg-black p-6">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4">Laboratorium Kami</h1>
                        <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
                            Fasilitas laboratorium modern dengan peralatan canggih untuk berbagai kebutuhan pengujian.
                        </p>
                    </div>

                    <div className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {laboratories.map((laboratory: Laboratory) => (
                            <Link href={"/laboratory/" + laboratory.slug} key={laboratory.id} className="block h-full">
                                <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-zinc-900 h-full flex flex-col">
                                    {/* Laboratory Image */}
                                    <div className="relative overflow-hidden">
                                        <img
                                            src={"/storage/" + laboratory.images[0]}
                                            alt={laboratory.name}
                                            className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300 md:h-54 lg:h-60"
                                        />
                                    </div>

                                    <CardHeader className="px-4 pb-2">
                                        <CardTitle>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                                                {laboratory.name}
                                            </h3>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="px-4 pt-0 flex-1 flex flex-col">
                                        <CardDescription className="flex-1 flex flex-col">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 flex-1 line-clamp-3">
                                                {laboratory.description}
                                            </p>

                                            {/* Badges */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 text-xs"
                                                >
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {laboratory.room}
                                                </Badge>
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs"
                                                >
                                                    <Building2 className="w-3 h-3 mr-1" />
                                                    {laboratory.code}
                                                </Badge>
                                            </div>
                                        </CardDescription>

                                        {/* View Details Button */}
                                        <div className="flex items-center justify-end mt-auto">
                                            <div className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 flex items-center gap-1 text-sm">
                                                <ExternalLink className="h-4 w-4" />
                                                <span>Lihat Detail</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
