<?php

namespace App\Filament\Exports;

use App\Models\Submission;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class SubmissionExporter extends Exporter
{
    protected static ?string $model = Submission::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('code')
                ->label("Kode pengajuan"),
            ExportColumn::make('user.name')
                ->label("Nama Pengaju"),
            ExportColumn::make('company_name')
                ->label("Organisasi/Perusahaan"),
            ExportColumn::make('project_name')
                ->label("Nama Proyek"),
            ExportColumn::make('project_address')
                ->label("Alamat Proyek"),
            ExportColumn::make('total_cost')
                ->label("Total Biaya"),
            ExportColumn::make('document')
                ->label("Lampiran"),
            ExportColumn::make('test_submission_date')
                ->label("Tanggal Pengujian"),
            ExportColumn::make('status')
                ->label("Status Pengajuan"),
            ExportColumn::make('note')
                ->label("Catatan"),
            ExportColumn::make('approval_date')
                ->label("Tanggal Disetujui"),
            ExportColumn::make('created_at')
                ->label("Tanggal Dibuat"),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Ekspor data pengajuan peminjaman telah berhasil  ' . number_format($export->successful_rows) . ' ' . str('baris')->plural($export->successful_rows) . ' Diekspor.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('row')->plural($failedRowsCount) . ' failed to export.';
        }

        return $body;
    }
}
