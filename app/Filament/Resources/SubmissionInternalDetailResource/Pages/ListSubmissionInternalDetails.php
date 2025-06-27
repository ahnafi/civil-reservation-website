<?php

namespace App\Filament\Resources\SubmissionInternalDetailResource\Pages;

use App\Filament\Resources\SubmissionInternalDetailResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListSubmissionInternalDetails extends ListRecords
{
    protected static string $resource = SubmissionInternalDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
