'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData, SubmissionSchedule, Testing, Transaction } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, Banknote, CheckCircle, ClipboardList, Clock, CreditCard, FileText, Hammer, HardHat, XCircle } from 'lucide-react';

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
