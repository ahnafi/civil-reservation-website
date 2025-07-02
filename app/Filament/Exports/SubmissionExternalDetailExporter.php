<?php

namespace App\Filament\Exports;

use App\Models\SubmissionExternalDetail;
use Filament\Actions\Exports\ExportColumn;
use Filament\Actions\Exports\Exporter;
use Filament\Actions\Exports\Models\Export;

class SubmissionExternalDetailExporter extends Exporter
{
    protected static ?string $model = SubmissionExternalDetail::class;

    public static function getColumns(): array
    {
        return [
            ExportColumn::make('id')
                ->label('ID'),
            ExportColumn::make('submission.code')
                ->label("Kode Pengajuan"),
            ExportColumn::make('submission.user.name')
                ->label("Nama Pengguna"),
            ExportColumn::make('submission.user.email')
                ->label("Email Pengguna"),
            ExportColumn::make('company_name')
                ->label("Nama Perusahaan"),
            ExportColumn::make('project_name')
                ->label("Nama Proyek"),
            ExportColumn::make('project_address')
                ->label("Alamat Proyek"),
            ExportColumn::make('total_cost')
                ->label("Total Biaya"),
            ExportColumn::make('submission.test_submission_date')
                ->label("Tanggal Pengujian"),
            ExportColumn::make('submission.status')
                ->label("Status Pengajuan")
                ->formatStateUsing(fn(string $state): string => match ($state) {
                    'submitted' => 'Diajukan',
                    'approved' => 'Diterima',
                    'rejected' => 'Ditolak',
                    default => $state,
                }),
            ExportColumn::make('submission.user_note')
                ->label("Catatan Pengguna"),
            ExportColumn::make('submission.admin_note')
                ->label("Catatan Admin"),
            ExportColumn::make('submission.approval_date')
                ->label("Tanggal Disetujui"),
            ExportColumn::make('created_at')
                ->label("Tanggal Dibuat"),
            ExportColumn::make('updated_at')
                ->label("Tanggal Diperbarui"),
        ];
    }

    public static function getCompletedNotificationBody(Export $export): string
    {
        $body = 'Ekspor data pengujian eksternal telah berhasil. ' . number_format($export->successful_rows) . ' ' . str('baris')->plural($export->successful_rows) . ' diekspor.';

        if ($failedRowsCount = $export->getFailedRowsCount()) {
            $body .= ' ' . number_format($failedRowsCount) . ' ' . str('baris')->plural($failedRowsCount) . ' gagal diekspor.';
        }

        return $body;
    }
}
