import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Transaction } from '@/types';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function TransactionDetail({
    transactionHistoryDetail,
    transactionCode,
}: {
    transactionHistoryDetail: Transaction[];
    transactionCode: string;
}) {
    // Get the first submission record
    const transactionRecord: Transaction = transactionHistoryDetail[0];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat',
            href: '/history',
        },
        {
            title: 'Transaksi',
            href: '/history/transactions',
        },
        {
            title: `${transactionRecord.code}`,
            href: `/history/transaction/${transactionRecord.code}`,
        },
    ];

    console.log(transactionRecord);
    console.log(transactionCode);

    // If no data, show a message
    if (!transactionRecord) {
        return (
            <AppLayout>
                <div className="container mx-auto py-8">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <p>Data transaksi tidak ditemukan</p>
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Pengajuan" />
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">{/* Isi Konten Di Sini */}</div>
            </div>
        </AppLayout>
    );
}
