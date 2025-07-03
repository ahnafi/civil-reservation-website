<?php

namespace App\Filament\Widgets;

use App\Models\SubmissionExternalDetail;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingExternalSubmissionsTable extends BaseWidget
{
    protected static ?string $heading = 'Pengajuan Eksternal Menunggu Persetujuan';
    
    protected static ?int $sort = 5;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                SubmissionExternalDetail::query()
                    ->with(['submission.user'])
                    ->whereHas('submission', function ($query) {
                        $query->where('status', 'submitted');
                    })
            )
            ->columns([
                TextColumn::make('submission.code')
                    ->label('Kode Pengajuan')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('submission.user.name')
                    ->label('Pengaju')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('company_name')
                    ->label('Nama Perusahaan')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('project_name')
                    ->label('Nama Proyek')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                TextColumn::make('total_cost')
                    ->label('Total Biaya')
                    ->numeric()
                    ->prefix('Rp ')
                    ->sortable(),
                TextColumn::make('submission.created_at')
                    ->label('Tanggal Pengajuan')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('submission.created_at', 'desc')
            ->paginated([5, 10, 25])
            ->striped()
            ->emptyStateHeading('Tidak ada pengajuan eksternal yang menunggu persetujuan')
            ->emptyStateDescription('Semua pengajuan eksternal sudah disetujui atau ditolak.');
    }
}
