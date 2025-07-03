<?php

namespace App\Filament\Widgets;

use App\Models\SubmissionInternalDetail;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class PendingInternalSubmissionsTable extends BaseWidget
{
    protected static ?string $heading = 'Pengajuan Internal Menunggu Persetujuan';
    
    protected static ?int $sort = 6;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                SubmissionInternalDetail::query()
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
                TextColumn::make('name')
                    ->label('Nama Mahasiswa')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('program_study')
                    ->label('Program Studi')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('research_title')
                    ->label('Judul Penelitian')
                    ->searchable()
                    ->sortable()
                    ->limit(40),
                TextColumn::make('supervisor')
                    ->label('Pembimbing')
                    ->searchable()
                    ->sortable()
                    ->default('-'),
                TextColumn::make('submission.created_at')
                    ->label('Tanggal Pengajuan')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('submission.created_at', 'desc')
            ->paginated([5, 10, 25])
            ->striped()
            ->emptyStateHeading('Tidak ada pengajuan internal yang menunggu persetujuan')
            ->emptyStateDescription('Semua pengajuan internal sudah disetujui atau ditolak.');
    }
}
