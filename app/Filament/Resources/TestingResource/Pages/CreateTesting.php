<?php

namespace App\Filament\Resources\TestingResource\Pages;

use App\Exceptions\SlotUnavailableException;
use App\Filament\Resources\TestingResource;
use App\Services\BookingService;
use App\Services\BookingUtils;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateTesting extends CreateRecord
{
    protected static string $resource = TestingResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $record = parent::handleRecordCreation($data);

        $testIds = BookingUtils::getTestIdsFromTesting($record->id);

        $unavailableTestNames = BookingUtils::getUnavailableTestNames($testIds, $record->test_date);

        app(BookingService::class)->storeScheduleTesting($record->id);

        if(!empty($unavailableTestNames)) {
            Notification::make()
                ->title('Pengujian berhasil dibuat, tapi jadwal penuh!')
                ->body('Pengujian berhasil dibuat, namun slot jadwal pada tanggal tersebut telah penuh. Silakan atur ulang tanggal pengujian atau sesuaikan jadwal secara manual jika diperlukan.')
                ->warning()
                ->persistent()
                ->send();

            $this->halt();
        }

        return $record;
    }
}
