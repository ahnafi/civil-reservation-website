<?php

namespace App\Filament\Resources\TestingResource\Pages;

use App\Exceptions\SlotUnavailableException;
use App\Filament\Resources\TestingResource;
use App\Services\BookingService;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;

class CreateTesting extends CreateRecord
{
    protected static string $resource = TestingResource::class;

    protected function handleRecordCreation(array $data): Model
    {
        $record = parent::handleRecordCreation($data);

        try {
            // Use your service instead of direct BookingUtils calls
            app(BookingService::class)->storeScheduleTesting($record->id);

        } catch (SlotUnavailableException $e) {
            Notification::make()
                ->title('Gagal membuat jadwal pengujian')
                ->body($e->getMessage())
                ->danger()
                ->send();

            // Optional: remove the created testing record if schedule creation failed
            $record->delete();

            // Stop the redirect/confirmation
            $this->halt();
        }

        return $record;
    }
}
