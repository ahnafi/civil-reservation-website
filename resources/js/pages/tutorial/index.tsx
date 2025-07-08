'use client';

import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panduan Reservasi',
        href: '/tutorial',
    },
];

export default function Tutorial() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Panduan Reservasi" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                Ini adalah halaman panduan reservasi pengujian. Silakan ikuti langkah-langkah berikut untuk melakukan reservasi:
            </div>
        </AppLayout>
    );
}
