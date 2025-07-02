<?php

namespace App\Filament\Resources\SubmissionExternalDetailResource\Pages;

use App\Filament\Resources\SubmissionExternalDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSubmissionExternalDetails extends ListRecords
{
    protected static string $resource = SubmissionExternalDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
