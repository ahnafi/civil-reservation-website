<?php

namespace App\Filament\Widgets;

use App\Models\Submission;
use App\Models\SubmissionExternalDetail;
use App\Models\SubmissionInternalDetail;
use App\Models\Transaction;
use App\Models\Testing;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SubmissionOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    
    protected function getStats(): array
    {
        // Get counts for different submission statuses
        $totalSubmissions = Submission::count();
        $pendingSubmissions = Submission::where('status', 'submitted')->count();
        $approvedSubmissions = Submission::where('status', 'approved')->count();
        $rejectedSubmissions = Submission::where('status', 'rejected')->count();
        
        // Get external and internal pending counts
        $pendingExternal = SubmissionExternalDetail::whereHas('submission', function ($query) {
            $query->where('status', 'submitted');
        })->count();
        
        $pendingInternal = SubmissionInternalDetail::whereHas('submission', function ($query) {
            $query->where('status', 'submitted');
        })->count();
        
        // Get testing and transaction stats
        $ongoingTests = Testing::where('status', 'testing')->count();
        $pendingTransactions = Transaction::where('status', 'pending')->count();

        return [
            Stat::make('Total Pengajuan', $totalSubmissions)
                ->description('Total seluruh pengajuan')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('primary'),
                
            Stat::make('Menunggu Persetujuan', $pendingSubmissions)
                ->description('Pengajuan yang belum disetujui')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
                
            Stat::make('Eksternal Pending', $pendingExternal)
                ->description('Pengujian eksternal menunggu')
                ->descriptionIcon('heroicon-m-building-office')
                ->color('danger'),
                
            Stat::make('Internal Pending', $pendingInternal)
                ->description('Pengujian internal menunggu')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->color('danger'),
                
            Stat::make('Pengujian Berlangsung', $ongoingTests)
                ->description('Sedang dalam proses pengujian')
                ->descriptionIcon('heroicon-m-beaker')
                ->color('info'),
                
            Stat::make('Transaksi Pending', $pendingTransactions)
                ->description('Menunggu pembayaran')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning'),
        ];
    }
}
