<?php

namespace App\Filament\Resources\ScheduleResource\Pages;

use App\Filament\Resources\ScheduleResource;
use Filament\Resources\Pages\ViewRecord;

class ViewSchedule extends ViewRecord
{
    protected static string $resource = ScheduleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Tidak ada action edit atau delete karena sesuai permintaan
        ];
    }

    public function getTitle(): string
    {
        return 'Detail Jadwal Pengujian Laboratorium';
    }
}
